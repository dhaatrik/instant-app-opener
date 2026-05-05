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
        { url: 'https://youtube.com/embed/dQw4w9WgXcQ', id: 'dQw4w9WgXcQ' },
        { url: 'https://m.youtube.com/watch?v=dQw4w9WgXcQ', id: 'dQw4w9WgXcQ' },
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
        { url: 'https://mobile.twitter.com/user/status/1234567890', id: '1234567890' },
      ];

      urls.forEach(({ url, id }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('x');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(`twitter://status?id=${id}`);
      });
      
      // t.co shortlink
      const tcoResult = parseUrl('https://t.co/abc123xyz');
      expect(tcoResult.platform).toBe('x');
      expect(tcoResult.id).toBe('abc123xyz');
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
      
      // lnkd.in shortlink
      const lnkdResult = parseUrl('https://lnkd.in/eXYZ123');
      expect(lnkdResult.platform).toBe('linkedin');
      expect(lnkdResult.id).toBe('eXYZ123');
    });

    it('should parse valid Instagram URLs', () => {
      const urls = [
        { url: 'https://instagram.com/p/C1234567890', id: 'C1234567890', deepLink: 'instagram://media?id=C1234567890' },
        { url: 'https://instagram.com/reel/C1234567890', id: 'C1234567890', deepLink: 'instagram://media?id=C1234567890' },
        { url: 'https://instagram.com/stories/username/1234567890', id: '1234567890', deepLink: 'instagram://media?id=1234567890' },
        { url: 'https://instagram.com/username', id: 'username', deepLink: 'instagram://user?username=username' },
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
        { url: 'https://m.facebook.com/username', id: 'username', deepLink: 'fb://profile/username' },
      ];

      urls.forEach(({ url, id, deepLink }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('facebook');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(deepLink);
      });
    });

    it('should parse valid TikTok URLs', () => {
      const urls = [
        { url: 'https://www.tiktok.com/@user/video/1234567890', id: '1234567890', deepLink: 'snssdk1233://aweme/detail/1234567890' },
        { url: 'https://vm.tiktok.com/ZMxxxxxx/', id: 'ZMxxxxxx', deepLink: 'snssdk1233://aweme/detail/ZMxxxxxx' },
        { url: 'https://vt.tiktok.com/ZMxxxxxx/', id: 'ZMxxxxxx', deepLink: 'snssdk1233://aweme/detail/ZMxxxxxx' },
        { url: 'https://www.tiktok.com/@username', id: '@username', deepLink: 'snssdk1233://user/profile/username' },
        { url: 'https://m.tiktok.com/v/1234567890.html', id: '1234567890', deepLink: 'snssdk1233://aweme/detail/1234567890' },
      ];

      urls.forEach(({ url, id, deepLink }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('tiktok');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(deepLink);
      });
    });

    it('should parse valid Spotify URLs', () => {
      const urls = [
        { url: 'https://open.spotify.com/track/1234567890', id: '1234567890', deepLink: 'spotify:track:1234567890' },
        { url: 'https://open.spotify.com/album/1234567890', id: '1234567890', deepLink: 'spotify:album:1234567890' },
        { url: 'https://open.spotify.com/artist/1234567890', id: '1234567890', deepLink: 'spotify:artist:1234567890' },
        { url: 'https://open.spotify.com/playlist/1234567890', id: '1234567890', deepLink: 'spotify:playlist:1234567890' },
        { url: 'https://open.spotify.com/episode/1234567890', id: '1234567890', deepLink: 'spotify:episode:1234567890' },
      ];

      urls.forEach(({ url, id, deepLink }) => {
        const result = parseUrl(url);
        expect(result.platform).toBe('spotify');
        expect(result.id).toBe(id);
        expect(result.deepLink).toBe(deepLink);
      });
      
      // spotify.link shortlink
      const spotifyResult = parseUrl('https://spotify.link/abc123xyz');
      expect(spotifyResult.platform).toBe('spotify');
      expect(spotifyResult.id).toBe('abc123xyz');
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
    it('should return null if the platform in the payload does not match the original URL platform', () => {
      const originalData = { p: 'youtube', i: 'dQw4w9WgXcQ', u: 'https://youtube.com/watch?v=dQw4w9WgXcQ', d: 'vnd.youtube://dQw4w9WgXcQ' };
      const tamperedData = { ...originalData, p: 'x' };
      const encodedTampered = btoa(encodeURIComponent(JSON.stringify(tamperedData))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      expect(decodeDeepLinkId(encodedTampered)).toBeNull();
    });

    it('should return null if the original URL cannot be identified (unknown platform)', () => {
      const data = { p: 'youtube', i: 'invalid', u: 'https://example.com/not-youtube', d: 'vnd.youtube://invalid' };
      const encoded = btoa(encodeURIComponent(JSON.stringify(data))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      expect(decodeDeepLinkId(encoded)).toBeNull();
    });

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

  describe('tampered payload validation', () => {
    it('should return null if the platform in the payload does not match the original URL platform', () => {
      // Original valid data for a youtube video
      const originalData = {
        p: 'youtube', // valid platform
        i: 'dQw4w9WgXcQ',
        u: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        d: 'vnd.youtube://dQw4w9WgXcQ'
      };

      // Tamper with the platform
      const tamperedData = { ...originalData, p: 'x' };
      const encodedTampered = btoa(encodeURIComponent(JSON.stringify(tamperedData))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      expect(decodeDeepLinkId(encodedTampered)).toBeNull();
    });

    it('should return null if the original URL cannot be identified (unknown platform)', () => {
      // Payload for an invalid URL
      const data = {
        p: 'youtube', // Try to claim it's youtube
        i: 'invalid',
        u: 'https://example.com/not-youtube', // This will parse as 'unknown'
        d: 'vnd.youtube://invalid'
      };

      const encoded = btoa(encodeURIComponent(JSON.stringify(data))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      expect(decodeDeepLinkId(encoded)).toBeNull();
    });
  });
