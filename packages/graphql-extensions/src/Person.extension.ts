import gql from 'graphql-tag';
import type { ApolloContext, ContentfulLoaders, ContentfulPathsGenerator } from '@last-rev/types';
import { getDefaultFieldValue, getLocalizedField } from '@last-rev/graphql-contentful-core';
import hrefUrlResolver from './resolvers/hrefUrlResolver';
import headerResolver from './resolvers/headerResolver';
import globalFooterResolver from './resolvers/globalFooterResolver';
import { createPath } from './utils/createPath';

const SITE_ID = process.env.DEFAULT_SITE_ID || process.env.SITE_ID;

export const typeDefs = gql`
type Person {
  header: Header
  footer: GlobalFooter
  slug: String
  socialLinks: [Link]
}
`;

export const mappers = {
  Person: {
    Person: {
      header: headerResolver,
      footer: globalFooterResolver
    },
    Card: {
      title: 'name',
      subtitle: 'jobTitle',
      media: async (ref: any, _args: any, ctx: ApolloContext) => {
        const mainImageRef = getLocalizedField(ref?.fields, 'mainImage', ctx);
        const rolloverImageRef = getLocalizedField(ref?.fields, 'rolloverImage', ctx);

        const mainImage =
          mainImageRef?.sys?.id &&
          (await ctx.loaders.assetLoader.load({
            id: mainImageRef?.sys?.id,
            preview: !!ctx.preview
          }));

        const rolloverImage =
          rolloverImageRef?.sys?.id &&
          (await ctx.loaders.assetLoader.load({
            id: rolloverImageRef?.sys?.id,
            preview: !!ctx.preview
          }));

        const media = [];

        if (mainImage) media.push(mainImage);
        if (rolloverImage) media.push(rolloverImage);

        return media || [];
      },
      link: null,
      actions: 'socialLinks'
    },
    Link: {
      href: hrefUrlResolver
    }
  }
};

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
  person: generatePaths
};
