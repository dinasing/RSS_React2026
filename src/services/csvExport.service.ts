import type { SearchResultItemType } from '../types/searchResultItem.type';
import {
  buildSelectedItemsCsv,
  buildSelectedItemsCsvFilename,
} from '../util/csv.util';

const MAX_SELECTED_ITEMS = 500;

export type CompileSelectedItemsCsvResult =
  | {
      success: true;
      csv: string;
      fileName: string;
    }
  | {
      success: false;
      error: string;
    };

const isSearchResultItem = (value: unknown): value is SearchResultItemType => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.key === 'string' &&
    typeof item.title === 'string' &&
    Array.isArray(item.author_name) &&
    item.author_name.every((author) => typeof author === 'string') &&
    typeof item.first_publish_year === 'number' &&
    typeof item.cover_i === 'number'
  );
};

export const compileSelectedItemsCsv = (
  selectedItems: unknown
): CompileSelectedItemsCsvResult => {
  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    return { success: false, error: 'No items selected' };
  }

  if (selectedItems.length > MAX_SELECTED_ITEMS) {
    return { success: false, error: 'Too many items selected' };
  }

  if (!selectedItems.every(isSearchResultItem)) {
    return { success: false, error: 'Invalid item data' };
  }

  return {
    success: true,
    csv: buildSelectedItemsCsv(selectedItems),
    fileName: buildSelectedItemsCsvFilename(selectedItems.length),
  };
};
