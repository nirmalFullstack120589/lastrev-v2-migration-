import { ApolloContext } from '@last-rev/types';
import { getLocalizedField } from '@last-rev/graphql-contentful-core';

const SITE_ID = process.env.DEFAULT_SITE_ID || process.env.SITE_ID;

const seoBlogResolver = async (item: any, _args: any, ctx: ApolloContext) => {
  const baseSeo = getLocalizedField(item.fields, 'seo', ctx);
  const title = getLocalizedField(item.fields, 'title', ctx);

  const seo = {
    ...baseSeo,
    'twitter:card': {
      name: 'twitter:card',
      value: 'summary'
    },
    'twitter:title': {
      name: 'twitter:title',
      value: title
    }
  };

  const ogImage = seo?.['og:image'];

  if (ogImage) return seo;

  const listImageRef = getLocalizedField(item?.fields, 'listImage', ctx);
  const listImage =
    listImageRef?.sys?.id &&
    (await ctx.loaders.assetLoader.load({
      id: listImageRef?.sys?.id,
      preview: !!ctx.preview
    }));

  if (listImage) {
    const title = getLocalizedField(listImage.fields, 'title', ctx);
    const file = getLocalizedField(listImage.fields, 'file', ctx);
    return {
      ...seo,
      'og:image': {
        name: 'og:image',
        value: {
          id: listImage.sys.id,
          title,
          url: file?.url
        }
      }
    };
  }

  const featuredMediaRef = getLocalizedField(item?.fields, 'featuredMedia', ctx);
  const featuredMedia =
    featuredMediaRef?.sys?.id &&
    (await ctx.loaders.assetLoader.load({
      id: featuredMediaRef?.sys?.id,
      preview: !!ctx.preview
    }));

  if (featuredMedia) {
    const title = getLocalizedField(featuredMedia.fields, 'title', ctx);
    const file = getLocalizedField(featuredMedia.fields, 'file', ctx);
    return {
      ...seo,
      'og:image': {
        name: 'og:image',
        value: {
          id: featuredMedia.sys.id,
          title,
          url: file?.url
        }
      }
    };
  }

  const site = await ctx.loaders.entryLoader.load({ id: SITE_ID as string, preview: !!ctx.preview });

  if (!site) return seo;

  const siteSeo = getLocalizedField(site.fields, 'seo', ctx);

  const siteOgImage = siteSeo?.['og:image'];

  if (!siteOgImage) return seo;

  return {
    ...seo,
    'og:image': siteOgImage
  };
};

export default seoBlogResolver;
