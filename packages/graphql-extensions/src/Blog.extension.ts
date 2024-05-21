import { createRichText, getDefaultFieldValue, getLocalizedField } from '@last-rev/graphql-contentful-core';
import type { ApolloContext, ContentfulLoaders, ContentfulPathsGenerator } from '@last-rev/types';
import { format } from 'date-fns';
import gql from 'graphql-tag';

import { createType } from './utils/createType';
import {pageFooterResolver} from './utils/pageFooterResolver';
import {pageHeaderResolver} from './utils/pageHeaderResolver';

import {breadcrumbsResolver} from './utils/breadcrumbsResolver';
import { createPath } from './utils/createPath';
import getPathUrl from './utils/getPathUrl';
import hrefUrlResolver from './resolvers/hrefUrlResolver';
import seoBlogResolver from './resolvers/seoBlogResolver';

export const typeDefs = gql`
type Blog {
  header: Header
  blogCategories: [CategoryBlog]
  relatedItems: [Link]
  author: Person
  breadcrumbs: [Link]
  contents: [Content]
  modelUsed: [String]
  promptedBy: [String]
  imagesGeneratedBy: [String]
}
`;

// Controls which site the Blogs gets it's global config from
// const BLOGS_SITE_ID = process.env.BLOGS_SITE_ID ?? (process.env.DEFAULT_SITE_ID || process.env.SITE_ID);

// const blogGlobalContentsResolver = async (page: any, _args: any, ctx: ApolloContext) => {
//   // TODO: Make getting a localized resolved link a single function
//   const siteRef: any = getLocalizedField(page.fields, 'site', ctx);
//   const site = await ctx.loaders.entryLoader.load({ id: siteRef?.sys?.id ?? BLOGS_SITE_ID, preview: !!ctx.preview });
//   const siteblogGlobalContents: any = getLocalizedField(site?.fields, 'blogGlobalContents', ctx);
//   return siteblogGlobalContents;
// };

export const mappers = {
  Blog: {
    Blog: {
      header: pageHeaderResolver,
      footer: pageFooterResolver,
      breadcrumbs: breadcrumbsResolver,
      pubDate: async (ref: any, _args: any, ctx: ApolloContext) => {
        const pubDate = getLocalizedField(ref?.fields, 'pubDate', ctx);
        return pubDate && format(new Date(pubDate), 'MMMM dd, yyyy');
      },
      // relatedItems: relatedItemsResolver,
      seo: seoBlogResolver
    },
    Link: {
      href: hrefUrlResolver
    },
    Card: {
      eyebrow: () => {
        return 'Blog';
      },
      media: async (ref: any, _args: any, ctx: ApolloContext) => {
        const listImageRef = getLocalizedField(ref?.fields, 'listImage', ctx);
        const featuredMediaRef = getLocalizedField(ref?.fields, 'featuredMedia', ctx);
        const listImage = await ctx.loaders.assetLoader.load({
          id: listImageRef?.sys?.id ?? featuredMediaRef?.sys?.id,
          preview: !!ctx.preview
        });
        if (listImage) return [listImage];
        return null;
      },
      categories: async (ref: any, _args: any, ctx: ApolloContext) => {
        const categoriesRef: any = getLocalizedField(ref.fields, 'categories', ctx);
        const itemsIds =
          categoriesRef?.map((content: any) => {
            return { id: content?.sys.id, preview: !!ctx.preview };
          }) ?? [];
        const items: any[] = (await ctx.loaders.entryLoader.loadMany(itemsIds?.slice(0, 1))).filter(Boolean);

        return Promise.all(
          items?.map(async (item) => {
            const catTitle = getLocalizedField(item?.fields, 'title', ctx);
            const catSlug = getLocalizedField(item?.fields, 'slug', ctx);
            const catMediaRef = getLocalizedField(item?.fields, 'media', ctx);
            const catMediaItem = await ctx.loaders.assetLoader.load({
              id: catMediaRef?.[0]?.sys?.id,
              preview: !!ctx.preview
            });
            const catMedia = [];
            if (catMediaItem) catMedia.push(catMediaItem);
            const ctaItem = getLocalizedField(item?.fields, 'ctaItem', ctx);

            return createType('category', {
              id: item?.sys?.id,
              title: catTitle,
              slug: catSlug,
              media: catMedia,
              colorScheme: 'Light',
              ctaItem
            });
          })
        );
      },
      body: async (ref: any, _args: any, ctx: ApolloContext) => {
        const summary: any = getLocalizedField(ref.fields, 'summary', ctx);
        if (summary) return createRichText(summary);
        return;
      },
      link: async (ref: any, _args: any, ctx: ApolloContext) => {
        const path = await getPathUrl(ref, ctx);
        return createType('Link', {
          id: ref?.sys?.id,
          manualUrl: path
        });
      },
      actions: async (ref: any, _args: any, ctx: ApolloContext) => {
        const path = await getPathUrl(ref, ctx);
        return [
          createType('Link', {
            id: ref?.sys?.id,
            text: 'Learn More',
            variant: 'CTA 3',
            manualUrl: path
          })
        ];
      }
    }
  }
};

const generateParentPaths = async (
  blog: any,
  loaders: ContentfulLoaders,
  defaultLocale: string,
  preview?: boolean,
  paths: string[] = []
): Promise<string[]> => {
  const parentPageRef = getDefaultFieldValue(blog, 'parentPage', defaultLocale);

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
  blogItem,
  loaders,
  defaultLocale,
  _locales,
  preview = false,
  _site
) => {
  const slug = getDefaultFieldValue(blogItem, 'slug', defaultLocale);

  const paths = await generateParentPaths(blogItem, loaders, defaultLocale, preview);

  paths.reverse().push(slug);

  const fullPath = createPath(...paths);
  const excludedLocales = getDefaultFieldValue(blogItem, 'excludeFromLocale', defaultLocale) || [];

  return {
    [fullPath]: {
      fullPath,
      isPrimary: true,
      contentId: blogItem?.sys?.id,
      excludedLocales
    }
  };
};

export const pathsConfigs = {
  blog: generatePaths
};