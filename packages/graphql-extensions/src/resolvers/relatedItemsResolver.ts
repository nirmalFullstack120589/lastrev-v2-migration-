import { ApolloContext } from '@last-rev/types';
import { getLocalizedField } from '@last-rev/graphql-contentful-core';
import { queryContentful } from '@last-rev/graphql-contentful-extensions/dist/utils/queryContentful';
import createType from '../utils/createType';
import getPathReader from '../utils/getPathReader';

const relatedItemsResolver = async (ref: any, _args: any, ctx: ApolloContext) => {
  const itemsRef = getLocalizedField(ref?.fields, 'relatedItems', ctx);
  if (ref?.sys?.isMock) return itemsRef;

  let results = itemsRef;

  if (!results) {
    results = await queryContentful({
      contentType: 'blog',
      filters: [
        { id: 'limit', key: 'limit' },
        { id: 'order', key: 'order' }
      ],
      filter: { limit: 3, order: '-fields.pubDate' },
      ctx
    });
  }

  return Promise.all(
    results.map(async (item: any) => {
      const blog = await ctx.loaders.entryLoader.load({ id: item?.sys?.id, preview: !!ctx.preview });
      const title = getLocalizedField(blog?.fields, 'title', ctx);
      const listImageRef = getLocalizedField(blog?.fields, 'listImage', ctx);
      const featuredMediaRef = getLocalizedField(blog?.fields, 'featuredMedia', ctx);
      const media = [];
      const path = await getPathReader(ctx)?.getPathsByContentId(blog?.sys?.id ?? '', undefined, process.env.SITE);
      if (listImageRef) media.push(listImageRef);
      else if (featuredMediaRef) media.push(featuredMediaRef);
      return createType('link', {
        id: blog?.sys?.id,
        title,
        media,
        variant: 'Blog Related Item',
        href: createType('link', {
          manualUrl: path?.[0] ?? '#'
        })
      });
    })
  );
};

export default relatedItemsResolver;
