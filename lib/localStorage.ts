export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      const stringified = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringified);
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }
}
