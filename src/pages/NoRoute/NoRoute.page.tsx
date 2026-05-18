import GoHome from '../../components/GoHome/GoHome.component';

const NoRoute = () => (
  <div className="flex flex-col gap-6">
    <h1 className="text-3xl font-bold text-white">Nothing on this route</h1>
    <p className="text-lg text-white">
      The page you are looking for does not exist.
    </p>
    <GoHome />
  </div>
);

export default NoRoute;
