import { Component } from 'react';
import { searchBooks } from '../api/books.api';
import type { SearchResultsType } from '../types/searchResults.type';
import PageTitleComponent from './PageTitle.component';
import SearchFormComponent from './SearchForm.component';
import SearchResultsComponent from './SearchResults.component';

class SearchPage extends Component {
  state = {
    searchResults: {} as SearchResultsType,
    isLoading: false,
  };

  handleSearch = async (query: string) => {
    if (!query) return;
    this.setState(() => ({ isLoading: true }));
    const searchResults = await searchBooks(query);
    this.setState(() => ({ searchResults, isLoading: false }));
  };

  renderLoader() {
    return (
      <div
        className="absolute top-0 left-0
        items-center min-h-dvh min-w-dvw backdrop-blur-sm transition-opacity duration-300"
      >
        <div className="text-2xl italic text-white p-96">
          So many books, so little time...
        </div>
      </div>
    );
  }

  render() {
    const { isLoading, searchResults } = this.state;
    return (
      <section className="bg-flannel mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-4 py-16">
        <PageTitleComponent title="Book search!" />
        <SearchFormComponent handleSearch={this.handleSearch} />
        {isLoading ? (
          this.renderLoader()
        ) : (
          <SearchResultsComponent searchResults={searchResults} />
        )}
      </section>
    );
  }
}

export default SearchPage;
