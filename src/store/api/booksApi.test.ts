import {
  getFetchCallUrl,
  jsonResponse,
  setupFetchMock,
} from '../../test-utils/fetchMock';
import { createTestStore } from '../../test-utils/testStore';
import { booksApi } from './booksApi';
import { CACHE_TTL_SECONDS } from './queryConfig';

describe('booksApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults cache TTL to 300 seconds when env is unset', () => {
    expect(CACHE_TTL_SECONDS).toBe(300);
  });

  it('requests default fiction books on getBooks', async () => {
    const fetchMock = setupFetchMock((url) => {
      if (url.includes('search.json')) {
        return jsonResponse({ numFound: 0, docs: [] });
      }
      return jsonResponse({}, { ok: false, status: 404 });
    });

    const store = createTestStore();
    await store.dispatch(
      booksApi.endpoints.getBooks.initiate({ query: null, page: 1 })
    );

    expect(getFetchCallUrl(fetchMock.mock.calls[0]![0])).toContain(
      'search.json?q=subject%3Afiction'
    );
  });

  it('requests search results with query and page', async () => {
    const fetchMock = setupFetchMock(() =>
      jsonResponse({ numFound: 1, docs: [] })
    );

    const store = createTestStore();
    await store.dispatch(
      booksApi.endpoints.getBooks.initiate({ query: 'react', page: 5 })
    );

    const requestUrl = getFetchCallUrl(fetchMock.mock.calls[0]![0]);
    expect(requestUrl).toContain('search.json?q=react');
    expect(requestUrl).toContain('page=5');
  });

  it('requests work details json for a work key', async () => {
    const fetchMock = setupFetchMock(() =>
      jsonResponse({ title: 'Work title' })
    );

    const store = createTestStore();
    await store.dispatch(
      booksApi.endpoints.getBookDetails.initiate('/works/OL1W')
    );

    expect(getFetchCallUrl(fetchMock.mock.calls[0]![0])).toBe(
      'https://openlibrary.org/works/OL1W.json'
    );
  });

  it('maps search API errors to a readable message', async () => {
    setupFetchMock(() =>
      jsonResponse(
        { detail: [{ msg: 'Invalid query' }] },
        { ok: false, status: 400 }
      )
    );

    const store = createTestStore();
    const args = { query: 'bad', page: 1 };
    await store.dispatch(booksApi.endpoints.getBooks.initiate(args));

    const queryState = booksApi.endpoints.getBooks.select(args)(
      store.getState()
    );

    expect(queryState.error).toMatchObject({
      message: 'Invalid query',
    });
  });

  it('maps book details errors to a readable message', async () => {
    setupFetchMock(() => jsonResponse({}, { ok: false, status: 404 }));

    const store = createTestStore();
    const workKey = '/works/OL1W';
    await store.dispatch(booksApi.endpoints.getBookDetails.initiate(workKey));

    const queryState = booksApi.endpoints.getBookDetails.select(workKey)(
      store.getState()
    );

    expect(queryState.error).toMatchObject({
      message: 'Cannot load book details. Please try again.',
    });
  });
});
