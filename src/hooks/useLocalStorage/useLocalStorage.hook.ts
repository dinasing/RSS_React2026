import { useState } from 'react';

const readStorage = (
  key: string,
  initialValue: string | null
): string | null => {
  try {
    return localStorage.getItem(key) ?? initialValue;
  } catch {
    return initialValue;
  }
};

const writeStorage = (key: string, value: string | null) => {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
};

export const useLocalStorage = (
  key: string,
  initialValue: string | null = null
) => {
  const [storedValue, setStoredValue] = useState<string | null>(() =>
    readStorage(key, initialValue)
  );

  const setValue = (value: string | null) => {
    setStoredValue(value);

    writeStorage(key, value);
  };

  const removeValue = () => {
    setValue(null);
  };

  return [storedValue, setValue, removeValue] as const;
};
