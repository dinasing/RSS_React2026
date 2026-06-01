import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type QueryErrorData = {
  message?: string;
};

function isFetchBaseQueryError(
  error: FetchBaseQueryError | SerializedError
): error is FetchBaseQueryError {
  return 'status' in error;
}

export function getQueryErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback: string
): string | null {
  if (!error) {
    return null;
  }

  if (isFetchBaseQueryError(error)) {
    if (error.status === 'FETCH_ERROR') {
      if (
        'error' in error &&
        typeof error.error === 'string' &&
        error.error &&
        error.error !== 'Failed to fetch'
      ) {
        return error.error;
      }

      return fallback;
    }

    if (typeof error.data === 'object' && error.data !== null) {
      const data = error.data as QueryErrorData;
      if (data.message) {
        return data.message;
      }
    }

    if ('error' in error && typeof error.error === 'string') {
      const fetchError = error.error;
      if (fetchError && fetchError !== 'Failed to fetch') {
        return fetchError;
      }
    }

    return fallback;
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return fallback;
}
