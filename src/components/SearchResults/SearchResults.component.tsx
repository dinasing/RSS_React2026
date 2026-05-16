import { Component } from 'react';
import type { SearchResultItemType } from '../../types/searchResultItem.type';
import type { SearchResultsType } from '../../types/searchResults.type';
import SearchResultItemComponent from '../SearchResultItem/SearchResultItem.component';

class SearchResultsComponent extends Component<{
  searchResults: SearchResultsType;
}> {
  render() {
    const { searchResults } = this.props;

    return (
      <section className="flex flex-col flex-wrap gap-4 md:flex-row border-t-2 border-white py-6">
        {searchResults.numFound === 0 && (
          <p className="text-white font-bold">No results found</p>
        )}
        {searchResults.docs &&
          searchResults.docs.map((searchResultItem: SearchResultItemType) => (
            <SearchResultItemComponent
              key={searchResultItem.key}
              searchResultItem={searchResultItem}
            />
          ))}
      </section>
    );
  }
}

export default SearchResultsComponent;
