import { describe, it, expect } from 'vitest';
import { isSafeUrl, getSafeUrl } from '../../lib/safe-url';

describe('isSafeUrl', () => {
  it('should allow http and https urls', () => {
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('https://example.com')).toBe(true);
  });

  it('should allow deep link schemas', () => {
    expect(isSafeUrl('twitter://status?id=123')).toBe(true);
    expect(isSafeUrl('fb://profile/123')).toBe(true);
    expect(isSafeUrl('intent://abc')).toBe(true);
    expect(isSafeUrl('vnd.youtube://123')).toBe(true);
  });

  it('should allow relative paths', () => {
    expect(isSafeUrl('/')).toBe(true);
    expect(isSafeUrl('/abc')).toBe(true);
    expect(isSafeUrl('abc/def')).toBe(true);
  });

  it('should block javascript: urls and null byte injections', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl(' javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('\tjavascript:alert(1)')).toBe(false);
    expect(isSafeUrl('\njavascript:alert(1)')).toBe(false);
    expect(isSafeUrl('JaVaScRiPt:alert(1)')).toBe(false);
    expect(isSafeUrl('j\u0000avascript:alert(1)')).toBe(false);
  });

  it('should block vbscript: urls', () => {
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
  });

  it('should block data: urls', () => {
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });
});

describe('getSafeUrl', () => {
  it('should return the original url if safe', () => {
    expect(getSafeUrl('https://example.com')).toBe('https://example.com');
  });

  it('should return the fallback url if unsafe', () => {
    expect(getSafeUrl('javascript:alert(1)', '/fallback')).toBe('/fallback');
  });

  it('should use default fallback url if unsafe and no fallback provided', () => {
    expect(getSafeUrl('javascript:alert(1)')).toBe('/');
  });
});
