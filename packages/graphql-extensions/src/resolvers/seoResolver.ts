import { ApolloContext } from '@last-rev/types';
import { getLocalizedField } from '@last-rev/graphql-contentful-core';

const SITE_ID = process.env.DEFAULT_SITE_ID || process.env.SITE_ID;

const seoResolver = async (item: any, _args: any, ctx: ApolloContext) => {
  const seo = getLocalizedField(item.fields, 'seo', ctx);

  const ogImage = seo?.['og:image'];

  if (ogImage) return seo;

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

export default seoResolver;
