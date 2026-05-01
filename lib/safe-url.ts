export function isSafeUrl(url: string): boolean {
  if (/[\x00-\x1F\x7F]/.test(String(url))) {
    return false;
  }

  try {
    const parsed = new URL(url, 'http://fallback.com');
    const protocol = parsed.protocol.toLowerCase();

    const allowedProtocols = [
      'http:', 'https:', 'mailto:', 'tel:',
      'vnd.youtube:', 'twitter:', 'linkedin:', 'instagram:', 'fb:', 'snssdk1233:', 'spotify:', 'intent:'
    ];

    return allowedProtocols.includes(protocol);
  } catch (e) {
    return false;
  }
}

export function getSafeUrl(url: string, fallbackUrl: string = '/'): string {
  return isSafeUrl(url) ? url : fallbackUrl;
}
