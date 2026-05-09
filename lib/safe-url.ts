// ⚡ Bolt: Convert ALLOWED_PROTOCOLS from Array to Set to optimize lookup performance
// Set.has() provides O(1) time complexity compared to Array.includes() O(n)
const ALLOWED_PROTOCOLS = new Set([
  'http:',
  'https:',
  'vnd.youtube:',
  'twitter:',
  'linkedin:',
  'instagram:',
  'fb:',
  'snssdk1233:',
  'spotify:',
  'intent:',
]);

// ⚡ Bolt: Precompiled Regex for control character filtering is faster than a JS loop
const CONTROL_CHAR_RE = /[\x00-\x1F\x7F]/;

export function isSafeUrl(url: string): boolean {
  if (!url) return false;

  // Security: Prevent DoS/ReDoS via resource exhaustion by enforcing length limit
  if (url.length > 2048) return false;

  // Pre-filter: check for any control characters or null bytes that might be used for bypasses
  // This is a broad check for any character below space (32) and the DEL character (127)
  if (CONTROL_CHAR_RE.test(url)) {
    return false;
  }

  const trimmed = url.trim();

  try {
    // For relative URLs, we check if they look like they have a protocol
    // A relative URL should not have a colon before the first forward slash
    const firstColon = trimmed.indexOf(':');
    const firstSlash = trimmed.indexOf('/');

    if (firstColon !== -1 && (firstSlash === -1 || firstColon < firstSlash)) {
      // It has something that looks like a protocol
      const parsed = new URL(trimmed, 'http://fallback.com');
      return ALLOWED_PROTOCOLS.has(parsed.protocol.toLowerCase());
    }

    // It's a relative URL or path
    return true;
  } catch (e) {
    return false;
  }
}

export function getSafeUrl(url: string, fallbackUrl: string = '/'): string {
  return isSafeUrl(url) ? url : fallbackUrl;
}
