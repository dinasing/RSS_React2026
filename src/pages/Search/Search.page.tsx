import { Component } from 'react';
import { getDefaultBooks, searchBooks } from '../../api/books.api';
import type { SearchResultsType } from '../../types/searchResults.type';
import { trimQuery } from '../../util/trimQuery.util';
import ErrorBoundaryComponent from '../../components/ErrorBoundary/ErrorBoundary.component';
import ErrorButtonComponent from '../../components/ErrorButton/ErrorButton.component';
import PageTitleComponent from '../../components/PageTitle/PageTitle.component';
import SearchFormComponent from '../../components/SearchForm/SearchForm.component';
import SearchResultsComponent from '../../components/SearchResults/SearchResults.component';

type SearchPageState = {
  searchResults: SearchResultsType;
  isLoading: boolean;
  errorMessage: string | null;
};

class SearchPage extends Component {
  state: SearchPageState = {
    searchResults: {} as SearchResultsType,
    isLoading: false,
    errorMessage: null,
  };

  componentDidMount(): void {
    const query = this.getQueryFromLocalStorage();
    if (query) {
      this.handleSearch(query);
    } else {
      this.handleDefaultBooks();
    }
  }

  getQueryFromLocalStorage = () => {
    return trimQuery(localStorage.getItem('query'));
  };

  setQueryToLocalStorage = (query: string) => {
    localStorage.setItem('query', query);
  };

  removeQueryFromLocalStorage = () => {
    localStorage.removeItem('query');
  };

  handleSearch = async (query: string) => {
    const trimmedQuery = trimQuery(query);
    if (!trimmedQuery && this.getQueryFromLocalStorage()) {
      await this.handleDefaultBooks();
      this.removeQueryFromLocalStorage();

      return;
    }

    if (
      this.getQueryFromLocalStorage() === trimmedQuery &&
      this.state.searchResults.numFound
    ) {
      return;
    }

    this.setQueryToLocalStorage(trimmedQuery);
    this.setState(() => ({ isLoading: true, errorMessage: null }));

    try {
      const searchResults = await searchBooks(trimmedQuery);
      this.setState(() => ({ searchResults, isLoading: false }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Search request failed. Please try again.';
      this.setState(() => ({
        errorMessage: message,
        isLoading: false,
        searchResults: { numFound: 0, start: 0, docs: [] },
      }));
    }
  };

  handleDefaultBooks = async () => {
    this.setState(() => ({ isLoading: true, errorMessage: null }));

    try {
      const searchResults = await getDefaultBooks();
      this.setState(() => ({ searchResults, isLoading: false }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Cannot load default books. Please try again.';
      this.setState(() => ({
        errorMessage: message,
        isLoading: false,
        searchResults: { numFound: 0, start: 0, docs: [] },
      }));
    }
  };

  renderLoader() {
    return (
      <div
        className="absolute top-0 left-0
        items-center min-h-dvh min-w-dvw backdrop-blur-sm transition-opacity duration-300"
      >
        <div className="text-2xl italic text-white md:p-96 p-[40%]">
          So many books, so little time...
        </div>
      </div>
    );
  }

  render() {
    const { isLoading, searchResults, errorMessage } = this.state;
    const query = this.getQueryFromLocalStorage();

    return (
      <section className="bg-flannel mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-4 py-16">
        <PageTitleComponent title="Book search!" />
        <SearchFormComponent query={query} handleSearch={this.handleSearch} />
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
            this.renderLoader()
          ) : (
            <SearchResultsComponent searchResults={searchResults} />
          )}
          <ErrorButtonComponent />
        </ErrorBoundaryComponent>
      </section>
    );
  }
}

export default SearchPage;
