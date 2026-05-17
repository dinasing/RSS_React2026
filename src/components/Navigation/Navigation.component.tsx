import { NavLink } from 'react-router';

const Navigation = () => {
  return (
    <nav className="mx-auto my-4">
      <ul className="flex gap-2">
        <li>
          <NavLink className="text-white hover:text-blue-600 text-lg" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className="text-white hover:text-blue-600 text-lg"
            to="/about"
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
