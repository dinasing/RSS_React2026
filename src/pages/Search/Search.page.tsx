import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Outlet, useSearchParams } from 'react-router';
import { getDefaultBooks, searchBooks } from '../../api/books.api';
import ErrorBoundaryComponent from '../../components/ErrorBoundary/ErrorBoundary.component';
import ErrorButtonComponent from '../../components/ErrorButton/ErrorButton.component';
import ErrorMessageComponent from '../../components/ErrorMessage/ErrorMessage.component';
import LoaderComponent from '../../components/Loader/Loader.component';
import PageTitleComponent from '../../components/PageTitle/PageTitle.component';
import SearchFormComponent from '../../components/SearchForm/SearchForm.component';
import SearchResultsComponent from '../../components/SearchResults/SearchResults.component';
import { useLocalStorage } from '../../hooks/useLocalStorage/useLocalStorage.hook';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectSelectedItemsByKey,
  selectSelectedItemsCount,
  selectSelectedItemsList,
  toggleItem,
  unselectAll,
} from '../../store/selectedItems/selectedItems.slice';
import type { SearchResultItemType } from '../../types/searchResultItem.type';
import type { SearchResultsType } from '../../types/searchResults.type';
import {
  buildSelectedItemsCsv,
  buildSelectedItemsCsvFilename,
} from '../../util/csv.util';
import {
  buildDetailsSearchParams,
  fromDetailsParam,
} from '../../util/detailsSearchParam.util';
import {
  buildPageSearchParams,
  parsePageParam,
} from '../../util/pageSearchParam.util';
import { trimQuery } from '../../util/trimQuery.util';

const emptySearchResults: SearchResultsType = {
  numFound: 0,
  start: 0,
  docs: [],
};

type BooksRequest = {
  query: string | null;
  page: number;
};

const QUERY_STORAGE_KEY = 'query';

const isSameRequest = (a: BooksRequest, b: BooksRequest) =>
  a.query === b.query && a.page === b.page;

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const selectedItemsByKey = useAppSelector(selectSelectedItemsByKey);
  const selectedItemsList = useAppSelector(selectSelectedItemsList);
  const selectedItemsCount = useAppSelector(selectSelectedItemsCount);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePageParam(searchParams.get('page'));
  const selectedWorkKey = fromDetailsParam(searchParams.get('details'));
  const hasDetails = selectedWorkKey !== null;
  const [storedQuery, setStoredQuery, removeQuery] = useLocalStorage(
    QUERY_STORAGE_KEY,
    null
  );
  const query = storedQuery === null ? null : trimQuery(storedQuery) || null;
  const [searchResults, setSearchResults] = useState<SearchResultsType>(
    {} as SearchResultsType
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadedRequestRef = useRef<BooksRequest | null>(null);

  const openDetails = (workKey: string) => {
    setSearchParams((current) => buildDetailsSearchParams(current, workKey), {
      replace: false,
    });
  };

  const closeDetails = () => {
    setSearchParams((current) => buildDetailsSearchParams(current, null), {
      replace: false,
    });
  };

  const handleMasterPanelClick = () => {
    if (hasDetails) {
      closeDetails();
    }
  };

  const handleItemToggleSelect = (item: SearchResultItemType) => {
    dispatch(toggleItem(item));
  };

  const handleUnselectAll = () => {
    dispatch(unselectAll());
  };

  const handleDownloadSelected = () => {
    if (selectedItemsCount === 0) {
      return;
    }

    const csvContent = buildSelectedItemsCsv(selectedItemsList);
    const fileName = buildSelectedItemsCsvFilename(selectedItemsCount);
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const downloadLink = document.createElement('a');

    downloadLink.href = csvUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(csvUrl);
  };

  const isItemSelected = useCallback(
    (workKey: string) => Boolean(selectedItemsByKey[workKey]),
    [selectedItemsByKey]
  );

  const setPage = (newPage: number) => {
    const validPage = Math.max(1, newPage);
    setSearchParams((current) => buildPageSearchParams(current, validPage), {
      replace: false,
    });
  };

  const loadBooks = useCallback(async (request: BooksRequest) => {
    if (
      loadedRequestRef.current &&
      isSameRequest(loadedRequestRef.current, request)
    ) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const results = request.query
        ? await searchBooks(request.query, request.page)
        : await getDefaultBooks(request.page);
      loadedRequestRef.current = request;
      setSearchResults(results);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : request.query
            ? 'Search request failed. Please try again.'
            : 'Cannot load default books. Please try again.';
      setErrorMessage(message);
      setSearchResults(emptySearchResults);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void loadBooks({ query, page });
    });
  }, [loadBooks, query, page]);

  const handleSearch = (inputQuery: string) => {
    const trimmedQuery = trimQuery(inputQuery);

    if (!trimmedQuery) {
      if (query) {
        removeQuery();
        setPage(1);
      }

      return;
    }

    if (trimmedQuery === query && page === 1) {
      return;
    }

    if (trimmedQuery !== query) {
      setStoredQuery(trimmedQuery);
    }

    if (page !== 1) {
      setPage(1);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <PageTitleComponent title="Book search!" />
      <div
        className={`flex gap-6 ${hasDetails ? 'flex-col md:flex-row' : 'flex-col'}`}
      >
        <div
          className={`flex min-w-0 flex-col gap-6 ${hasDetails ? 'flex-1' : 'w-full'}`}
          onClick={handleMasterPanelClick}
        >
          <SearchFormComponent query={query} handleSearch={handleSearch} />
          {errorMessage ? (
            <ErrorMessageComponent message={errorMessage} />
          ) : null}
          <ErrorBoundaryComponent>
            {isLoading ? (
              <LoaderComponent />
            ) : (
              <SearchResultsComponent
                searchResults={searchResults}
                page={page}
                isItemSelected={isItemSelected}
                onItemToggleSelect={handleItemToggleSelect}
                onItemOpenDetails={openDetails}
                onPrevious={() => setPage(page - 1)}
                onNext={() => setPage(page + 1)}
              />
            )}
            <ErrorButtonComponent />
          </ErrorBoundaryComponent>
        </div>
        {hasDetails ? (
          <aside className="w-full shrink-0 md:w-1/2">
            <Outlet />
          </aside>
        ) : null}
      </div>
      {selectedItemsCount > 0 ? (
        <div className="fixed inset-x-0 bottom-4 z-20 px-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-md bg-slate-900 px-4 py-3 text-white shadow-lg">
            <p className="font-semibold">{selectedItemsCount} selected</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-white px-3 py-2 text-sm font-semibold hover:bg-slate-700"
                onClick={handleUnselectAll}
              >
                Unselect all
              </button>
              <button
                type="button"
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
                onClick={handleDownloadSelected}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default SearchPage;
