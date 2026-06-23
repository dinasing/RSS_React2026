import type { SearchResultItemType } from './searchResultItem.type';

export type SearchResultsType = {
  numFound: number;
  start: number;
  docs: SearchResultItemType[];
};
