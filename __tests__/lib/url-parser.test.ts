import { describe, it, expect } from 'vitest';
import { parseUrl, encodeDeepLinkId, decodeDeepLinkId } from '@/lib/url-parser';

describe('url-parser', () => {
  describe('parseUrl', () => {
    it('should parse valid YouTube URLs', () => {
      const urls = [
        { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', id: 'dQw4w9WgXcQ' },
        { url: 'https://youtu.be/dQw4w9WgXcQ', id: 'dQw4w9WgXcQ' },
        { url: 'https://youtube.com/shorts/dQw4w9WgXcQ', id: 'dQw4w9WgXcQ' },
        { url: 'https://youtube.com/live/dQw4w9WgXcQ', id: 'dQw4w9WgXcQ' },
        { url: 'https://youtube.com/v/dQw4w9WgXcQ', id: 'dQw4w9WgXcQ' },
      ];

      urls.forEach(({ url, id }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('youtube');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(`vnd.youtube://${id}`);
      });
    });

    it('should parse valid X/Twitter URLs', () => {
      const urls = [
        { url: 'https://twitter.com/user/status/1234567890', id: '1234567890' },
        { url: 'https://x.com/user/status/1234567890', id: '1234567890' },
      ];

      urls.forEach(({ url, id }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('x');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(`twitter://status?id=${id}`);
      });
    });

    it('should parse valid LinkedIn URLs', () => {
      const urls = [
        { url: 'https://linkedin.com/in/username', id: 'username', deepLink: 'linkedin://profile/username' },
        { url: 'https://linkedin.com/company/companyname', id: 'companyname', deepLink: 'linkedin://profile/companyname' },
        { url: 'https://linkedin.com/posts/username_activity-12345', id: 'username_activity-12345', deepLink: 'linkedin://posts/username_activity-12345' },
        { url: 'https://linkedin.com/feed/update/urn:li:activity:12345', id: '12345', deepLink: 'linkedin://posts/12345' },
      ];

      urls.forEach(({ url, id, deepLink }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('linkedin');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(deepLink);
      });
    });

    it('should parse valid Instagram URLs', () => {
      const urls = [
        { url: 'https://instagram.com/p/C1234567890', id: 'C1234567890', deepLink: 'instagram://media?id=C1234567890' },
        { url: 'https://instagram.com/reel/C1234567890', id: 'C1234567890', deepLink: 'instagram://media?id=C1234567890' },
        { url: 'https://instagram.com/stories/username/1234567890', id: '1234567890', deepLink: 'instagram://media?id=1234567890' },
      ];

      urls.forEach(({ url, id, deepLink }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('instagram');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(deepLink);
      });
    });

    it('should parse valid Facebook URLs', () => {
      const urls = [
        { url: 'https://facebook.com/username', id: 'username', deepLink: 'fb://profile/username' },
        { url: 'https://facebook.com/watch/?v=1234567890', id: '1234567890', deepLink: 'fb://profile/1234567890' },
        { url: 'https://facebook.com/permalink/1234567890', id: '1234567890', deepLink: 'fb://profile/1234567890' },
      ];

      urls.forEach(({ url, id, deepLink }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('facebook');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(deepLink);
      });
    });

    it('should handle invalid URLs gracefully', () => {
      const invalidUrls = [
        'not-a-url',
        'https://example.com',
        'https://youtube.com/invalid',
      ];

      invalidUrls.forEach(url => {
        const result = parseUrl(url);
        expect(result.platform).toBe('unknown');
        expect(result.id).toBe('');
      });
    });
  });

  describe('encodeDeepLinkId and decodeDeepLinkId', () => {
    it('should be perfect opposites', () => {
      const original = {
        platform: 'youtube' as const,
        id: 'dQw4w9WgXcQ',
        originalUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        deepLink: 'vnd.youtube://dQw4w9WgXcQ',
        fallbackUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        color: '#FF0000',
        glowClass: 'shadow-[0_0_30px_-5px_rgba(255,0,0,0.3)] border-red-500/30',
      };

      const encoded = encodeDeepLinkId(original);
      const decoded = decodeDeepLinkId(encoded);

      expect(decoded).toEqual({
        p: original.platform,
        i: original.id,
        u: original.originalUrl,
        d: original.deepLink,
      });
    });

    it('should handle invalid encoded strings gracefully', () => {
      const decoded = decodeDeepLinkId('invalid-base64');
      expect(decoded).toBeNull();
    });
  });
});
