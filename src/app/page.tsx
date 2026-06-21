import { Suspense } from 'react';
import LoaderComponent from '../components/Loader/Loader.component';
import SearchPage from '../views/Search/Search.page';

export default function HomePage() {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <SearchPage />
    </Suspense>
  );
}
