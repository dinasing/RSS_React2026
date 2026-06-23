import { configureStore } from '@reduxjs/toolkit';
import { booksApi } from './api/booksApi';
import { selectedItemsReducer } from './selectedItems/selectedItems.slice';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [booksApi.reducerPath]: booksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
