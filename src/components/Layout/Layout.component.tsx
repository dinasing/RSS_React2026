'use client';

import { THEME_DARK, useTheme } from '../../context/Theme/Theme.shared';
import Navigation from '../Navigation/Navigation.component';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === THEME_DARK;

  return (
    <div
      className={`mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-4 py-16 ${
        isDarkTheme
          ? 'bg-flannel text-white'
          : 'bg-flannel-light text-slate-900'
      }`}
    >
      <header>
        <Navigation />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
