import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BookDetailsType } from '../../types/bookDetails.type';
import type { SearchResultsType } from '../../types/searchResults.type';
import { CACHE_TTL_SECONDS } from './queryConfig';

const BASE_URL = 'https://openlibrary.org/';
// identifying the request as per docs https://openlibrary.org/developers/api
const HEADERS = new Headers({
  'User-Agent': 'book-search-edu-2026/1.0 (dina.sing1212@gmail.com)',
});
type OpenLibraryErrorBody = {
  detail?: Array<{ msg?: string }>;
};

export type GetBooksArgs = {
  query: string | null;
  page: number;
  limit?: number;
};

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  headers: HEADERS,
});

function getBookListTagId(query: string | null, page: number): string {
  return `${query ?? 'default'}-${page}`;
}

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery,
  keepUnusedDataFor: CACHE_TTL_SECONDS,
  tagTypes: ['BookList', 'BookDetails'],
  endpoints: (builder) => ({
    getBooks: builder.query<SearchResultsType, GetBooksArgs>({
      query: ({ query, page, limit = 10 }) => ({
        url: 'search.json',
        params: {
          q: query ?? 'subject:fiction',
          limit,
          page,
        },
      }),
      providesTags: (_result, _error, { query, page }) => [
        { type: 'BookList', id: getBookListTagId(query, page) },
      ],
      transformErrorResponse: (response) => {
        const data = response.data as OpenLibraryErrorBody | undefined;
        const msg = data?.detail?.[0]?.msg;
        return {
          message: msg ?? 'Search request failed. Please try again.',
        };
      },
    }),
    getBookDetails: builder.query<BookDetailsType, string>({
      query: (workKey) => {
        const path = workKey.startsWith('/')
          ? workKey.slice(1)
          : `works/${workKey}`;
        return `${path}.json`;
      },
      providesTags: (_result, _error, workKey) => [
        { type: 'BookDetails', id: workKey },
      ],
      transformErrorResponse: () => ({
        message: 'Cannot load book details. Please try again.',
      }),
    }),
  }),
});

export const { useGetBooksQuery, useGetBookDetailsQuery } = booksApi;
