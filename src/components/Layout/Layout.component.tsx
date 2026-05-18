import { Outlet } from 'react-router';
import Navigation from '../Navigation/Navigation.component';

const Layout = () => {
  return (
    <div className="bg-flannel mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-4 py-16">
      <header>
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
