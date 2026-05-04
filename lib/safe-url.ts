export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, 'http://fallback.com');
    const protocol = parsed.protocol.toLowerCase();
    return !['javascript:', 'vbscript:', 'data:'].includes(protocol);
  } catch (e) {
    const lowerUrl = String(url).toLowerCase().trim();
    if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('vbscript:') || lowerUrl.startsWith('data:')) {
      return false;
    }
    return true;
  }
}

export function getSafeUrl(url: string, fallbackUrl: string = '/'): string {
  return isSafeUrl(url) ? url : fallbackUrl;
}
