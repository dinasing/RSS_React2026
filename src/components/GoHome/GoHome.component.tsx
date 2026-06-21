import Link from 'next/link';

const GoHome = () => (
  <Link
    className="text-white hover:bg-blue-600 shadow-md bg-blue-500 px-2 py-1 rounded-md block w-fit my-2"
    href="/"
  >
    Go back to the home page
  </Link>
);

export default GoHome;
