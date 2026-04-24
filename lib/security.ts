/**
 * Validates if a URL is safe to fetch, preventing SSRF attacks.
 * It checks the protocol and ensures the hostname doesn't resolve to a private/internal IP.
 */
export function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // Only allow http and https protocols
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // The URL constructor already normalizes hostnames (e.g., 127.1 -> 127.0.0.1)
    const hostname = url.hostname.toLowerCase();

    // Block localhost and common local hostnames
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '::'
    ) {
      return false;
    }

    // Check if the hostname is an IP address
    // IPv4 private ranges:
    // 10.0.0.0/8
    // 172.16.0.0/12
    // 192.168.0.0/16
    // 127.0.0.0/8 (Loopback)
    // 169.254.0.0/16 (Link-local)

    // Using a regex to quickly check if it looks like an IPv4 (normalized by URL constructor)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(hostname)) {
      const octets = hostname.split('.').map(Number);

      // Validate octets are 0-255
      if (octets.some(o => o < 0 || o > 255)) return false;

      // 10.0.0.0/8
      if (octets[0] === 10) return false;

      // 127.0.0.0/8
      if (octets[0] === 127) return false;

      // 172.16.0.0/12
      if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return false;

      // 192.168.0.0/16
      if (octets[0] === 192 && octets[1] === 168) return false;

      // 169.254.0.0/16
      if (octets[0] === 169 && octets[1] === 254) return false;
    }

    // Simple IPv6 block (SSRF often uses IPv6)
    // If it contains a colon, it's an IPv6 address or an invalid hostname.
    // The URL constructor puts square brackets around IPv6 addresses in hostname.
    if (hostname.includes(':') || hostname.startsWith('[') || hostname.endsWith(']')) {
      // Block all IPv6 for security in this context
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}
