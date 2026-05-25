import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import * as booksApi from './api/books.api';
import App from './App';
import { ThemeProvider } from './context/Theme/Theme.context';
import { selectedItemsReducer } from './store/selectedItems/selectedItems.slice';
import { mockDefaultResults } from './test-utils/fixtures';

vi.mock('./api/books.api', () => ({
  searchBooks: vi.fn(),
  getDefaultBooks: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(booksApi.getDefaultBooks).mockResolvedValue(mockDefaultResults);
  });

  it('renders the search page', async () => {
    const store = configureStore({
      reducer: {
        selectedItems: selectedItemsReducer,
      },
    });

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
