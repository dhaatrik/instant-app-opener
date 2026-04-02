import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge standard classes', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should merge conflicting Tailwind classes correctly', () => {
      // tailwind-merge should resolve bg-red-500 and bg-blue-500 to bg-blue-500
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
    });

    it('should handle conditional classes correctly', () => {
      expect(cn('base-class', true && 'active-class', false && 'inactive-class')).toBe('base-class active-class');
      expect(cn('base-class', { 'active-class': true, 'inactive-class': false })).toBe('base-class active-class');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });

    it('should ignore null and undefined', () => {
      expect(cn('class1', null, undefined, 'class2')).toBe('class1 class2');
    });
  });
});
