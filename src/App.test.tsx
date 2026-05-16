import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import * as booksApi from './api/books.api';
import App from './App';
import { mockTrendingResults } from './test-utils/fixtures';

vi.mock('./api/books.api', () => ({
  searchBooks: vi.fn(),
  getTrendingWeeklyBooks: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockResolvedValue(
      mockTrendingResults
    );
  });

  it('renders the search page', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(
      await screen.findByRole('heading', { name: /book search/i })
    ).toBeInTheDocument();
  });
});
