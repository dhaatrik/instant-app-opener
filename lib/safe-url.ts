const ALLOWED_PROTOCOLS = [
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
];

export function isSafeUrl(url: string): boolean {
  if (!url) return false;

  // Pre-filter: check for any control characters or null bytes that might be used for bypasses
  // This is a broad check for any character below space (32)
  for (let i = 0; i < url.length; i++) {
    if (url.charCodeAt(i) < 32) {
      return false;
    }
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
      return ALLOWED_PROTOCOLS.includes(parsed.protocol.toLowerCase());
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
