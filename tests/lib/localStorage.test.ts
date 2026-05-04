import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLocalStorage, setLocalStorage } from '@/lib/localStorage';

describe('localStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setLocalStorage', () => {
    it('should save a string value to localStorage', () => {
      const key = 'testKey';
      const value = 'testValue';

      setLocalStorage(key, value);

      expect(localStorage.getItem(key)).toBe(value);
    });

    it('should save an object value as a JSON string to localStorage', () => {
      const key = 'testKey';
      const value = { foo: 'bar', baz: 123 };

      setLocalStorage(key, value);

      expect(localStorage.getItem(key)).toBe(JSON.stringify(value));
    });

    it('should save a number value as a JSON string to localStorage', () => {
      const key = 'testKey';
      const value = 42;

      setLocalStorage(key, value);

      expect(localStorage.getItem(key)).toBe(JSON.stringify(value));
    });

    it('should save a boolean value as a JSON string to localStorage', () => {
      const key = 'testKey';
      const value = true;

      setLocalStorage(key, value);

      expect(localStorage.getItem(key)).toBe(JSON.stringify(value));
    });

    it('should handle errors when localStorage.setItem throws', () => {
      const key = 'testKey';
      const value = 'testValue';
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      setLocalStorage(key, value);

      expect(consoleSpy).toHaveBeenCalledWith('Failed to save to local storage', expect.any(Error));

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('getLocalStorage', () => {
    it('should return the saved string value', () => {
      const key = 'testKey';
      const value = 'testValue';
      localStorage.setItem(key, value);

      expect(getLocalStorage(key, 'default')).toBe(value);
    });

    it('should return the saved object value', () => {
      const key = 'testKey';
      const value = { foo: 'bar' };
      localStorage.setItem(key, JSON.stringify(value));

      expect(getLocalStorage(key, {})).toEqual(value);
    });

    it('should return the default value if the key does not exist', () => {
      const key = 'nonExistentKey';
      const defaultValue = 'defaultValue';

      expect(getLocalStorage(key, defaultValue)).toBe(defaultValue);
    });

    it('should return the raw string if JSON.parse fails', () => {
      const key = 'testKey';
      const value = 'invalid-json';
      localStorage.setItem(key, value);

      expect(getLocalStorage(key, 'default')).toBe(value);
    });

    it('should handle errors when localStorage.getItem throws', () => {
      const key = 'testKey';
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Read error');
      });

      expect(getLocalStorage(key, 'default')).toBe('default');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load from local storage', expect.any(Error));

      getItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });
});
