import { Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout.component';
import About from './pages/About/About.page';
import NoRoute from './pages/NoRoute/NoRoute.page';
import SearchPage from './pages/Search/Search.page';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SearchPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NoRoute />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
