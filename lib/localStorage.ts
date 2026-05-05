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
