import { fireEvent, render, screen } from '@testing-library/react';
import { mockBook } from '../test-utils/fixtures';
import type { SearchResultItemType } from '../types/searchResultItem.type';
import SearchResultItemComponent from './SearchResultItem.component';

describe('SearchResultItemComponent', () => {
  it('renders title, authors, year, and cover image', () => {
    render(<SearchResultItemComponent searchResultItem={mockBook} />);

    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(
      screen.getByText(mockBook.author_name.join(', '))
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(String(mockBook.first_publish_year)))
    ).toBeInTheDocument();
    expect(screen.getByAltText('Book cover')).toBeInTheDocument();
  });

  it('shows unknown author when author list is empty', () => {
    const item: SearchResultItemType = {
      ...mockBook,
      author_name: [],
    };
    render(<SearchResultItemComponent searchResultItem={item} />);

    expect(screen.getByText(/unknown author/i)).toBeInTheDocument();
  });

  it('shows unknown year when first_publish_year is missing', () => {
    const item = {
      ...mockBook,
      first_publish_year: undefined,
    } as unknown as SearchResultItemType;
    render(<SearchResultItemComponent searchResultItem={item} />);

    expect(screen.getByText(/unknown year/i)).toBeInTheDocument();
  });

  it('shows placeholder when cover_i is missing', () => {
    const item = {
      ...mockBook,
      cover_i: undefined,
    } as unknown as SearchResultItemType;
    render(<SearchResultItemComponent searchResultItem={item} />);

    expect(screen.getByText('📖')).toBeInTheDocument();
    expect(screen.queryByAltText('Book cover')).not.toBeInTheDocument();
  });

  it('shows placeholder after image load error', () => {
    render(<SearchResultItemComponent searchResultItem={mockBook} />);

    fireEvent.error(screen.getByAltText('Book cover'));

    expect(screen.getByText('📖')).toBeInTheDocument();
  });

  it('shows cover again after cover_i changes', () => {
    const { rerender } = render(
      <SearchResultItemComponent searchResultItem={mockBook} />
    );

    fireEvent.error(screen.getByAltText('Book cover'));
    expect(screen.getByText('📖')).toBeInTheDocument();

    const nextItem: SearchResultItemType = {
      ...mockBook,
      cover_i: 999999,
    };
    rerender(<SearchResultItemComponent searchResultItem={nextItem} />);

    expect(screen.getByAltText('Book cover')).toBeInTheDocument();
  });
});
