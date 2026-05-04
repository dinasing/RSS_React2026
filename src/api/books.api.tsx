const BASE_URL = 'https://openlibrary.org/search.json';

// identifying the request as per docs https://openlibrary.org/developers/api
const headers = new Headers({
  'User-Agent': 'book-search-edu-2026/1.0 (dina.sing1212@gmail.com)',
});

const options = {
  method: 'GET',
  headers: headers,
};

export const searchBooks = async (
  query: string,
  limit: number = 10,
  offset: number = 0
) => {
  const response = await fetch(
    `${BASE_URL}?q=${query}&limit=${limit}&offset=${offset}`,
    options
  );
  return response.json();
};
