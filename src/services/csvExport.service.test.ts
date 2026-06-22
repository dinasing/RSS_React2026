import { mockBook } from '../test-utils/fixtures';
import { compileSelectedItemsCsv } from './csvExport.service';

describe('csvExport service', () => {
  it('compiles csv on the server from valid selected items', () => {
    const result = compileSelectedItemsCsv([
      {
        ...mockBook,
        title: 'Book, "One"',
      },
    ]);

    expect(result).toEqual({
      success: true,
      csv: [
        'name,description,detailsUrl',
        '"Book, ""One""",Jane Author (2001),https://openlibrary.org/works/OL1W',
      ].join('\n'),
      fileName: '1_items.csv',
    });
  });

  it('returns an error when no items are selected', () => {
    expect(compileSelectedItemsCsv([])).toEqual({
      success: false,
      error: 'No items selected',
    });
  });

  it('returns an error for invalid item data', () => {
    expect(
      compileSelectedItemsCsv([
        {
          key: '/works/OL1W',
          title: 'Invalid item',
        },
      ])
    ).toEqual({
      success: false,
      error: 'Invalid item data',
    });
  });
});
