// import type { Mappers } from '@last-rev/types';
import { defaultResolver } from './utils/defaultResolver';

export const mappers = {
  Text: {
    Text: {
      variant: defaultResolver('variant'),
      align: defaultResolver('align'),
      colorScheme: defaultResolver('colorScheme')
    }
  }
};
