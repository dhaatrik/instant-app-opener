export function isSafeUrlForFetch(url: string): boolean {
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

    // Check if the hostname is an IPv4 address
    const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    if (isIPv4) {
      // Block IPv4 private/loopback/link-local ranges
      if (
        hostname.startsWith('127.') || // Loopback
        hostname.startsWith('10.') ||  // Class A private
        hostname.startsWith('192.168.') || // Class C private
        hostname.startsWith('169.254.') || // Link-local
        hostname.startsWith('0.') // Current network
      ) {
        return false;
      }

      // Block Class B private network (172.16.x.x - 172.31.x.x)
      if (hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
        return false;
      }
    }

    // Block IPv6 localhost and unspecified
    if (
      hostname === '[::1]' ||
      hostname === '[::]' ||
      hostname === '::1' ||
      hostname === '::'
    ) {
      return false;
    }

    // If it passed all checks, it's considered safe for fetch
    return true;
  } catch {
    // If URL parsing fails, consider it unsafe
    return false;
  }
}
