import { defaultResolver } from './utils/defaultResolver';
import cardLinkResolver from './resolvers/cardLinkResolver';

export const mappers = {
  Card: {
    Card: {
      variant: defaultResolver('variant'),
      link: cardLinkResolver
    }
  }
};
