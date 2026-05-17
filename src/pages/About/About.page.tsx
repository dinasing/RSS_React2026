import { Link } from 'react-router';
import GoHome from '../../components/GoHome/GoHome.component';

const About = () => (
  <>
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white">About page</h1>
      <p className="text-lg text-white">
        This is a simple app that allows you to search for books using the{' '}
        <Link
          className="text-blue-500 hover:text-blue-600 bg-white px-2 py-1 rounded-md"
          to="https://openlibrary.org/"
        >
          Open Library
        </Link>{' '}
        API
      </p>
      <p className="text-md text-white">
        Author: dinasing{' '}
        <Link
          className="text-blue-500 hover:text-blue-600 bg-white px-2 py-1 rounded-md"
          to="https://github.com/dinasing"
        >
          GitHub
        </Link>
      </p>
      <p className="text-lg text-white">
        This app was implemented as part of the{' '}
        <Link
          className="text-blue-500 hover:text-blue-600 bg-white px-2 py-1 rounded-md"
          to="https://rs.school/courses/reactjs"
        >
          RSS React 2026 course
        </Link>
      </p>
      <GoHome />
    </div>
  </>
);

export default About;
