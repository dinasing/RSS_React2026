import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { SearchResultItemType } from '../../types/searchResultItem.type';
import type { RootState } from '../store.ts';

export type SelectedItem = SearchResultItemType;
export type SelectedItemsByKey = Record<string, SelectedItem>;

export type SelectedItemsState = {
  byKey: SelectedItemsByKey;
};

const initialState: SelectedItemsState = {
  byKey: {},
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<SelectedItem>) => {
      state.byKey[action.payload.key] = action.payload;
    },
    unselectItem: (state, action: PayloadAction<string>) => {
      delete state.byKey[action.payload];
    },
    toggleItem: (state, action: PayloadAction<SelectedItem>) => {
      const { key } = action.payload;

      if (state.byKey[key]) {
        delete state.byKey[key];
        return;
      }

      state.byKey[key] = action.payload;
    },
    unselectAll: (state) => {
      state.byKey = {};
    },
  },
});

export const { selectItem, unselectItem, toggleItem, unselectAll } =
  selectedItemsSlice.actions;
export const selectedItemsReducer = selectedItemsSlice.reducer;

const selectSelectedItemsState = (state: RootState) => state.selectedItems;

export const selectSelectedItemsByKey = createSelector(
  [selectSelectedItemsState],
  (selectedItemsState) => selectedItemsState.byKey
);

export const selectSelectedItemsList = createSelector(
  [selectSelectedItemsByKey],
  (selectedItemsByKey) => Object.values(selectedItemsByKey)
);

export const selectSelectedItemsCount = createSelector(
  [selectSelectedItemsByKey],
  (selectedItemsByKey) => Object.keys(selectedItemsByKey).length
);

export const selectIsItemSelected = (workKey: string) =>
  createSelector([selectSelectedItemsByKey], (selectedItemsByKey) =>
    Boolean(selectedItemsByKey[workKey])
  );
