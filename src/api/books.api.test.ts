import { getBookDetails, getDefaultBooks, searchBooks } from './books.api';

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
    it('requests the first page with default limit and page', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ numFound: 0, docs: [] }),
      });

      await searchBooks('react');

      expect(fetchMock).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=react&limit=10&page=1',
        expect.any(Object)
      );
    });

    it('supports custom limit and page', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ numFound: 0, docs: [] }),
      });

      await searchBooks('vue', 5, 10);

      expect(fetchMock).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=vue&limit=10&page=5',
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

  describe('getBookDetails', () => {
    it('requests work details json', async () => {
      const payload = { title: 'Work title' };
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => payload,
      });

      await expect(getBookDetails('/works/OL1W')).resolves.toEqual(payload);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://openlibrary.org/works/OL1W.json',
        expect.any(Object)
      );
    });

    it('throws on non-OK response', async () => {
      fetchMock.mockResolvedValue({ ok: false });

      await expect(getBookDetails('/works/OL1W')).rejects.toThrow(
        /cannot load book details/i
      );
    });
  });

  describe('getDefaultBooks', () => {
    it('searches fiction when the query is empty', async () => {
      const payload = { numFound: 2, start: 0, docs: [{ key: '/works/1' }] };
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => payload,
      });

      await expect(getDefaultBooks()).resolves.toEqual(payload);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=subject:fiction&limit=10&page=1',
        expect.any(Object)
      );
    });
  });
});
