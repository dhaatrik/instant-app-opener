import dns from 'node:dns/promises';
import { isIP } from 'node:net';

export async function isSafeUrlForFetch(url: string): Promise<boolean> {
  if (!url || url.length > 2048) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    // Only allow HTTP and HTTPS
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false;
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    // Block localhost, .local, and .internal domains
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return false;
    }

    let addresses: string[] = [];

    // URL parser includes brackets for IPv6 addresses (e.g., "[::1]"),
    // but isIP() requires the raw address without brackets.
    const cleanHostname = hostname.replace(/^\[|\]$/g, '');

    if (isIP(cleanHostname)) {
      addresses = [cleanHostname];
    } else {
      try {
        const lookup = await dns.lookup(hostname, { all: true });
        addresses = lookup.map(res => res.address);
      } catch {
        // If DNS resolution fails, consider it unsafe
        return false;
      }
    }

    // Check if the hostname or any resolved IP is an IPv4 or IPv6 address
    for (let address of addresses) {
      // Normalize IPv4-mapped IPv6 addresses (e.g., ::ffff:127.0.0.1 or 0:0:0:0:0:ffff:127.0.0.1)
      const lowerAddress = address.toLowerCase();
      let isIPv4Mapped = false;
      if (lowerAddress.startsWith('::ffff:')) {
        address = address.substring(7);
        isIPv4Mapped = true;
      } else if (lowerAddress.startsWith('0:0:0:0:0:ffff:')) {
        address = address.substring(15);
        isIPv4Mapped = true;
      }

      // Handle hex-formatted IPv4-mapped IPv6 addresses (e.g., ::ffff:7f00:1)
      if (isIPv4Mapped && address.includes(':') && !address.includes('.')) {
        const parts = address.split(':');
        if (parts.length === 2) {
          const p1 = parseInt(parts[0], 16);
          const p2 = parseInt(parts[1], 16);
          address = `${(p1 >> 8) & 255}.${p1 & 255}.${(p2 >> 8) & 255}.${p2 & 255}`;
        }
      }

      const isIPv4 = address.includes('.');

      if (isIPv4) {
        // Block IPv4 private/loopback/link-local ranges
        if (
          address.startsWith('127.') || // Loopback
          address.startsWith('10.') ||  // Class A private
          address.startsWith('192.168.') || // Class C private
          address.startsWith('169.254.') || // Link-local
          address.startsWith('0.') // Current network
        ) {
          return false;
        }

        // Block Class B private network (172.16.x.x - 172.31.x.x)
        if (address.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
          return false;
        }
      } else {
        // Block IPv6 localhost and unspecified or private
        if (
          address === '[::1]' ||
          address === '[::]' ||
          address === '::1' ||
          address === '::' ||
          address.toLowerCase().startsWith('fc') ||
          address.toLowerCase().startsWith('fd') ||
          address.toLowerCase().startsWith('fe8') ||
          address.toLowerCase().startsWith('fe9') ||
          address.toLowerCase().startsWith('fea') ||
          address.toLowerCase().startsWith('feb')
        ) {
          return false;
        }
      }
    }

    // If it passed all checks, it's considered safe for fetch
    return true;
  } catch {
    // If URL parsing fails, consider it unsafe
    return false;
  }
}
