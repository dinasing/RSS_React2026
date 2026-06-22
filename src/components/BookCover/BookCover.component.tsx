'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getBookCoverUrl } from '../../util/bookCover.util';

type BookCoverProps = {
  coverId?: number | null;
  width?: number;
  height?: number;
  priority?: boolean;
  imageClassName?: string;
  placeholderClassName?: string;
};

const BookCoverComponent = ({
  coverId,
  width = 80,
  height = 120,
  priority = false,
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
    <Image
      src={getBookCoverUrl(coverId)}
      alt={t('alt')}
      width={width}
      height={height}
      priority={priority}
      className={imageClassName}
      sizes={`${width}px`}
      onError={() => setFailedCoverId(coverId)}
    />
  );
};

export default BookCoverComponent;
