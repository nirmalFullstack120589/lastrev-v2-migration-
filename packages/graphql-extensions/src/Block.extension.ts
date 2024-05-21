import gql from 'graphql-tag';

import { defaultResolver } from './utils/defaultResolver';

import type {  Mappers } from '@last-rev/types';

export const typeDefs = gql`
type Block {
  introText: Text
    mediaItems: [Media]
  actions: [Link]
  link: Link
    supplementalContent: Content
    backgroundImage: Media
}
`;

export const mappers: Mappers = {
  Block: {
    Block: {
      variant: defaultResolver('variant') || 'mediaOnLeft'
    }
  }
};
