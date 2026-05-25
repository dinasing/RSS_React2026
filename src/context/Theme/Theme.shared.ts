import { createContext, useContext } from 'react';

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

export type Theme = typeof THEME_LIGHT | typeof THEME_DARK;

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
