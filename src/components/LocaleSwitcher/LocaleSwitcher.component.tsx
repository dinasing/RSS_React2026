'use client';

import { useTranslations } from 'next-intl';
import { THEME_DARK, useTheme } from '../../context/Theme/Theme.shared';
import { locales, type Locale } from '../../i18n/config';
import { useLocaleContext } from '../../context/Locale/Locale.shared';

const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher');
  const { locale, setLocale } = useLocaleContext();
  const { theme } = useTheme();
  const isDarkTheme = theme === THEME_DARK;

  const selectClassName = isDarkTheme
    ? 'rounded-md border border-white bg-slate-800 px-3 py-2 text-sm font-semibold text-white'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900';

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value as Locale);
  };

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{t('label')}</span>
      <select
        aria-label={t('label')}
        className={selectClassName}
        value={locale}
        onChange={handleChange}
      >
        {locales.map((optionLocale) => (
          <option key={optionLocale} value={optionLocale}>
            {t(optionLocale)}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LocaleSwitcher;
