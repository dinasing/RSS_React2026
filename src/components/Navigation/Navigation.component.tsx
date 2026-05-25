import { NavLink } from 'react-router';
import { THEME_DARK, useTheme } from '../../context/Theme/Theme.shared';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === THEME_DARK;
  const navLinkClassName = isDarkTheme
    ? 'text-white hover:text-blue-200 text-lg'
    : 'text-slate-900 hover:text-blue-700 text-lg';

  return (
    <nav className="mx-auto my-4 flex w-full items-center justify-between gap-4">
      <ul className="flex gap-2">
        <li>
          <NavLink className={navLinkClassName} to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className={navLinkClassName} to="/about">
            About
          </NavLink>
        </li>
      </ul>
      <button
        type="button"
        className={`rounded-md px-3 py-2 text-sm font-semibold ${
          isDarkTheme
            ? 'border border-white text-white hover:bg-slate-700'
            : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
        }`}
        onClick={toggleTheme}
      >
        Theme: {isDarkTheme ? 'Dark' : 'Light'}
      </button>
    </nav>
  );
};

export default Navigation;
