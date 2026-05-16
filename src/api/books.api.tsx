const BASE_URL = 'https://openlibrary.org/';
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
  try {
    const response = await fetch(
      `${BASE_URL}search.json?q=${query}&limit=${limit}&offset=${offset}`,
      options
    );

    if (!response.ok) {
      const responseJson = await response.json();
      throw new Error(responseJson.detail[0].msg);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Search request failed. Please try again.');
  }
};

export const getDefaultBooks = () => searchBooks('subject:fiction');
