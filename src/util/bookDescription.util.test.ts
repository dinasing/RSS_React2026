import { formatBookDescription } from './bookDescription.util';

describe('formatBookDescription', () => {
  it('returns null when description is missing', () => {
    expect(formatBookDescription(undefined)).toBeNull();
  });

  it('returns string descriptions as-is', () => {
    expect(formatBookDescription('A short summary.')).toBe('A short summary.');
  });

  it('returns value from object descriptions', () => {
    expect(
      formatBookDescription({ type: '/type/text', value: 'From object.' })
    ).toBe('From object.');
  });
});
