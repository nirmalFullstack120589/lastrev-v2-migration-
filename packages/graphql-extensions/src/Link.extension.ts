import gql from 'graphql-tag';

import { getLocalizedField } from '@last-rev/graphql-contentful-core';
import type { Mappers, ApolloContext, iPathReader } from '@last-rev/types';

import { createPath } from './utils/createPath';
import { defaultResolver } from './utils/defaultResolver';
import { camelCase } from './utils/camelCase';
import linkIconResolver from './resolvers/linkIconResolver';
import linkIconPositionResolver from './resolvers/linkIconPositionResolver';

type TargetMapping = {
  'New Window': string;
  'Current Window': string;
};

const TARGET_MAPPING: TargetMapping = {
  'New Window': '_blank',
  'Current Window': '_self'
};

const getPathReader = (ctx: ApolloContext): iPathReader  | undefined => {
  return !!ctx.preview ? ctx.pathReaders?.preview : ctx.pathReaders?.prod;
};

const hrefResolver = async (item: any, _args: any, ctx: ApolloContext) => {
  const contentRef = getLocalizedField(item.fields, 'linkedContent', ctx);

  if (contentRef) {
    const content = await ctx.loaders.entryLoader.load({ id: contentRef.sys.id, preview: !!ctx.preview });
    if (content) {
      const path = await getPathReader(ctx)?.getPathsByContentId(content.sys.id, undefined, process.env.SITE);

      // TODO: Do we need to support more items?
      if (!!path?.length) return path[0];
    }
  }

  const manualUrl = getLocalizedField(item.fields, 'manualUrl', ctx);
  if (manualUrl) return manualUrl;

  return '';
};


const targetResolver = async (link: any, _: never, ctx: ApolloContext) => {
  const target = getLocalizedField(link.fields, 'target', ctx);
  return TARGET_MAPPING[target as keyof TargetMapping] ?? '_self';
};

export const mappers = {
  Link: {
    Link: {
      href: hrefResolver,
      variant: defaultResolver('variant', {
        mappings: {
          'Button - Text': 'text',
          'Button - Outline': 'button-outlined',
          'Button - Solid': 'button-contained',
          'CTA 1': 'button-cta1',
          'CTA 2': 'button-cta2',
          'CTA 3': 'button-cta3',
          'CTA 4': 'button-cta4',
          'CTA 5': 'button-cta5',
          'CTA Module': 'button-ctaModule'
        }
      }),
      icon: linkIconResolver,
      iconPosition: linkIconPositionResolver,
      target: defaultResolver('target', {
        mappings: {
          'Default': null,
          'New Window': '_blank',
          'Same Window': '_self',
          'Parent Window': '_parent'
        }
      })
    }
  }
};
