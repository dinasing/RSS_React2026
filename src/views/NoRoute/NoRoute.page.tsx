'use client';

import { useTranslations } from 'next-intl';
import GoHome from '../../components/GoHome/GoHome.component';

const NoRoute = () => {
  const t = useTranslations('NoRoute');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-lg">{t('description')}</p>
      <GoHome />
    </div>
  );
};

export default NoRoute;
