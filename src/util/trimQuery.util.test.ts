import { describe, expect, it } from 'vitest';
import { trimQuery } from './trimQuery.util';

describe('trimQuery', () => {
  it('returns empty string for non-string values', () => {
    expect(trimQuery(null)).toBe('');
    expect(trimQuery(undefined)).toBe('');
    expect(trimQuery(42)).toBe('');
  });

  it('trims whitespace from strings', () => {
    expect(trimQuery('  book search  ')).toBe('book search');
    expect(trimQuery('')).toBe('');
    expect(trimQuery('   ')).toBe('');
  });
});
