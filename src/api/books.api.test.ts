import { getTrendingWeeklyBooks, searchBooks } from './books.api';

describe('books.api', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('searchBooks', () => {
    it('requests the first page with default limit and offset', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ numFound: 0, docs: [] }),
      });

      await searchBooks('react');

      expect(fetchMock).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=react&limit=10&offset=0',
        expect.any(Object)
      );
    });

    it('supports custom limit and offset', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ numFound: 0, docs: [] }),
      });

      await searchBooks('vue', 5, 10);

      expect(fetchMock).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=vue&limit=5&offset=10',
        expect.any(Object)
      );
    });

    it('returns parsed JSON on success', async () => {
      const payload = { numFound: 1, docs: [{ key: 'x' }] };
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => payload,
      });

      await expect(searchBooks('q')).resolves.toEqual(payload);
    });

    it('throws API message on non-OK response', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({ detail: [{ msg: 'Invalid query' }] }),
      });

      await expect(searchBooks('bad')).rejects.toThrow(/invalid query/i);
    });

    it('wraps unknown thrown values from fetch in a generic error', async () => {
      fetchMock.mockRejectedValue('not-an-error-instance');

      await expect(searchBooks('x')).rejects.toThrow(/search request failed/i);
    });
  });

  describe('getTrendingWeeklyBooks', () => {
    it('normalizes works into search results shape', async () => {
      const works = [{ key: '/works/1', title: 'Trend' }];
      fetchMock.mockResolvedValue({
        json: async () => ({ works }),
      });

      await expect(getTrendingWeeklyBooks()).resolves.toEqual({
        numFound: 1,
        start: 0,
        docs: works,
      });
    });

    it('returns empty docs when works is missing', async () => {
      fetchMock.mockResolvedValue({
        json: async () => ({}),
      });

      await expect(getTrendingWeeklyBooks()).resolves.toEqual({
        numFound: 0,
        start: 0,
        docs: [],
      });
    });
  });
});
