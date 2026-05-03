// ⚡ Bolt: Hoist static array to module-level Set for O(1) lookups
const UNSAFE_PROTOCOLS = new Set(['javascript:', 'vbscript:', 'data:']);

export function isSafeUrl(url: string): boolean {
  const urlStr = String(url);
  // Block control characters (ASCII < 32 and 127) to prevent bypasses
  if (/[\x00-\x1F\x7F]/.test(urlStr)) {
    return false;
  }

  try {
    const parsed = new URL(urlStr, 'http://fallback.com');
    const protocol = parsed.protocol.toLowerCase();
    return !UNSAFE_PROTOCOLS.has(protocol);
  } catch (e) {
    const lowerUrl = urlStr.toLowerCase().trim();
    if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('vbscript:') || lowerUrl.startsWith('data:')) {
      return false;
    }
    return true;
  }
}

export function getSafeUrl(url: string, fallbackUrl: string = '/'): string {
  return isSafeUrl(url) ? url : fallbackUrl;
}
