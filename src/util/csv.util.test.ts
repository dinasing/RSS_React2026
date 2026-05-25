import { mockBook } from '../test-utils/fixtures';
import {
  buildSelectedItemsCsv,
  buildSelectedItemsCsvFilename,
} from './csv.util';

describe('csv utils', () => {
  it('builds csv rows with escaped values and details URL', () => {
    const csv = buildSelectedItemsCsv([
      {
        ...mockBook,
        title: 'Book, "One"',
      },
    ]);

    expect(csv).toBe(
      [
        'name,description,detailsUrl',
        '"Book, ""One""",Jane Author (2001),https://openlibrary.org/works/OL1W',
      ].join('\n')
    );
  });

  it('builds file name from selected items count', () => {
    expect(buildSelectedItemsCsvFilename(2)).toBe('2_items.csv');
  });
});
