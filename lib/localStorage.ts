export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        try {
          return JSON.parse(saved) as T;
        } catch (e) {
          return saved as unknown as T;
        }
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
    }
  }
  return defaultValue;
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }
}
