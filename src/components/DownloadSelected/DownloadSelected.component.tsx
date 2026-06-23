'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { downloadSelectedCsvAction } from '../../actions/downloadSelectedCsv.action';
import type { SearchResultItemType } from '../../types/searchResultItem.type';
import { triggerCsvDownload } from '../../util/csvDownload.util';

type DownloadSelectedProps = {
  selectedItems: SearchResultItemType[];
};

const DownloadSelected = ({ selectedItems }: DownloadSelectedProps) => {
  const t = useTranslations('Search');
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    if (selectedItems.length === 0 || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await downloadSelectedCsvAction(null, selectedItems);

      if (result && 'csv' in result) {
        triggerCsvDownload(result.csv, result.fileName);
      }
    });
  };

  return (
    <button
      type="button"
      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={selectedItems.length === 0 || isPending}
      onClick={handleDownload}
    >
      {t('download')}
    </button>
  );
};

export default DownloadSelected;
