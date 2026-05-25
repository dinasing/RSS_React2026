import GoHome from '../../components/GoHome/GoHome.component';

const NoRoute = () => (
  <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold">Nothing on this route</h1>
    <p className="text-lg">The page you are looking for does not exist.</p>
    <GoHome />
  </div>
);

export default NoRoute;
