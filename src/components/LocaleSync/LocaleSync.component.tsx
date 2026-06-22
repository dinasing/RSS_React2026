'use client';

import { useEffect } from 'react';
import { useLocaleContext } from '../../context/Locale/Locale.shared';

const LocaleSync = () => {
  const { locale } = useLocaleContext();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
};

export default LocaleSync;
