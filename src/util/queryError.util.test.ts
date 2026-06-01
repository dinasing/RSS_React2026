import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getQueryErrorMessage } from './queryError.util';

describe('getQueryErrorMessage', () => {
  it('returns null when there is no error', () => {
    expect(getQueryErrorMessage(undefined, 'fallback')).toBeNull();
  });

  it('returns message from transformed API error data', () => {
    const error: FetchBaseQueryError = {
      status: 400,
      data: { message: 'Invalid query' },
    };

    expect(getQueryErrorMessage(error, 'fallback')).toBe('Invalid query');
  });

  it('returns fetch error string when present', () => {
    const error: FetchBaseQueryError = {
      status: 'FETCH_ERROR',
      error: 'Network down',
    };

    expect(getQueryErrorMessage(error, 'fallback')).toBe('Network down');
  });

  it('returns fallback for fetch errors without a message', () => {
    const error: FetchBaseQueryError = {
      status: 'FETCH_ERROR',
      error: 'Failed to fetch',
    };

    expect(getQueryErrorMessage(error, 'Cannot load')).toBe('Cannot load');
  });

  it('returns fallback for fetch errors without a message', () => {
    const error: FetchBaseQueryError = {
      status: 500,
      data: undefined,
    };

    expect(getQueryErrorMessage(error, 'Cannot load')).toBe('Cannot load');
  });

  it('returns serialized error message when available', () => {
    expect(
      getQueryErrorMessage({ name: 'Error', message: 'Boom' }, 'fallback')
    ).toBe('Boom');
  });
});
