import { isSafeUrlForFetch } from '../../lib/security';

describe('isSafeUrlForFetch', () => {
  it('should allow valid public HTTP/HTTPS URLs', () => {
    expect(isSafeUrlForFetch('http://example.com')).toBe(true);
    expect(isSafeUrlForFetch('https://example.com')).toBe(true);
    expect(isSafeUrlForFetch('https://google.com/search?q=test')).toBe(true);
  });

  it('should not block domains that happen to start with IP ranges (false positives)', () => {
    expect(isSafeUrlForFetch('http://10.example.com')).toBe(true);
    expect(isSafeUrlForFetch('https://127.xyz.com')).toBe(true);
    expect(isSafeUrlForFetch('http://192.168.0.example.com')).toBe(true);
    expect(isSafeUrlForFetch('http://169.254.something.net')).toBe(true);
  });

  it('should block non-HTTP/HTTPS protocols', () => {
    expect(isSafeUrlForFetch('ftp://example.com')).toBe(false);
    expect(isSafeUrlForFetch('file:///etc/passwd')).toBe(false);
    expect(isSafeUrlForFetch('javascript:alert(1)')).toBe(false);
    expect(isSafeUrlForFetch('data:text/html,<html>')).toBe(false);
  });

  it('should block localhost and local domains', () => {
    expect(isSafeUrlForFetch('http://localhost:3000')).toBe(false);
    expect(isSafeUrlForFetch('http://test.local')).toBe(false);
    expect(isSafeUrlForFetch('http://app.internal')).toBe(false);
  });

  it('should block private IP ranges (IPv4)', () => {
    expect(isSafeUrlForFetch('http://127.0.0.1')).toBe(false);
    expect(isSafeUrlForFetch('http://10.0.0.1')).toBe(false);
    expect(isSafeUrlForFetch('http://192.168.1.1')).toBe(false);
    expect(isSafeUrlForFetch('http://169.254.169.254')).toBe(false); // AWS metadata service
    expect(isSafeUrlForFetch('http://0.0.0.0')).toBe(false);
    expect(isSafeUrlForFetch('http://172.16.0.1')).toBe(false);
    expect(isSafeUrlForFetch('http://172.31.255.255')).toBe(false);
  });

  it('should block localhost (IPv6)', () => {
    expect(isSafeUrlForFetch('http://[::1]')).toBe(false);
    expect(isSafeUrlForFetch('http://[::]')).toBe(false);
  });

  it('should block invalid URLs', () => {
    expect(isSafeUrlForFetch('not-a-url')).toBe(false);
    expect(isSafeUrlForFetch('')).toBe(false);
  });
});
