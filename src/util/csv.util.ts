import type { SearchResultItemType } from '../types/searchResultItem.type';

const CSV_HEADERS = ['name', 'description', 'detailsUrl'];
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';

const escapeCsvValue = (value: string) => {
  if (!/[",\r\n]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
};

const buildItemDescription = (item: SearchResultItemType) => {
  const authors = item.author_name.length
    ? item.author_name.join(', ')
    : 'Unknown author';
  const firstPublishYear = item.first_publish_year ?? 'Unknown year';

  return `${authors} (${firstPublishYear})`;
};

export const buildSelectedItemsCsv = (
  selectedItems: SearchResultItemType[]
) => {
  const rows = selectedItems.map((item) =>
    [
      item.title,
      buildItemDescription(item),
      `${OPEN_LIBRARY_BASE_URL}${item.key}`,
    ]
      .map((value) => escapeCsvValue(String(value)))
      .join(',')
  );

  return [CSV_HEADERS.join(','), ...rows].join('\n');
};

export const buildSelectedItemsCsvFilename = (selectedCount: number) =>
  `${selectedCount}_items.csv`;
