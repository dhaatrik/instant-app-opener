import { describe, it, expect } from 'vitest';
import { isSafeUrl, getSafeUrl } from '../../lib/safe-url';

describe('isSafeUrl', () => {
  it('should allow http, https, mailto, and tel urls', () => {
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('mailto:test@example.com')).toBe(true);
    expect(isSafeUrl('tel:+1234567890')).toBe(true);
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

  it('should block javascript: urls', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl(' javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('\tjavascript:alert(1)')).toBe(false);
    expect(isSafeUrl('\njavascript:alert(1)')).toBe(false);
    expect(isSafeUrl('JaVaScRiPt:alert(1)')).toBe(false);
  });

  it('should block control characters to prevent bypasses', () => {
    expect(isSafeUrl('\x00javascript:alert(1)')).toBe(false);
    expect(isSafeUrl(' \x00javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('java\x00script:alert(1)')).toBe(false);
    expect(isSafeUrl('javascript:alert(1)\x00')).toBe(false);
    expect(isSafeUrl('\x14javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('http://example.com/\x00')).toBe(false);
  });

  it('should block unknown or unsafe protocols', () => {
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
    expect(isSafeUrl('ftp://example.com')).toBe(false);
    expect(isSafeUrl('unknown://example.com')).toBe(false);
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
