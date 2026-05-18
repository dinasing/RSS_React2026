import { render, screen } from '@testing-library/react';
import PaginationComponent from './Pagination.component';

describe('PaginationComponent', () => {
  it('renders the previous, page number, and next buttons', () => {
    render(
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
    render(
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
    render(
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
