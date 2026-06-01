import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from '../../context/Theme/Theme.context';
import {
  getFetchCallUrl,
  jsonResponse,
  mockSearchAndDefaultFetch,
  setupFetchMock,
} from '../../test-utils/fetchMock';
import {
  mockBook,
  mockBookDetails,
  mockBookSearch,
  mockDefaultResults,
  mockSearchResults,
} from '../../test-utils/fixtures';
import { createTestStore } from '../../test-utils/testStore';
import BookDetailsPage from '../BookDetails/BookDetails.page';
import SearchPage from './Search.page';

function renderSearchPage(initialEntry = '/') {
  const store = createTestStore();
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
    store,
    ...render(
      <ThemeProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
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
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(console.error).mockRestore();
  });

  it('loads default books on mount when localStorage is empty', async () => {
    const fetchMock = mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
    });

    renderSearchPage();

    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(getFetchCallUrl(fetchMock.mock.calls[0]![0])).toContain(
      'subject%3Afiction'
    );
  });

  it('does not refetch default books after results load on empty query', async () => {
    const fetchMock = mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
    });

    renderSearchPage();
    await screen.findByText(mockBook.title);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('searches with saved query on mount and prefills the input', async () => {
    localStorage.setItem('query', '  react  ');
    const fetchMock = mockSearchAndDefaultFetch({
      search: () => mockSearchResults,
    });

    renderSearchPage();

    expect(screen.getByDisplayValue('react')).toBeInTheDocument();
    expect(await screen.findByText(mockBookSearch.title)).toBeInTheDocument();
    expect(getFetchCallUrl(fetchMock.mock.calls[0]![0])).toContain('q=react');
  });

  it('shows loading text while data is loading', async () => {
    const deferred = createDeferred<Response>();
    setupFetchMock((url) => {
      if (url.includes('search.json')) {
        return deferred.promise;
      }
      return jsonResponse({});
    });

    renderSearchPage();

    expect(screen.getByText(/so many books/i)).toBeInTheDocument();

    deferred.resolve(jsonResponse(mockDefaultResults));

    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
    expect(screen.queryByText(/so many books/i)).not.toBeInTheDocument();
  });

  it('submits trimmed search, updates results, and saves localStorage', async () => {
    const user = userEvent.setup();
    mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
      search: (query) =>
        query === 'vue' ? mockSearchResults : mockDefaultResults,
    });

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

    expect(localStorage.getItem('query')).toBe('vue');
    expect(await screen.findByText(mockBookSearch.title)).toBeInTheDocument();
  });

  it('does not refetch when submitting the same query with results', async () => {
    const user = userEvent.setup();
    localStorage.setItem('query', 'react');
    const fetchMock = mockSearchAndDefaultFetch({
      search: () => mockSearchResults,
    });

    renderSearchPage();
    await screen.findByText(mockBookSearch.title);

    const callsAfterLoad = fetchMock.mock.calls.length;

    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(fetchMock.mock.calls.length).toBe(callsAfterLoad);
  });

  it('loads default books and clears localStorage when submitting empty after a saved query', async () => {
    const user = userEvent.setup();
    localStorage.setItem('query', 'react');
    mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
      search: () => mockSearchResults,
    });

    renderSearchPage();
    await screen.findByText(mockBookSearch.title);

    await user.clear(screen.getByPlaceholderText(/search for a book/i));
    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(localStorage.getItem('query')).toBeNull();
    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
  });

  it('shows an alert when search fails', async () => {
    localStorage.setItem('query', 'broken');
    setupFetchMock((url) => {
      if (url.includes('search.json')) {
        return jsonResponse(
          { detail: [{ msg: 'Server unavailable' }] },
          { ok: false, status: 400 }
        );
      }
      return jsonResponse({});
    });

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /server unavailable/i
    );
  });

  it('shows fallback search message when fetch rejects a non-Error', async () => {
    localStorage.setItem('query', 'x');
    const fetchMock = vi.fn(() => Promise.reject('bad'));
    vi.stubGlobal('fetch', fetchMock);

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /search request failed\. please try again\./i
    );
  });

  it('shows an alert when default books fail', async () => {
    const fetchMock = vi.fn(() => Promise.reject(new Error('Network down')));
    vi.stubGlobal('fetch', fetchMock);

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /network down|cannot load default books|search request failed/i
    );
  });

  it('shows non-Error rejection message using fallback copy', async () => {
    const fetchMock = vi.fn(() => Promise.reject('oops'));
    vi.stubGlobal('fetch', fetchMock);

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /cannot load default books|search request failed/i
    );
  });

  it('loads books for page from URL search param', async () => {
    const fetchMock = mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
    });

    renderSearchPage('/?page=2');

    expect(await screen.findByText(mockBook.title)).toBeInTheDocument();
    expect(getFetchCallUrl(fetchMock.mock.calls[0]![0])).toContain('page=2');
  });

  it('updates URL when navigating to next page', async () => {
    const user = userEvent.setup();
    const fetchMock = mockSearchAndDefaultFetch({
      defaultBooks: { ...mockDefaultResults, numFound: 25 },
    });

    const { router } = renderSearchPage();
    await screen.findByText(mockBook.title);

    const callsAfterLoad = fetchMock.mock.calls.length;

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(router.state.location.search).toBe('?page=2');
    expect(fetchMock.mock.calls.length).toBeGreaterThan(callsAfterLoad);
    expect(getFetchCallUrl(fetchMock.mock.calls.at(-1)![0])).toContain(
      'page=2'
    );
  });

  it('removes page param from URL when returning to first page', async () => {
    const user = userEvent.setup();
    mockSearchAndDefaultFetch({
      defaultBooks: { ...mockDefaultResults, numFound: 25 },
    });

    const { router } = renderSearchPage('/?page=2');
    await screen.findByText(mockBook.title);

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(router.state.location.search).toBe('');
  });

  it('reuses cached list when navigating back to a previous page', async () => {
    const user = userEvent.setup();
    const fetchMock = mockSearchAndDefaultFetch({
      defaultBooks: { ...mockDefaultResults, numFound: 25 },
    });

    renderSearchPage();
    await screen.findByText(mockBook.title);

    await user.click(screen.getByRole('button', { name: /next/i }));
    await screen.findByText(mockBook.title);

    const callsAfterPageTwo = fetchMock.mock.calls.length;

    await user.click(screen.getByRole('button', { name: /prev/i }));
    await screen.findByText(mockBook.title);

    expect(fetchMock.mock.calls.length).toBe(callsAfterPageTwo);
  });

  it('refetches list when refresh is clicked', async () => {
    const user = userEvent.setup();
    const fetchMock = mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
    });

    renderSearchPage();
    await screen.findByText(mockBook.title);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /refresh results/i }));

    expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
  });

  it('opens details panel and updates URL when a result is clicked', async () => {
    const user = userEvent.setup();
    const fetchMock = mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
      bookDetails: mockBookDetails,
    });

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
    expect(
      fetchMock.mock.calls.some((call) =>
        getFetchCallUrl(call[0]).includes('OL1W.json')
      )
    ).toBe(true);
    expect(screen.getAllByText(mockBook.title).length).toBeGreaterThanOrEqual(
      1
    );
  });

  it('toggles checkbox selection without opening details', async () => {
    const user = userEvent.setup();
    mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
      bookDetails: mockBookDetails,
    });

    const { router } = renderSearchPage();
    await screen.findByText(mockBook.title);

    const checkbox = screen.getByRole('checkbox', {
      name: new RegExp(`select ${mockBook.title}`, 'i'),
    });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(router.state.location.search).toBe('');
    expect(screen.queryByLabelText(/book details/i)).not.toBeInTheDocument();
  });

  it('shows sticky flyout for selected items and unselects all', async () => {
    const user = userEvent.setup();
    mockSearchAndDefaultFetch({ defaultBooks: mockDefaultResults });

    renderSearchPage();
    await screen.findByText(mockBook.title);

    const checkbox = screen.getByRole('checkbox', {
      name: new RegExp(`select ${mockBook.title}`, 'i'),
    });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(checkbox).not.toBeChecked();
    expect(screen.queryByText('1 selected')).not.toBeInTheDocument();
  });

  it('downloads selected items as csv from the flyout action', async () => {
    const user = userEvent.setup();
    mockSearchAndDefaultFetch({ defaultBooks: mockDefaultResults });

    renderSearchPage();
    await screen.findByText(mockBook.title);

    await user.click(
      screen.getByRole('checkbox', {
        name: new RegExp(`select ${mockBook.title}`, 'i'),
      })
    );

    const createObjectURLMock = vi.fn<typeof URL.createObjectURL>(
      () => 'blob:download-url'
    );
    const revokeObjectURLMock = vi.fn();
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    const anchorClickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: createObjectURLMock,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: revokeObjectURLMock,
    });

    try {
      await user.click(screen.getByRole('button', { name: /download/i }));

      expect(anchorClickSpy).toHaveBeenCalledTimes(1);
      expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:download-url');

      const csvBlobArg = createObjectURLMock.mock.calls[0]?.[0];
      expect(csvBlobArg).toBeInstanceOf(Blob);
      const csvContent = await (csvBlobArg as Blob).text();
      expect(csvContent).toContain('name,description,detailsUrl');
      expect(csvContent).toContain('Test Book,Jane Author (2001)');
      expect(csvContent).toContain('https://openlibrary.org/works/OL1W');

      const removedNode = removeChildSpy.mock.calls.at(0)?.[0];
      expect(removedNode).toBeInstanceOf(HTMLAnchorElement);
      expect((removedNode as HTMLAnchorElement).download).toBe('1_items.csv');
      expect((removedNode as HTMLAnchorElement).href).toContain(
        'blob:download-url'
      );
    } finally {
      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        writable: true,
        value: originalCreateObjectURL,
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        configurable: true,
        writable: true,
        value: originalRevokeObjectURL,
      });
      anchorClickSpy.mockRestore();
      removeChildSpy.mockRestore();
    }
  });

  it('shows loading text while book details are loading', async () => {
    const user = userEvent.setup();
    const deferred = createDeferred<Response>();
    setupFetchMock((url) => {
      if (url.includes('works/OL1W.json')) {
        return deferred.promise;
      }
      if (url.includes('search.json')) {
        return jsonResponse(mockDefaultResults);
      }
      return jsonResponse({}, { ok: false, status: 404 });
    });

    renderSearchPage();
    await screen.findByText(mockBook.title);
    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );

    expect(screen.getByText(/loading book details/i)).toBeInTheDocument();

    deferred.resolve(jsonResponse(mockBookDetails));

    expect(
      await screen.findByRole('heading', { name: mockBookDetails.title })
    ).toBeInTheDocument();
  });

  it('shows an alert when book details fail', async () => {
    const user = userEvent.setup();
    setupFetchMock((url) => {
      if (url.includes('works/OL1W.json')) {
        return jsonResponse({}, { ok: false, status: 404 });
      }
      if (url.includes('search.json')) {
        return jsonResponse(mockDefaultResults);
      }
      return jsonResponse({}, { ok: false, status: 404 });
    });

    renderSearchPage();
    await screen.findByText(mockBook.title);
    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /cannot load book details/i
    );
  });

  it('refetches book details when refresh is clicked', async () => {
    const user = userEvent.setup();
    const fetchMock = mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
      bookDetails: mockBookDetails,
    });

    renderSearchPage();
    await screen.findByText(mockBook.title);
    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );
    await screen.findByRole('heading', { name: mockBookDetails.title });

    const detailsCallsBeforeRefresh = fetchMock.mock.calls.filter((call) =>
      getFetchCallUrl(call[0]).includes('OL1W.json')
    ).length;

    await user.click(screen.getByRole('button', { name: /refresh details/i }));

    const detailsCallsAfterRefresh = fetchMock.mock.calls.filter((call) =>
      getFetchCallUrl(call[0]).includes('OL1W.json')
    ).length;

    expect(detailsCallsAfterRefresh).toBeGreaterThan(detailsCallsBeforeRefresh);
  });

  it('closes details panel from close button and main panel click', async () => {
    const user = userEvent.setup();
    mockSearchAndDefaultFetch({
      defaultBooks: mockDefaultResults,
      bookDetails: mockBookDetails,
    });

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
    mockSearchAndDefaultFetch({
      defaultBooks: { ...mockDefaultResults, numFound: 25 },
      bookDetails: mockBookDetails,
    });

    const { router } = renderSearchPage('/?page=2');
    await screen.findByText(mockBook.title);

    await user.click(
      screen.getByRole('button', { name: new RegExp(mockBook.title) })
    );

    expect(router.state.location.search).toBe('?page=2&details=OL1W');
  });

  it('does not show details panel on initial load', async () => {
    mockSearchAndDefaultFetch({ defaultBooks: mockDefaultResults });

    renderSearchPage();

    await screen.findByText(mockBook.title);

    expect(screen.queryByLabelText(/book details/i)).not.toBeInTheDocument();
  });

  it('error button triggers boundary fallback and logs to console', async () => {
    const user = userEvent.setup();
    mockSearchAndDefaultFetch({ defaultBooks: mockDefaultResults });

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
