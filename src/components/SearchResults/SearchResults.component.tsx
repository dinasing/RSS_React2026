import type { SearchResultItemType } from '../../types/searchResultItem.type';
import type { SearchResultsType } from '../../types/searchResults.type';
import PaginationComponent from '../Pagination/Pagination.component';
import SearchResultItemComponent from '../SearchResultItem/SearchResultItem.component';

type SearchResultsComponentProps = {
  searchResults: SearchResultsType;
  page: number;
  selectedWorkKey: string | null;
  onItemSelect: (workKey: string) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const SearchResultsComponent = ({
  searchResults,
  page,
  selectedWorkKey,
  onItemSelect,
  onPrevious,
  onNext,
}: SearchResultsComponentProps) => (
  <section className="border-t-2 border-white py-6">
    {searchResults.numFound === 0 && (
      <p className="text-white font-bold">No results found</p>
    )}
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      {searchResults.docs &&
        searchResults.docs.map((searchResultItem: SearchResultItemType) => (
          <SearchResultItemComponent
            key={searchResultItem.key}
            searchResultItem={searchResultItem}
            isSelected={selectedWorkKey === searchResultItem.key}
            onSelect={onItemSelect}
          />
        ))}
    </div>
    {searchResults.numFound > 0 ? (
      <PaginationComponent
        page={page}
        numFound={searchResults.numFound}
        limit={10}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    ) : null}
  </section>
);

export default SearchResultsComponent;
