'use client';

import { useTranslations } from 'next-intl';
import type { SearchResultItemType } from '../../types/searchResultItem.type';
import type { SearchResultsType } from '../../types/searchResults.type';
import PaginationComponent from '../Pagination/Pagination.component';
import SearchResultItemComponent from '../SearchResultItem/SearchResultItem.component';

type SearchResultsComponentProps = {
  searchResults: SearchResultsType;
  page: number;
  isItemSelected: (workKey: string) => boolean;
  onItemToggleSelect: (item: SearchResultItemType) => void;
  onItemOpenDetails: (workKey: string) => void;
  onPrevious: () => void;
  onNext: () => void;
};

const SearchResultsComponent = ({
  searchResults,
  page,
  isItemSelected,
  onItemToggleSelect,
  onItemOpenDetails,
  onPrevious,
  onNext,
}: SearchResultsComponentProps) => {
  const t = useTranslations('SearchResults');

  return (
    <section className="border-t-2 border-white py-6">
      {searchResults.numFound === 0 && (
        <p className="text-white font-bold">{t('noResults')}</p>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        {searchResults.docs &&
          searchResults.docs.map(
            (searchResultItem: SearchResultItemType, index: number) => (
              <SearchResultItemComponent
                key={searchResultItem.key}
                searchResultItem={searchResultItem}
                isSelected={isItemSelected(searchResultItem.key)}
                isFirstOnPage={index === 0}
                onToggleSelect={onItemToggleSelect}
                onOpenDetails={onItemOpenDetails}
              />
            )
          )}
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
};

export default SearchResultsComponent;
