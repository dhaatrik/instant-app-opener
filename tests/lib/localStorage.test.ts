import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setLocalStorage } from '@/lib/localStorage';

describe('localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
});
