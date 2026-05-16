import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as booksApi from '../../api/books.api';
import {
  mockBook,
  mockBookSearch,
  mockSearchResults,
  mockTrendingResults,
} from '../../test-utils/fixtures';
import SearchPage from './Search.page';

vi.mock('../../api/books.api', () => ({
  searchBooks: vi.fn(),
  getTrendingWeeklyBooks: vi.fn(),
}));

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('SearchPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(booksApi.searchBooks).mockReset();
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.mocked(console.error).mockRestore();
  });

  it('loads trending books on mount when localStorage is empty', async () => {
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockResolvedValue(
      mockTrendingResults
    );

    render(<SearchPage />);

    expect(booksApi.getTrendingWeeklyBooks).toHaveBeenCalledTimes(1);
    expect(booksApi.searchBooks).not.toHaveBeenCalled();
    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
  });

  it('searches with saved query on mount and prefills the input', async () => {
    localStorage.setItem('query', '  react  ');
    vi.mocked(booksApi.searchBooks).mockResolvedValue(mockSearchResults);

    render(<SearchPage />);

    expect(screen.getByDisplayValue('react')).toBeInTheDocument();
    expect(booksApi.searchBooks).toHaveBeenCalledWith('react');
    expect(await screen.findByText(mockBookSearch.title)).toBeInTheDocument();
  });

  it('shows loading text while data is loading', async () => {
    const deferred = createDeferred<typeof mockTrendingResults>();
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockReturnValue(
      deferred.promise
    );

    render(<SearchPage />);

    expect(screen.getByText(/so many books/i)).toBeInTheDocument();

    deferred.resolve(mockTrendingResults);

    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
    expect(screen.queryByText(/so many books/i)).not.toBeInTheDocument();
  });

  it('submits trimmed search, updates results, and saves localStorage', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockResolvedValue(
      mockTrendingResults
    );
    vi.mocked(booksApi.searchBooks).mockResolvedValue(mockSearchResults);

    render(<SearchPage />);
    await screen.findByText(mockBook.title);

    await user.clear(screen.getByPlaceholderText(/search for a book/i));
    await user.type(
      screen.getByPlaceholderText(/search for a book/i),
      '  vue  '
    );
    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(booksApi.searchBooks).toHaveBeenCalledWith('vue');
    expect(localStorage.getItem('query')).toBe('vue');
    expect(await screen.findByText(mockBookSearch.title)).toBeInTheDocument();
  });

  it('does not call searchBooks again when submitting the same query with results', async () => {
    const user = userEvent.setup();
    localStorage.setItem('query', 'react');
    vi.mocked(booksApi.searchBooks).mockResolvedValue(mockSearchResults);

    render(<SearchPage />);
    await screen.findByText(mockBookSearch.title);

    vi.mocked(booksApi.searchBooks).mockClear();

    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(booksApi.searchBooks).not.toHaveBeenCalled();
  });

  it('loads default books and clears localStorage when submitting empty after a saved query', async () => {
    const user = userEvent.setup();
    localStorage.setItem('query', 'react');
    vi.mocked(booksApi.searchBooks).mockResolvedValue(mockSearchResults);
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockResolvedValue(
      mockTrendingResults
    );

    render(<SearchPage />);
    await screen.findByText(mockBookSearch.title);

    vi.mocked(booksApi.getTrendingWeeklyBooks).mockClear();

    await user.clear(screen.getByPlaceholderText(/search for a book/i));
    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(booksApi.getTrendingWeeklyBooks).toHaveBeenCalled();
    expect(localStorage.getItem('query')).toBeNull();
    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
  });

  it('shows an alert when search fails', async () => {
    localStorage.setItem('query', 'broken');
    vi.mocked(booksApi.searchBooks).mockRejectedValue(
      new Error('Server unavailable')
    );

    render(<SearchPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /server unavailable/i
    );
  });

  it('shows fallback search message when search rejects a non-Error', async () => {
    localStorage.setItem('query', 'x');
    vi.mocked(booksApi.searchBooks).mockRejectedValue('bad');

    render(<SearchPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /search request failed\. please try again\./i
    );
  });

  it('shows an alert when default books fail', async () => {
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockRejectedValue(
      new Error('Network down')
    );

    render(<SearchPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/network down/i);
  });

  it('shows non-Error rejection message using fallback copy', async () => {
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockRejectedValue('oops');

    render(<SearchPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /cannot load default books\. please try again\./i
    );
  });

  it('error button triggers boundary fallback and logs to console', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getTrendingWeeklyBooks).mockResolvedValue(
      mockTrendingResults
    );

    render(<SearchPage />);
    await screen.findByText(mockBook.title);

    await user.click(
      screen.getByRole('button', { name: /click to see the error/i })
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      /oops! something went wrong/i
    );
    expect(console.error).toHaveBeenCalled();
  });
});
