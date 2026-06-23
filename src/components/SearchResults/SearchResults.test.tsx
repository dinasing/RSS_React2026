import { screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { ThemeProvider } from '../../context/Theme/Theme.context';
import { mockBook, mockBookSearch } from '../../test-utils/fixtures';
import { renderWithIntl } from '../../test-utils/renderWithIntl';
import SearchResultsComponent from './SearchResults.component';

const renderSearchResults = (
  props: ComponentProps<typeof SearchResultsComponent>
) =>
  renderWithIntl(
    <ThemeProvider>
      <SearchResultsComponent {...props} />
    </ThemeProvider>
  );

describe('SearchResultsComponent', () => {
  it('shows no results message when numFound is 0', () => {
    renderSearchResults({
      searchResults: { numFound: 0, start: 0, docs: [] },
      page: 1,
      isItemSelected: () => false,
      onItemToggleSelect: () => {},
      onItemOpenDetails: () => {},
      onPrevious: () => {},
      onNext: () => {},
    });

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /prev/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /next/i })
    ).not.toBeInTheDocument();
  });

  it('renders each result with name and author text', () => {
    renderSearchResults({
      searchResults: {
        numFound: 2,
        start: 0,
        docs: [mockBook, mockBookSearch],
      },
      page: 1,
      isItemSelected: () => false,
      onItemToggleSelect: () => {},
      onItemOpenDetails: () => {},
      onPrevious: () => {},
      onNext: () => {},
    });

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
