import dns from 'node:dns/promises';
import { isIP } from 'node:net';

// ⚡ Bolt: Precompiled regex for faster IPv6 prefix scanning
const IPV6_PRIVATE_RE = /^(?:fc|fd|fe[89ab])/i;

// ⚡ Bolt: Hoisted from loop to prevent redundant RegExp allocations
const IPV4_MAPPED_RE = /^(?:(?:0{0,4}:)+)?(?:0{0,4}|ffff):([^:]+(?:\.[^:]+)*|[^:]+:[^:]+)$/;

// ⚡ Bolt: Replaced chained startsWith/match with precompiled RegExp for faster IP evaluation
const IPV4_PRIVATE_RE = /^(?:127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(?:1[6-9]|2[0-9]|3[0-1])\.)/;

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
      // Normalize all variations of IPv4-mapped/compatible IPv6 addresses
      // (e.g., ::ffff:127.0.0.1, 0:0:0:0:0:ffff:127.0.0.1, ::127.0.0.1, 0::127.0.0.1)
      const lowerAddress = address.toLowerCase();
      let isIPv4Mapped = false;

      const match = lowerAddress.match(IPV4_MAPPED_RE);

      if (match && lowerAddress !== '::1' && lowerAddress !== '::' && lowerAddress !== '0:0:0:0:0:0:0:1') {
          address = match[1];
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
        if (IPV4_PRIVATE_RE.test(address)) {
          return false;
        }
      } else {
        // Block IPv6 localhost and unspecified or private
        if (
          address === '[::1]' ||
          address === '[::]' ||
          address === '::1' ||
          address === '::' ||
          IPV6_PRIVATE_RE.test(address)
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
