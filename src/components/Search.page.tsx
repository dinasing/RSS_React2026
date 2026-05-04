import { Component } from 'react';
import { mockBooksResponse } from '../../mockdata';
import PageTitleComponent from './PageTitle.component';
import SearchInputComponent from './SearchInput.component';
import SearchResultsComponent from './SearchResults.component';

class SearchPage extends Component {
  render() {
    return (
      <section className="bg-flannel mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-4 py-16">
        <PageTitleComponent title="Book search!" />
        <SearchInputComponent />
        <SearchResultsComponent searchResults={mockBooksResponse} />
      </section>
    );
  }
}

export default SearchPage;
