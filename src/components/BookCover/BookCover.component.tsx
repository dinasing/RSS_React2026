'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getBookCoverUrl } from '../../util/bookCover.util';

type BookCoverProps = {
  coverId?: number | null;
  imageClassName?: string;
  placeholderClassName?: string;
};

const BookCoverComponent = ({
  coverId,
  imageClassName = 'w-[80px] h-[120px] rounded shrink-0 object-cover bg-neutral-100',
  placeholderClassName = 'w-[80px] h-[120px] rounded shrink-0',
}: BookCoverProps) => {
  const t = useTranslations('BookCover');
  const [failedCoverId, setFailedCoverId] = useState<number | null>(null);
  const coverLoadFailed = coverId != null && failedCoverId === coverId;

  if (coverId == null || coverLoadFailed) {
    return (
      <div
        className={`${placeholderClassName} flex items-center justify-center bg-neutral-100 text-4xl`}
      >
        📖
      </div>
    );
  }

  return (
    <img
      src={getBookCoverUrl(coverId)}
      alt={t('alt')}
      className={imageClassName}
      onError={() => setFailedCoverId(coverId)}
    />
  );
};

export default BookCoverComponent;
