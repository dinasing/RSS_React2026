'use client';

import { useTranslations } from 'next-intl';
import { THEME_DARK, useTheme } from '../../context/Theme/Theme.shared';
import { locales, type Locale } from '../../i18n/config';
import { useLocaleContext } from '../../context/Locale/Locale.shared';
import LocaleFlag from './LocaleFlag.component';

const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher');
  const { locale, setLocale } = useLocaleContext();
  const { theme } = useTheme();
  const isDarkTheme = theme === THEME_DARK;

  const buttonClassName = (optionLocale: Locale) => {
    const isSelected = locale === optionLocale;
    const baseClassName =
      'rounded-md border p-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

    if (isDarkTheme) {
      return `${baseClassName} ${
        isSelected
          ? 'border-blue-300 bg-slate-700 focus-visible:outline-blue-300'
          : 'border-white/40 bg-slate-800 hover:bg-slate-700 focus-visible:outline-white'
      }`;
    }

    return `${baseClassName} ${
      isSelected
        ? 'border-blue-600 bg-blue-50 focus-visible:outline-blue-600'
        : 'border-slate-300 bg-white hover:bg-slate-100 focus-visible:outline-slate-900'
    }`;
  };

  return (
    <div
      aria-label={t('label')}
      className="flex items-center gap-1"
      role="radiogroup"
    >
      {locales.map((optionLocale) => (
        <button
          key={optionLocale}
          aria-checked={locale === optionLocale}
          aria-label={t(optionLocale)}
          className={buttonClassName(optionLocale)}
          role="radio"
          type="button"
          onClick={() => setLocale(optionLocale)}
        >
          <LocaleFlag locale={optionLocale} />
        </button>
      ))}
    </div>
  );
};

export default LocaleSwitcher;
