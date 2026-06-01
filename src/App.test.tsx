import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from './App';
import { ThemeProvider } from './context/Theme/Theme.context';
import { mockSearchAndDefaultFetch } from './test-utils/fetchMock';
import { mockDefaultResults } from './test-utils/fixtures';
import { createTestStore } from './test-utils/testStore';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    mockSearchAndDefaultFetch({ defaultBooks: mockDefaultResults });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the search page', async () => {
    const store = createTestStore();

    render(
      <ThemeProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    );

    expect(
      await screen.findByRole('heading', { name: /book search/i })
    ).toBeInTheDocument();
  });
});
