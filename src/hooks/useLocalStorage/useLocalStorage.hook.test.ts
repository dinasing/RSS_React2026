import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage.hook';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('query', null));

    expect(result.current[0]).toBeNull();
  });

  it('reads existing value from localStorage on mount', () => {
    localStorage.setItem('query', 'react');

    const { result } = renderHook(() => useLocalStorage('query', null));

    expect(result.current[0]).toBe('react');
  });

  it('persists value to localStorage when updated', () => {
    const { result } = renderHook(() => useLocalStorage('query', null));

    act(() => {
      result.current[1]('vue');
    });

    expect(result.current[0]).toBe('vue');
    expect(localStorage.getItem('query')).toBe('vue');
  });

  it('removes key from localStorage when value is set to null', () => {
    localStorage.setItem('query', 'react');

    const { result } = renderHook(() => useLocalStorage('query', null));

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
    expect(localStorage.getItem('query')).toBeNull();
  });

  it('clears storage via removeValue', () => {
    localStorage.setItem('query', 'react');

    const { result } = renderHook(() => useLocalStorage('query', null));

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBeNull();
    expect(localStorage.getItem('query')).toBeNull();
  });
});
