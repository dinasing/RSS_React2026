import type { SearchResultItemType } from '../types/searchResultItem.type';
import type { SearchResultsType } from '../types/searchResults.type';

export const mockBook: SearchResultItemType = {
  key: '/works/OL1W',
  title: 'Test Book',
  author_name: ['Jane Author'],
  first_publish_year: 2001,
  cover_i: 1001,
};

export const mockBookSearch: SearchResultItemType = {
  key: '/works/OL2W',
  title: 'Search Hit',
  author_name: ['Alex Writer'],
  first_publish_year: 1999,
  cover_i: 1002,
};

export const mockDefaultResults: SearchResultsType = {
  numFound: 1,
  start: 0,
  docs: [mockBook],
};

export const mockSearchResults: SearchResultsType = {
  numFound: 1,
  start: 0,
  docs: [mockBookSearch],
};
