import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  THEME_DARK,
  THEME_LIGHT,
  ThemeContext,
  type Theme,
} from './Theme.shared';

const THEME_STORAGE_KEY = 'theme';

const isTheme = (value: string | null): value is Theme =>
  value === THEME_LIGHT || value === THEME_DARK;

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return THEME_LIGHT;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(storedTheme) ? storedTheme : THEME_LIGHT;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle(THEME_DARK, theme === THEME_DARK);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT
    );
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
