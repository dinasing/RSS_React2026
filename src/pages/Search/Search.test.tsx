import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import * as booksApi from '../../api/books.api';
import { selectedItemsReducer } from '../../store/selectedItems/selectedItems.slice';
import {
  mockBook,
  mockBookDetails,
  mockBookSearch,
  mockSearchResults,
  mockDefaultResults,
} from '../../test-utils/fixtures';
import BookDetailsPage from '../BookDetails/BookDetails.page';
import SearchPage from './Search.page';

vi.mock('../../api/books.api', () => ({
  searchBooks: vi.fn(),
  getDefaultBooks: vi.fn(),
  getBookDetails: vi.fn(),
}));

function renderSearchPage(initialEntry = '/') {
  const store = configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <SearchPage />,
        children: [{ index: true, element: <BookDetailsPage /> }],
      },
    ],
    {
      initialEntries: [initialEntry],
    }
  );

  return {
    router,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    ),
  };
}

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
    vi.mocked(booksApi.getDefaultBooks).mockReset();
    vi.mocked(booksApi.getBookDetails).mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.mocked(console.error).mockRestore();
  });

  it('loads default books on mount when localStorage is empty', async () => {
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);

    renderSearchPage();

    expect(booksApi.getDefaultBooks).toHaveBeenCalledTimes(1);
    expect(booksApi.searchBooks).not.toHaveBeenCalled();
    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
    expect(booksApi.getDefaultBooks).toHaveBeenCalledTimes(1);
  });

  it('does not refetch default books after results load on empty query', async () => {
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);

    renderSearchPage();
    await screen.findByText(mockBook.title);

    expect(booksApi.getDefaultBooks).toHaveBeenCalledTimes(1);
  });

  it('searches with saved query on mount and prefills the input', async () => {
    localStorage.setItem('query', '  react  ');
    vi.mocked(booksApi.searchBooks).mockResolvedValue(mockSearchResults);

    renderSearchPage();

    expect(screen.getByDisplayValue('react')).toBeInTheDocument();
    expect(booksApi.searchBooks).toHaveBeenCalledWith('react', 1);
    expect(await screen.findByText(mockBookSearch.title)).toBeInTheDocument();
  });

  it('shows loading text while data is loading', async () => {
    const deferred = createDeferred<typeof mockDefaultResults>();
    vi.mocked(booksApi.getDefaultBooks).mockReturnValue(deferred.promise);

    renderSearchPage();

    expect(screen.getByText(/so many books/i)).toBeInTheDocument();

    deferred.resolve(mockDefaultResults);

    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
    expect(screen.queryByText(/so many books/i)).not.toBeInTheDocument();
  });

  it('submits trimmed search, updates results, and saves localStorage', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);
    vi.mocked(booksApi.searchBooks).mockResolvedValue(mockSearchResults);

    renderSearchPage();
    await screen.findByText(mockBook.title);

    await user.clear(screen.getByPlaceholderText(/search for a book/i));
    await user.type(
      screen.getByPlaceholderText(/search for a book/i),
      '  vue  '
    );
    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(booksApi.searchBooks).toHaveBeenCalledWith('vue', 1);
    expect(localStorage.getItem('query')).toBe('vue');
    expect(await screen.findByText(mockBookSearch.title)).toBeInTheDocument();
  });

  it('does not call searchBooks again when submitting the same query with results', async () => {
    const user = userEvent.setup();
    localStorage.setItem('query', 'react');
    vi.mocked(booksApi.searchBooks).mockResolvedValue(mockSearchResults);

    renderSearchPage();
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
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);

    renderSearchPage();
    await screen.findByText(mockBookSearch.title);

    vi.mocked(booksApi.getDefaultBooks).mockClear();

    await user.clear(screen.getByPlaceholderText(/search for a book/i));
    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(booksApi.getDefaultBooks).toHaveBeenCalled();
    expect(localStorage.getItem('query')).toBeNull();
    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
  });

  it('shows an alert when search fails', async () => {
    localStorage.setItem('query', 'broken');
    vi.mocked(booksApi.searchBooks).mockRejectedValue(
      new Error('Server unavailable')
    );

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /server unavailable/i
    );
  });

  it('shows fallback search message when search rejects a non-Error', async () => {
    localStorage.setItem('query', 'x');
    vi.mocked(booksApi.searchBooks).mockRejectedValue('bad');

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /search request failed\. please try again\./i
    );
  });

  it('shows an alert when default books fail', async () => {
    vi.mocked(booksApi.getDefaultBooks).mockRejectedValue(
      new Error('Network down')
    );

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(/network down/i);
  });

  it('shows non-Error rejection message using fallback copy', async () => {
    vi.mocked(booksApi.getDefaultBooks).mockRejectedValue('oops');

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /cannot load default books\. please try again\./i
    );
  });

  it('loads books for page from URL search param', async () => {
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);

    renderSearchPage('/?page=2');

    expect(booksApi.getDefaultBooks).toHaveBeenCalledWith(2);
    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
  });

  it('updates URL when navigating to next page', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue({
      ...mockDefaultResults,
      numFound: 25,
    });

    const { router } = renderSearchPage();
    await screen.findByText(mockBook.title);

    vi.mocked(booksApi.getDefaultBooks).mockClear();

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(router.state.location.search).toBe('?page=2');
    expect(booksApi.getDefaultBooks).toHaveBeenCalledWith(2);
  });

  it('removes page param from URL when returning to first page', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue({
      ...mockDefaultResults,
      numFound: 25,
    });

    const { router } = renderSearchPage('/?page=2');
    await screen.findByText(mockBook.title);

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(router.state.location.search).toBe('');
  });

  it('opens details panel and updates URL when a result is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);
    vi.mocked(booksApi.getBookDetails).mockResolvedValue(mockBookDetails);

    const { router } = renderSearchPage();
    await screen.findByText(mockBook.title);
    const checkbox = screen.getByRole('checkbox', {
      name: new RegExp(`select ${mockBook.title}`, 'i'),
    });
    expect(checkbox).not.toBeChecked();

    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );

    expect(router.state.location.search).toBe('?details=OL1W');
    expect(await screen.findByLabelText(/book details/i)).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: mockBookDetails.title })
    ).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(booksApi.getBookDetails).toHaveBeenCalledWith('/works/OL1W');
    expect(screen.getAllByText(mockBook.title).length).toBeGreaterThanOrEqual(
      1
    );
  });

  it('toggles checkbox selection without opening details', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);
    vi.mocked(booksApi.getBookDetails).mockResolvedValue(mockBookDetails);

    const { router } = renderSearchPage();
    await screen.findByText(mockBook.title);

    const checkbox = screen.getByRole('checkbox', {
      name: new RegExp(`select ${mockBook.title}`, 'i'),
    });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(router.state.location.search).toBe('');
    expect(screen.queryByLabelText(/book details/i)).not.toBeInTheDocument();
    expect(booksApi.getBookDetails).not.toHaveBeenCalled();
  });

  it('shows loading text while book details are loading', async () => {
    const user = userEvent.setup();
    const deferred = createDeferred<typeof mockBookDetails>();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);
    vi.mocked(booksApi.getBookDetails).mockReturnValue(deferred.promise);

    renderSearchPage();
    await screen.findByText(mockBook.title);
    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );

    expect(screen.getByText(/loading book details/i)).toBeInTheDocument();

    deferred.resolve(mockBookDetails);

    expect(
      await screen.findByRole('heading', { name: mockBookDetails.title })
    ).toBeInTheDocument();
  });

  it('closes details panel from close button and main panel click', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);
    vi.mocked(booksApi.getBookDetails).mockResolvedValue(mockBookDetails);

    const { router } = renderSearchPage();
    await screen.findByText(mockBook.title);
    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );
    await screen.findByLabelText(/book details/i);

    await user.click(screen.getByRole('button', { name: /close details/i }));

    expect(router.state.location.search).toBe('');
    expect(screen.queryByLabelText(/book details/i)).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );
    await screen.findByLabelText(/book details/i);

    await user.click(screen.getByPlaceholderText(/search for a book/i));

    expect(router.state.location.search).toBe('');
    expect(screen.queryByLabelText(/book details/i)).not.toBeInTheDocument();
  });

  it('keeps page and details in URL together', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue({
      ...mockDefaultResults,
      numFound: 25,
    });
    vi.mocked(booksApi.getBookDetails).mockResolvedValue(mockBookDetails);

    const { router } = renderSearchPage('/?page=2');
    await screen.findByText(mockBook.title);

    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );

    expect(router.state.location.search).toBe('?page=2&details=OL1W');
  });

  it('does not show details panel on initial load', async () => {
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);

    renderSearchPage();

    await screen.findByText(mockBook.title);

    expect(screen.queryByLabelText(/book details/i)).not.toBeInTheDocument();
    expect(booksApi.getBookDetails).not.toHaveBeenCalled();
  });

  it('error button triggers boundary fallback and logs to console', async () => {
    const user = userEvent.setup();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);

    renderSearchPage();
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
