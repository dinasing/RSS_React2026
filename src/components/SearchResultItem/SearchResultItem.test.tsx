import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockBook } from '../../test-utils/fixtures';
import type { SearchResultItemType } from '../../types/searchResultItem.type';
import SearchResultItemComponent from './SearchResultItem.component';

describe('SearchResultItemComponent', () => {
  it('renders title, authors, year, and cover image', () => {
    render(
      <SearchResultItemComponent
        searchResultItem={mockBook}
        onToggleSelect={() => {}}
        onOpenDetails={() => {}}
      />
    );

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
    render(
      <SearchResultItemComponent
        searchResultItem={item}
        onToggleSelect={() => {}}
        onOpenDetails={() => {}}
      />
    );

    expect(screen.getByText(/unknown author/i)).toBeInTheDocument();
  });

  it('shows unknown year when first_publish_year is missing', () => {
    const item = {
      ...mockBook,
      first_publish_year: undefined,
    } as unknown as SearchResultItemType;
    render(
      <SearchResultItemComponent
        searchResultItem={item}
        onToggleSelect={() => {}}
        onOpenDetails={() => {}}
      />
    );

    expect(screen.getByText(/unknown year/i)).toBeInTheDocument();
  });

  it('shows placeholder when cover_i is missing', () => {
    const item = {
      ...mockBook,
      cover_i: undefined,
    } as unknown as SearchResultItemType;
    render(
      <SearchResultItemComponent
        searchResultItem={item}
        onToggleSelect={() => {}}
        onOpenDetails={() => {}}
      />
    );

    expect(screen.getByText('📖')).toBeInTheDocument();
    expect(screen.queryByAltText('Book cover')).not.toBeInTheDocument();
  });

  it('shows placeholder after image load error', () => {
    render(
      <SearchResultItemComponent
        searchResultItem={mockBook}
        onToggleSelect={() => {}}
        onOpenDetails={() => {}}
      />
    );

    fireEvent.error(screen.getByAltText('Book cover'));

    expect(screen.getByText('📖')).toBeInTheDocument();
  });

  it('shows cover again after cover_i changes', () => {
    const { rerender } = render(
      <SearchResultItemComponent
        searchResultItem={mockBook}
        onToggleSelect={() => {}}
        onOpenDetails={() => {}}
      />
    );

    fireEvent.error(screen.getByAltText('Book cover'));
    expect(screen.getByText('📖')).toBeInTheDocument();

    const nextItem: SearchResultItemType = {
      ...mockBook,
      cover_i: 999999,
    };
    rerender(
      <SearchResultItemComponent
        searchResultItem={nextItem}
        onToggleSelect={() => {}}
        onOpenDetails={() => {}}
      />
    );

    expect(screen.getByAltText('Book cover')).toBeInTheDocument();
  });

  it('toggles selection when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSelect = vi.fn();
    const onOpenDetails = vi.fn();

    render(
      <SearchResultItemComponent
        searchResultItem={mockBook}
        onToggleSelect={onToggleSelect}
        onOpenDetails={onOpenDetails}
      />
    );

    await user.click(
      screen.getByRole('checkbox', {
        name: new RegExp(`select ${mockBook.title}`, 'i'),
      })
    );

    expect(onToggleSelect).toHaveBeenCalledWith(mockBook);
    expect(onOpenDetails).not.toHaveBeenCalled();
  });

  it('opens details when card area is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSelect = vi.fn();
    const onOpenDetails = vi.fn();

    render(
      <SearchResultItemComponent
        searchResultItem={mockBook}
        onToggleSelect={onToggleSelect}
        onOpenDetails={onOpenDetails}
      />
    );

    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title, 'i') })
    );

    expect(onOpenDetails).toHaveBeenCalledWith(mockBook.key);
    expect(onToggleSelect).not.toHaveBeenCalled();
  });
});
