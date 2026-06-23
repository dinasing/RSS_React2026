import { buildPageSearchParams, parsePageParam } from './pageSearchParam.util';

describe('parsePageParam', () => {
  it('returns 1 when value is null or empty', () => {
    expect(parsePageParam(null)).toBe(1);
    expect(parsePageParam('')).toBe(1);
  });

  it('parses valid positive integers', () => {
    expect(parsePageParam('2')).toBe(2);
    expect(parsePageParam('10')).toBe(10);
  });

  it('returns 1 for invalid values', () => {
    expect(parsePageParam('abc')).toBe(1);
    expect(parsePageParam('0')).toBe(1);
    expect(parsePageParam('-3')).toBe(1);
  });
});

describe('buildPageSearchParams', () => {
  it('sets page param when page is greater than 1', () => {
    const params = buildPageSearchParams(new URLSearchParams(), 2);

    expect(params.get('page')).toBe('2');
  });

  it('removes page param when page is 1', () => {
    const params = buildPageSearchParams(new URLSearchParams('page=3'), 1);

    expect(params.get('page')).toBeNull();
  });

  it('preserves other search params', () => {
    const params = buildPageSearchParams(
      new URLSearchParams('foo=bar&page=2'),
      3
    );

    expect(params.get('foo')).toBe('bar');
    expect(params.get('page')).toBe('3');
  });
});
