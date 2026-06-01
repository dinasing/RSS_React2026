import { configureStore } from '@reduxjs/toolkit';
import { booksApi } from '../store/api/booksApi';
import { selectedItemsReducer } from '../store/selectedItems/selectedItems.slice';

export function createTestStore() {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(booksApi.middleware),
  });
}
