import { getBookCoverUrl } from './bookCover.util';

describe('getBookCoverUrl', () => {
  it('builds Open Library cover URL with default medium size', () => {
    expect(getBookCoverUrl(1001)).toBe(
      'https://covers.openlibrary.org/b/id/1001-M.jpg'
    );
  });

  it('supports custom size suffix', () => {
    expect(getBookCoverUrl(1001, 'L')).toBe(
      'https://covers.openlibrary.org/b/id/1001-L.jpg'
    );
  });
});
