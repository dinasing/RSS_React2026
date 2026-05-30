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
  page: number = 1,
  limit: number = 10
) => {
  try {
    const response = await fetch(
      `${BASE_URL}search.json?q=${query}&limit=${limit}&page=${page}`,
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

export const getDefaultBooks = (page: number = 1) =>
  searchBooks('subject:fiction', page);

export const getBookDetails = async (workKey: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}${workKey.slice(1)}.json`,
      options
    );

    if (!response.ok) {
      throw new Error('Cannot load book details. Please try again.');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Cannot load book details. Please try again.');
  }
};
