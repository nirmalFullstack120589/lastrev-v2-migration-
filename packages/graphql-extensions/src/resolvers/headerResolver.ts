import { getLocalizedField } from '@last-rev/graphql-contentful-core';
import { ApolloContext } from '@last-rev/types';

const SITE_ID = process.env.DEFAULT_SITE_ID || process.env.SITE_ID;

const headerResolver = async (page: any, _args: any, ctx: ApolloContext) => {
  const siteRef: any = getLocalizedField(page.fields, 'site', ctx);
  const site = await ctx.loaders.entryLoader.load({ id: siteRef?.sys?.id ?? SITE_ID, preview: !!ctx.preview });
  const siteHeader: any = getLocalizedField(site?.fields, 'header', ctx);

  const header: any = getLocalizedField(page?.fields, 'header', ctx);
  return header ?? siteHeader;
};

export default headerResolver;
