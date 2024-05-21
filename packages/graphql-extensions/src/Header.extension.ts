import gql from 'graphql-tag';
import { defaultResolver } from './utils/defaultResolver';

export const typeDefs = gql`
   type Header {
    logoUrl: Link
    navigationItems: [NavigationItem]
    ctAs: [Link]
    mobileCtAs: [Link]
    supernavLink: Link
  }
`;

export const mappers = {
  Header: {
    Header: {
      colorScheme: defaultResolver('colorScheme')
    }
  }
};