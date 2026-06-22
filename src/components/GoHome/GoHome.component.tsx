'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const GoHome = () => {
  const t = useTranslations('GoHome');

  return (
    <Link
      className="text-white hover:bg-blue-600 shadow-md bg-blue-500 px-2 py-1 rounded-md block w-fit my-2"
      href="/"
    >
      {t('link')}
    </Link>
  );
};

export default GoHome;
