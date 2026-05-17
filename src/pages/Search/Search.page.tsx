import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getDefaultBooks, searchBooks } from '../../api/books.api';
import ErrorBoundaryComponent from '../../components/ErrorBoundary/ErrorBoundary.component';
import ErrorButtonComponent from '../../components/ErrorButton/ErrorButton.component';
import PageTitleComponent from '../../components/PageTitle/PageTitle.component';
import SearchFormComponent from '../../components/SearchForm/SearchForm.component';
import SearchResultsComponent from '../../components/SearchResults/SearchResults.component';
import type { SearchResultsType } from '../../types/searchResults.type';
import { trimQuery } from '../../util/trimQuery.util';

const emptySearchResults: SearchResultsType = {
  numFound: 0,
  start: 0,
  docs: [],
};

const getQueryFromLocalStorage = () => trimQuery(localStorage.getItem('query'));

const setQueryToLocalStorage = (query: string) => {
  localStorage.setItem('query', query);
};

const removeQueryFromLocalStorage = () => {
  localStorage.removeItem('query');
};

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<SearchResultsType>(
    {} as SearchResultsType
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchResultsRef = useRef(searchResults);

  useEffect(() => {
    searchResultsRef.current = searchResults;
  }, [searchResults]);

  const handleDefaultBooks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const results = await getDefaultBooks();
      setSearchResults(results);
      setIsLoading(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Cannot load default books. Please try again.';
      setErrorMessage(message);
      setIsLoading(false);
      setSearchResults(emptySearchResults);
    }
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      const trimmedQuery = trimQuery(query);

      if (!trimmedQuery) {
        if (getQueryFromLocalStorage()) {
          await handleDefaultBooks();
          removeQueryFromLocalStorage();
        }

        return;
      }

      if (
        getQueryFromLocalStorage() === trimmedQuery &&
        searchResultsRef.current.numFound
      ) {
        return;
      }

      setQueryToLocalStorage(trimmedQuery);
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const results = await searchBooks(trimmedQuery);
        setSearchResults(results);
        setIsLoading(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Search request failed. Please try again.';
        setErrorMessage(message);
        setIsLoading(false);
        setSearchResults(emptySearchResults);
      }
    },
    [handleDefaultBooks]
  );

  useEffect(() => {
    const query = getQueryFromLocalStorage();
    startTransition(() => {
      if (query) {
        void handleSearch(query);
      } else {
        void handleDefaultBooks();
      }
    });
  }, [handleDefaultBooks, handleSearch]);

  const renderLoader = () => (
    <div
      className="absolute top-0 left-0
        items-center min-h-dvh min-w-dvw backdrop-blur-sm transition-opacity duration-300"
    >
      <div className="text-2xl italic text-white md:p-96 p-[40%]">
        So many books, so little time...
      </div>
    </div>
  );

  const query = getQueryFromLocalStorage();

  return (
    <section className="flex flex-col gap-6">
      <PageTitleComponent title="Book search!" />
      <SearchFormComponent query={query} handleSearch={handleSearch} />
      {errorMessage ? (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 p-4 text-red-900"
        >
          {errorMessage}
        </div>
      ) : null}
      <ErrorBoundaryComponent>
        {isLoading ? (
          renderLoader()
        ) : (
          <SearchResultsComponent searchResults={searchResults} />
        )}
        <ErrorButtonComponent />
      </ErrorBoundaryComponent>
    </section>
  );
};

export default SearchPage;
