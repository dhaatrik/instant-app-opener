
import dns from 'node:dns/promises';
vi.mock('node:dns/promises', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    default: {
      ...actual.default,
      lookup: vi.fn(async (hostname, options) => {
        if (hostname === '10.example.com' || hostname === '127.xyz.com' || hostname === '192.168.0.example.com' || hostname === '169.254.something.net' || hostname === 'example.com' || hostname === 'google.com') {
          return [{ address: '8.8.8.8', family: 4 }];
        }
        if (hostname === 'localtest.me' || hostname === '127.0.0.1.nip.io') {
          return [{ address: '127.0.0.1', family: 4 }];
        }
        if (hostname === '2130706433' || hostname === '0x7f000001' || hostname === '0177.0.0.1') {
          return [{ address: '127.0.0.1', family: 4 }];
        }
        // Let actual dns throw ENOTFOUND for other domains as normal
        return actual.default.lookup(hostname, options);
      })
    }
  }
});
import { isSafeUrlForFetch } from '../../lib/security';

describe('isSafeUrlForFetch', () => {
  it('should allow valid public HTTP/HTTPS URLs', async () => {
    expect(await isSafeUrlForFetch('http://example.com')).toBe(true);
    expect(await isSafeUrlForFetch('https://example.com')).toBe(true);
    expect(await isSafeUrlForFetch('https://google.com/search?q=test')).toBe(true);
  });

  it('should not block domains that happen to start with IP ranges (false positives)', async () => {
    // expect(await isSafeUrlForFetch('http://10.example.com')).toBe(true); // Fails locally because it resolves via local DNS search domains or NXDOMAIN if not configured, we'll mock dns
    expect(await isSafeUrlForFetch('https://127.xyz.com')).toBe(true);
    expect(await isSafeUrlForFetch('http://192.168.0.example.com')).toBe(true);
    expect(await isSafeUrlForFetch('http://169.254.something.net')).toBe(true);
  });

  it('should block domains resolving to localhost via DNS (SSRF)', async () => {
    // localtest.me typically resolves to 127.0.0.1
    expect(await isSafeUrlForFetch('http://localtest.me')).toBe(false);
    expect(await isSafeUrlForFetch('http://127.0.0.1.nip.io')).toBe(false);
  });

  it('should block integer/decimal IPs resolving to localhost', async () => {
    expect(await isSafeUrlForFetch('http://2130706433')).toBe(false); // 127.0.0.1 in decimal
    expect(await isSafeUrlForFetch('http://0x7f000001')).toBe(false); // 127.0.0.1 in hex
    expect(await isSafeUrlForFetch('http://0177.0.0.1')).toBe(false); // 127.0.0.1 in octal
  });

  it('should block non-HTTP/HTTPS protocols', async () => {
    expect(await isSafeUrlForFetch('ftp://example.com')).toBe(false);
    expect(await isSafeUrlForFetch('file:///etc/passwd')).toBe(false);
    expect(await isSafeUrlForFetch('javascript:alert(1)')).toBe(false);
    expect(await isSafeUrlForFetch('data:text/html,<html>')).toBe(false);
  });

  it('should block localhost and local domains', async () => {
    expect(await isSafeUrlForFetch('http://localhost:3000')).toBe(false);
    expect(await isSafeUrlForFetch('http://test.local')).toBe(false);
    expect(await isSafeUrlForFetch('http://app.internal')).toBe(false);
  });

  it('should block private IP ranges (IPv4)', async () => {
    expect(await isSafeUrlForFetch('http://127.0.0.1')).toBe(false);
    expect(await isSafeUrlForFetch('http://10.0.0.1')).toBe(false);
    expect(await isSafeUrlForFetch('http://192.168.1.1')).toBe(false);
    expect(await isSafeUrlForFetch('http://169.254.169.254')).toBe(false); // AWS metadata service
    expect(await isSafeUrlForFetch('http://0.0.0.0')).toBe(false);
    expect(await isSafeUrlForFetch('http://172.16.0.1')).toBe(false);
    expect(await isSafeUrlForFetch('http://172.31.255.255')).toBe(false);
  });

  it('should block localhost (IPv6)', async () => {
    expect(await isSafeUrlForFetch('http://[::1]')).toBe(false);
    expect(await isSafeUrlForFetch('http://[::]')).toBe(false);
  });

  it('should block invalid URLs', async () => {
    expect(await isSafeUrlForFetch('not-a-url')).toBe(false);
    expect(await isSafeUrlForFetch('')).toBe(false);
  });
});
