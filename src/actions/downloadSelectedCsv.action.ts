'use server';

import { compileSelectedItemsCsv } from '../services/csvExport.service';
import type { SearchResultItemType } from '../types/searchResultItem.type';

export type DownloadSelectedCsvState =
  | {
      csv: string;
      fileName: string;
    }
  | {
      error: string;
    }
  | null;

export async function downloadSelectedCsvAction(
  _prevState: DownloadSelectedCsvState,
  selectedItems: SearchResultItemType[]
): Promise<DownloadSelectedCsvState> {
  const result = compileSelectedItemsCsv(selectedItems);

  if (!result.success) {
    return { error: result.error };
  }

  return {
    csv: result.csv,
    fileName: result.fileName,
  };
}
