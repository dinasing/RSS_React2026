import { Component } from 'react';
import type { SearchResultItemType } from '../types/searchResultItem.type';

class SearchResultItemComponent extends Component<{
  searchResultItem: SearchResultItemType;
}> {
  render() {
    const { searchResultItem } = this.props;
    return (
      <div className="p-4 bg-white rounded-md m-2 flex flex-row justify-between items-center gap-4">
        <p className="flex flex-col gap-2">
          <p className="font-medium">{searchResultItem.title}</p>
          <p className="text-neutral-600">
            {searchResultItem.author_name.join(', ')} (
            {searchResultItem.first_publish_year})
          </p>
        </p>
      </div>
    );
  }
}

export default SearchResultItemComponent;
