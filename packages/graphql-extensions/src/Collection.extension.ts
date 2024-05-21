import { getLocalizedField } from '@last-rev/graphql-contentful-core';
import type { ApolloContext } from '@last-rev/types';
import gql from 'graphql-tag';

import { getWinstonLogger } from '@last-rev/logging';
import { defaultResolver } from './utils/defaultResolver';

const logger = getWinstonLogger({
  package: 'graphql-contentful-extensions',
  module: 'Collection'
});

// Note: If you want anything other than the below, this is where you will add it
const COLLECTION_ITEM_TYPES = ['Card'];

export const typeDefs = gql`
  extend type Collection {
    disableGutters: Boolean
    actions: [Link]
    introText: Text
    items: [CollectionItem]
  }

  union CollectionItem = ${COLLECTION_ITEM_TYPES.join('| ')}
`;

export const collectionItemsResolver = async (ref: any, _args: any, ctx: ApolloContext) => {
  const itemsRef = getLocalizedField(ref?.fields, 'items', ctx);

  return itemsRef;
};
export const mappers = {
  Collection: {
    Collection: {
      variant: defaultResolver('variant'),
      items: collectionItemsResolver,
      itemsVariant: defaultResolver('itemsVariant'),
      itemsWidth: defaultResolver('itemsWidth'),
      gutterWidth: defaultResolver('gutterWidth'),
      colorScheme: defaultResolver('colorScheme'),
      disableGutters: defaultResolver('disableGutters', {
        noCamelCase: true
      })
    }
  }
};