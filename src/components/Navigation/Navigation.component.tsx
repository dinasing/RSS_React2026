'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { THEME_DARK, useTheme } from '../../context/Theme/Theme.shared';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher.component';

const Navigation = () => {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === THEME_DARK;
  const navLinkClassName = isDarkTheme
    ? 'text-white hover:text-blue-200 text-lg'
    : 'text-slate-900 hover:text-blue-700 text-lg';

  const getLinkClassName = (href: string) =>
    `${navLinkClassName}${pathname === href ? ' font-bold underline' : ''}`;

  return (
    <nav className="mx-auto my-4 flex w-full items-center justify-between gap-4">
      <ul className="flex gap-2">
        <li>
          <Link className={getLinkClassName('/')} href="/">
            {t('home')}
          </Link>
        </li>
        <li>
          <Link className={getLinkClassName('/about')} href="/about">
            {t('about')}
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-semibold ${
            isDarkTheme
              ? 'border border-white text-white hover:bg-slate-700'
              : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
          }`}
          onClick={toggleTheme}
        >
          {t('theme', {
            mode: isDarkTheme ? t('themeDark') : t('themeLight'),
          })}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
