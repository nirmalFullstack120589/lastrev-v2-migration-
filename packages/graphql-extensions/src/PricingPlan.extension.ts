import gql from 'graphql-tag';
import { getDefaultFieldValue } from '@last-rev/graphql-contentful-core';
import { ContentfulPathsGenerator, ContentfulLoaders } from '@last-rev/types';

import {createPath} from './utils/createPath';
import headerResolver from './resolvers/headerResolver';
import globalFooterResolver from './resolvers/globalFooterResolver';
import hrefUrlResolver from './resolvers/hrefUrlResolver';

export const typeDefs = gql`
  type PricingPlan {
    header: Header
    footer: GlobalFooter
    slug: String
    planName: String
    planCostText: String
    planCostSubtext: String
    subscribeCta: Link
    featuresCard: RichText
  }
`;

export const mappers = {
  PricingPlan: {
    PricingPlan: {
      header: headerResolver,
      footer: globalFooterResolver
    },
    Card: {
      eyebrow: 'planName',
      title: 'planCostText',
      subtitle: 'planCostSubtext',
      body: 'featuresCard',
      link: 'subscribeCta'
      // actions: ['subscribeCta'
    },
    Link: {
      href: hrefUrlResolver
    }
  }
};

// only checking for the first item
const generateParentPaths = async (
  page: any,
  loaders: ContentfulLoaders,
  defaultLocale: string,
  preview?: boolean,
  paths: string[] = []
): Promise<string[]> => {
  const parentPageRef = getDefaultFieldValue(page, 'parentPage', defaultLocale);

  if (parentPageRef) {
    const parentPage = await loaders.entryLoader.load({ id: parentPageRef.sys.id, preview: !!preview });

    if (parentPage) {
      const parentSlug = getDefaultFieldValue(parentPage as any, 'slug', defaultLocale);
      paths.push(parentSlug);
      return generateParentPaths(parentPage, loaders, defaultLocale, preview, paths);
    }
  }

  return paths;
};

const generatePaths: ContentfulPathsGenerator = async (
  pageItem,
  loaders,
  defaultLocale,
  _locales,
  preview = false,
  _site
) => {
  const slug = getDefaultFieldValue(pageItem, 'slug', defaultLocale);

  const paths = await generateParentPaths(pageItem, loaders, defaultLocale, preview);

  paths.reverse().push(slug);

  const fullPath = createPath(...paths);
  const excludedLocales = getDefaultFieldValue(pageItem, 'excludeFromLocale', defaultLocale) || [];

  return {
    [fullPath]: {
      fullPath,
      isPrimary: true,
      contentId: pageItem?.sys?.id,
      excludedLocales
    }
  };
};

export const pathsConfigs = {
  pricingPlan: generatePaths
};
