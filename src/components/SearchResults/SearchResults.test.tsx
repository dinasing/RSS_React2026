import { render, screen } from '@testing-library/react';
import { mockBook, mockBookSearch } from '../../test-utils/fixtures';
import SearchResultsComponent from './SearchResults.component';

describe('SearchResultsComponent', () => {
  it('shows no results message when numFound is 0', () => {
    render(
      <SearchResultsComponent
        searchResults={{ numFound: 0, start: 0, docs: [] }}
      />
    );

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders each result with name and author text', () => {
    render(
      <SearchResultsComponent
        searchResults={{
          numFound: 2,
          start: 0,
          docs: [mockBook, mockBookSearch],
        }}
      />
    );

    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(
      screen.getByText(mockBook.author_name.join(', '))
    ).toBeInTheDocument();
    expect(screen.getByText(mockBookSearch.title)).toBeInTheDocument();
    expect(
      screen.getByText(mockBookSearch.author_name.join(', '))
    ).toBeInTheDocument();
  });
});
