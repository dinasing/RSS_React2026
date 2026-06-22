import { fireEvent, screen } from '@testing-library/react';
import { renderWithIntl } from '../../test-utils/renderWithIntl';
import BookCoverComponent from './BookCover.component';

describe('BookCoverComponent', () => {
  it('renders cover image when coverId is provided', () => {
    renderWithIntl(<BookCoverComponent coverId={1001} />);

    expect(screen.getByAltText('Book cover')).toHaveAttribute(
      'src',
      'https://covers.openlibrary.org/b/id/1001-M.jpg'
    );
  });

  it('shows placeholder when coverId is missing', () => {
    renderWithIntl(<BookCoverComponent />);

    expect(screen.getByText('📖')).toBeInTheDocument();
    expect(screen.queryByAltText('Book cover')).not.toBeInTheDocument();
  });

  it('shows placeholder after image load error', () => {
    renderWithIntl(<BookCoverComponent coverId={1001} />);

    fireEvent.error(screen.getByAltText('Book cover'));

    expect(screen.getByText('📖')).toBeInTheDocument();
  });
});
