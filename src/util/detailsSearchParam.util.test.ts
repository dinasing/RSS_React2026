import {
  buildDetailsSearchParams,
  fromDetailsParam,
  toDetailsParam,
} from './detailsSearchParam.util';

describe('detailsSearchParam', () => {
  it('converts work keys to and from details param', () => {
    expect(toDetailsParam('/works/OL1W')).toBe('OL1W');
    expect(fromDetailsParam('OL1W')).toBe('/works/OL1W');
    expect(fromDetailsParam(null)).toBeNull();
  });

  it('sets and removes details param while preserving page', () => {
    const withDetails = buildDetailsSearchParams(
      new URLSearchParams('page=2'),
      '/works/OL1W'
    );

    expect(withDetails.get('page')).toBe('2');
    expect(withDetails.get('details')).toBe('OL1W');

    const cleared = buildDetailsSearchParams(withDetails, null);

    expect(cleared.get('page')).toBe('2');
    expect(cleared.get('details')).toBeNull();
  });
});
