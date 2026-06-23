export type BookCoverSize = 'S' | 'M' | 'L';

export const getBookCoverUrl = (
  coverId: number,
  size: BookCoverSize = 'M'
): string => `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
