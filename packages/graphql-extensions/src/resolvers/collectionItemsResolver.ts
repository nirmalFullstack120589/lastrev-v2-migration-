import { ApolloContext } from '@last-rev/types';
import { getLocalizedField } from '@last-rev/graphql-contentful-core';

const collectionItemsResolver = async (ref: any, _args: any, ctx: ApolloContext) => {
  const itemsRef = getLocalizedField(ref?.fields, 'items', ctx);

  return itemsRef;
};

export default collectionItemsResolver;
