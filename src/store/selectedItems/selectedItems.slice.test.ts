import { mockBook, mockBookSearch } from '../../test-utils/fixtures';
import type { RootState } from '../store';
import {
  selectIsItemSelected,
  selectItem,
  selectSelectedItemsByKey,
  selectSelectedItemsCount,
  selectSelectedItemsList,
  selectedItemsReducer,
  toggleItem,
  unselectAll,
  unselectItem,
  type SelectedItemsByKey,
} from './selectedItems.slice';

const buildRootState = (selectedItemsByKey: SelectedItemsByKey): RootState =>
  ({
    selectedItems: {
      byKey: selectedItemsByKey,
    },
  }) as RootState;

describe('selectedItemsSlice reducer', () => {
  it('selectItem stores item by work key', () => {
    const state = selectedItemsReducer(undefined, selectItem(mockBook));

    expect(state.byKey[mockBook.key]).toEqual(mockBook);
  });

  it('unselectItem removes item by work key', () => {
    const selectedState = selectedItemsReducer(undefined, selectItem(mockBook));

    const state = selectedItemsReducer(
      selectedState,
      unselectItem(mockBook.key)
    );

    expect(state.byKey[mockBook.key]).toBeUndefined();
  });

  it('toggleItem adds when item is not selected', () => {
    const state = selectedItemsReducer(undefined, toggleItem(mockBook));

    expect(state.byKey[mockBook.key]).toEqual(mockBook);
  });

  it('toggleItem removes when item is already selected', () => {
    const selectedState = selectedItemsReducer(undefined, selectItem(mockBook));

    const state = selectedItemsReducer(selectedState, toggleItem(mockBook));

    expect(state.byKey[mockBook.key]).toBeUndefined();
  });

  it('unselectAll clears selected items', () => {
    const stateWithItems = selectedItemsReducer(
      selectedItemsReducer(undefined, selectItem(mockBook)),
      selectItem(mockBookSearch)
    );

    const state = selectedItemsReducer(stateWithItems, unselectAll());

    expect(state.byKey).toEqual({});
  });
});

describe('selectedItems selectors', () => {
  it('returns selected items dictionary', () => {
    const state = buildRootState({
      [mockBook.key]: mockBook,
    });

    expect(selectSelectedItemsByKey(state)).toEqual({
      [mockBook.key]: mockBook,
    });
  });

  it('returns selected items list', () => {
    const state = buildRootState({
      [mockBook.key]: mockBook,
      [mockBookSearch.key]: mockBookSearch,
    });

    expect(selectSelectedItemsList(state)).toEqual([mockBook, mockBookSearch]);
  });

  it('returns selected items count', () => {
    const state = buildRootState({
      [mockBook.key]: mockBook,
      [mockBookSearch.key]: mockBookSearch,
    });

    expect(selectSelectedItemsCount(state)).toBe(2);
  });

  it('returns true when item is selected', () => {
    const state = buildRootState({
      [mockBook.key]: mockBook,
    });

    expect(selectIsItemSelected(mockBook.key)(state)).toBe(true);
  });

  it('returns false when item is not selected', () => {
    const state = buildRootState({
      [mockBook.key]: mockBook,
    });

    expect(selectIsItemSelected(mockBookSearch.key)(state)).toBe(false);
  });
});
