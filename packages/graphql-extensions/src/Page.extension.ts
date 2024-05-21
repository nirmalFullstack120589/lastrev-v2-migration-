import gql from 'graphql-tag';
import type { ApolloContext, ContentfulLoaders, ContentfulPathsGenerator } from '@last-rev/types';
import {  getDefaultFieldValue, getLocalizedField } from '@last-rev/graphql-contentful-core';
import { defaultResolver } from './utils/defaultResolver';
import pageBreadcrumbsResolver from './resolvers/pageBreadcrumbsResolver';
import seoResolver from './resolvers/seoResolver';
import hrefUrlResolver from './resolvers/hrefUrlResolver';
import { createPath } from './utils/createPath';

const SITE_ID = process.env.DEFAULT_SITE_ID || process.env.SITE_ID;


export const typeDefs = gql`
extend type Page {
  headerOverride: Header
  footerOverride: GlobalFooter
  parentPage: Page
  breadcrumbs: [Link]
}
`;
const headerResolver = async (page: any, _args: any, ctx: ApolloContext) => {
  const header: any = getLocalizedField(page?.fields, 'headerOverride', ctx);
  if (header) {
    return header;
  }

  // get site header
  const siteRef: any = getLocalizedField(page.fields, 'site', ctx);
  const site = await ctx.loaders.entryLoader.load({ id: siteRef?.sys?.id ?? SITE_ID, preview: !!ctx.preview });
  return getLocalizedField(site?.fields, 'header', ctx);
};

export const mappers = {
  Page: {
    Page: {
      colorScheme: defaultResolver('colorScheme'),
      parentPage: 'parentPage',
      breadcrumbs: pageBreadcrumbsResolver,
      seo: seoResolver,
      header: headerResolver
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
  page: generatePaths
};

