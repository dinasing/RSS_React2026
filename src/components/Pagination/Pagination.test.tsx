import { screen } from '@testing-library/react';
import { renderWithIntl } from '../../test-utils/renderWithIntl';
import PaginationComponent from './Pagination.component';

describe('PaginationComponent', () => {
  it('renders the previous, page number, and next buttons', () => {
    renderWithIntl(
      <PaginationComponent
        page={1}
        numFound={100}
        limit={10}
        onPrevious={() => {}}
        onNext={() => {}}
      />
    );
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables the previous button on the first page', () => {
    renderWithIntl(
      <PaginationComponent
        page={1}
        numFound={100}
        limit={10}
        onPrevious={() => {}}
        onNext={() => {}}
      />
    );
    expect(screen.getByText('Prev')).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    renderWithIntl(
      <PaginationComponent
        page={10}
        numFound={100}
        limit={10}
        onPrevious={() => {}}
        onNext={() => {}}
      />
    );
    expect(screen.getByText('Next')).toBeDisabled();
  });
});
