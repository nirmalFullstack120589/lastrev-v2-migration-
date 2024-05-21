import gql from 'graphql-tag';

import { getLocalizedField } from '@last-rev/graphql-contentful-core';
import type { ApolloContext } from '@last-rev/types';
import { defaultResolver } from './utils/defaultResolver';

export const typeDefs = gql`
  extend type GlobalFooter {
    introContents: [Content]
    navigationItems: [NavigationItem]
    socialLinks: [Link]
    disclaimer: RichText
    logo: Media
    logoUrl: Link
    disclaimer: RichText
    socialLinks: [Link]
    navigationItems: [NavigationItem]
    introContents: [Content]
    copyrightDisclaimer: RichText
    legalLinks: [Link]
    localeLinks: [Link]
  }
`;
