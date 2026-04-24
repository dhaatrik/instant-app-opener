export type Platform = 'youtube' | 'x' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'spotify' | 'unknown';

export const APP_STORE_LINKS: Record<Platform, { ios: string, android: string } | null> = {
  youtube: {
    ios: 'https://apps.apple.com/app/youtube/id544007664',
    android: 'https://play.google.com/store/apps/details?id=com.google.android.youtube'
  },
  x: {
    ios: 'https://apps.apple.com/app/x/id333903271',
    android: 'https://play.google.com/store/apps/details?id=com.twitter.android'
  },
  linkedin: {
    ios: 'https://apps.apple.com/app/linkedin/id288429040',
    android: 'https://play.google.com/store/apps/details?id=com.linkedin.android'
  },
  instagram: {
    ios: 'https://apps.apple.com/app/instagram/id389801252',
    android: 'https://play.google.com/store/apps/details?id=com.instagram.android'
  },
  facebook: {
    ios: 'https://apps.apple.com/app/facebook/id284882215',
    android: 'https://play.google.com/store/apps/details?id=com.facebook.katana'
  },
  tiktok: {
    ios: 'https://apps.apple.com/app/tiktok/id835599320',
    android: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically'
  },
  spotify: {
    ios: 'https://apps.apple.com/app/spotify-music-and-podcasts/id324684580',
    android: 'https://play.google.com/store/apps/details?id=com.spotify.music'
  },
  unknown: null
};

export interface ParsedUrl {
  platform: Platform;
  id: string;
  originalUrl: string;
  deepLink: string;
  fallbackUrl: string;
  color: string;
  glowClass: string;
}

export function parseUrl(url: string): ParsedUrl {
  try {
    let urlToParse = url.trim();
    if (!urlToParse.startsWith('http://') && !urlToParse.startsWith('https://')) {
      urlToParse = 'https://' + urlToParse;
    }
    const parsed = new URL(urlToParse);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let id = '';
      if (hostname.includes('youtu.be')) {
        id = pathname.slice(1).split('?')[0];
      } else if (pathname.includes('/shorts/')) {
        id = pathname.split('/shorts/')[1].split('/')[0].split('?')[0];
      } else if (pathname.includes('/live/')) {
        id = pathname.split('/live/')[1].split('/')[0].split('?')[0];
      } else if (pathname.includes('/watch')) {
        id = parsed.searchParams.get('v') || '';
      } else if (pathname.includes('/v/')) {
        id = pathname.split('/v/')[1].split('/')[0].split('?')[0];
      } else if (pathname.includes('/embed/')) {
        id = pathname.split('/embed/')[1].split('/')[0].split('?')[0];
      }
      
      if (id) {
        return {
          platform: 'youtube',
          id,
          originalUrl: url,
          deepLink: `vnd.youtube://${id}`,
          fallbackUrl: url,
          color: '#FF0000',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(255,0,0,0.3)] border-red-500/30',
        };
      }
    }

    // X / Twitter
    if (hostname.includes('twitter.com') || hostname.includes('x.com') || hostname.includes('t.co')) {
      const match = pathname.match(/\/(?:#!\/)?[\w]+\/status(?:es)?\/(\d+)/);
      if (match) {
        return {
          platform: 'x',
          id: match[1],
          originalUrl: url,
          deepLink: `twitter://status?id=${match[1]}`,
          fallbackUrl: url,
          color: '#FFFFFF',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] border-white/30',
        };
      } else if (hostname.includes('t.co')) {
        // For t.co shortlinks, we can't extract the ID without expanding, 
        // but we can try to open the shortlink in the app
        const shortId = pathname.slice(1);
        if (shortId) {
           return {
             platform: 'x',
             id: shortId,
             originalUrl: url,
             deepLink: url, // Just pass the t.co link, the app handles it
             fallbackUrl: url,
             color: '#FFFFFF',
             glowClass: 'shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] border-white/30',
           };
        }
      }
    }

    // LinkedIn
    if (hostname.includes('linkedin.com') || hostname.includes('lnkd.in')) {
      if (hostname.includes('lnkd.in')) {
        const shortId = pathname.slice(1);
        if (shortId) {
          return {
            platform: 'linkedin',
            id: shortId,
            originalUrl: url,
            deepLink: url,
            fallbackUrl: url,
            color: '#0A66C2',
            glowClass: 'shadow-[0_0_30px_-5px_rgba(10,102,194,0.3)] border-blue-600/30',
          };
        }
      }
      // Profiles, Companies, Schools
      const profileMatch = pathname.match(/\/(?:in|company|school)\/([^/?]+)/);
      if (profileMatch) {
        return {
          platform: 'linkedin',
          id: profileMatch[1],
          originalUrl: url,
          deepLink: `linkedin://profile/${profileMatch[1]}`,
          fallbackUrl: url,
          color: '#0A66C2',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(10,102,194,0.3)] border-blue-600/30',
        };
      }
      // Posts / Feed
      const postMatch = pathname.match(/\/(?:posts|feed\/update)\/([^/?]+)/);
      if (postMatch) {
        const id = postMatch[1].includes('urn:li:activity:') ? postMatch[1].split('urn:li:activity:')[1] : postMatch[1];
        return {
          platform: 'linkedin',
          id,
          originalUrl: url,
          deepLink: `linkedin://posts/${id}`, // Fallback to posts if profile doesn't fit
          fallbackUrl: url,
          color: '#0A66C2',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(10,102,194,0.3)] border-blue-600/30',
        };
      }
    }

    // Instagram
    if (hostname.includes('instagram.com') || hostname.includes('instagr.am')) {
      // Posts, Reels, TV
      const mediaMatch = pathname.match(/\/(?:p|reel|tv)\/([^/?]+)/);
      if (mediaMatch) {
        return {
          platform: 'instagram',
          id: mediaMatch[1],
          originalUrl: url,
          deepLink: `instagram://media?id=${mediaMatch[1]}`,
          fallbackUrl: url,
          color: '#E1306C',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(225,48,108,0.3)] border-fuchsia-500/30',
        };
      }
      // Stories
      const storyMatch = pathname.match(/\/stories\/[^/]+\/(\d+)/);
      if (storyMatch) {
        return {
          platform: 'instagram',
          id: storyMatch[1],
          originalUrl: url,
          deepLink: `instagram://media?id=${storyMatch[1]}`,
          fallbackUrl: url,
          color: '#E1306C',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(225,48,108,0.3)] border-fuchsia-500/30',
        };
      }
      // Profile
      const profileMatch = pathname.match(/\/([^/?]+)/);
      if (profileMatch && !['explore', 'reels', 'direct'].includes(profileMatch[1])) {
        return {
          platform: 'instagram',
          id: profileMatch[1],
          originalUrl: url,
          deepLink: `instagram://user?username=${profileMatch[1]}`,
          fallbackUrl: url,
          color: '#E1306C',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(225,48,108,0.3)] border-fuchsia-500/30',
        };
      }
    }

    // Facebook
    if (hostname.includes('facebook.com') || hostname.includes('fb.com') || hostname.includes('fb.watch')) {
      let id = parsed.searchParams.get('id') || parsed.searchParams.get('story_fbid') || parsed.searchParams.get('v');
      
      if (!id) {
        if (hostname.includes('fb.watch')) {
          const watchMatch = pathname.match(/\/(?:v\/)?([^/?]+)/);
          if (watchMatch) {
            id = watchMatch[1];
          }
        } else {
          // Check for /posts/ID or /permalink/ID or /watch/ID
          const postMatch = pathname.match(/\/(?:posts|permalink|videos|watch)\/([^/?]+)/);
          if (postMatch) {
            id = postMatch[1];
          } else {
            // Profile username
            const match = pathname.match(/\/([^/?]+)/);
            if (match && !['watch', 'groups', 'events', 'profile.php', 'share.php', 'story.php', 'pages', 'v', 'reel'].includes(match[1])) {
              id = match[1];
            }
          }
        }
      }
      
      if (id) {
        return {
          platform: 'facebook',
          id,
          originalUrl: url,
          deepLink: `fb://profile/${id}`,
          fallbackUrl: url,
          color: '#1877F2',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(24,119,242,0.3)] border-blue-500/30',
        };
      }
    }

    // TikTok
    if (hostname.includes('tiktok.com') || hostname.includes('tiktok.t.me')) {
      let id = '';
      const videoMatch = pathname.match(/\/video\/(\d+)/);
      const mobileVideoMatch = pathname.match(/\/v\/(\d+)/);
      
      if (videoMatch) {
        id = videoMatch[1];
      } else if (mobileVideoMatch) {
        id = mobileVideoMatch[1];
      } else {
        // Handle short links like vm.tiktok.com/ZMxxxxxx/ or vt.tiktok.com
        const shortMatch = pathname.match(/\/([^/?]+)/);
        if (shortMatch && !shortMatch[1].startsWith('@')) {
          id = shortMatch[1];
        } else if (shortMatch && shortMatch[1].startsWith('@')) {
          // Profile link
          id = shortMatch[1];
          return {
            platform: 'tiktok',
            id,
            originalUrl: url,
            deepLink: `snssdk1233://user/profile/${id.replace('@', '')}`,
            fallbackUrl: url,
            color: '#00f2fe',
            glowClass: 'shadow-[0_0_30px_-5px_rgba(0,242,254,0.3)] border-cyan-400/30',
          };
        }
      }

      if (id) {
        return {
          platform: 'tiktok',
          id,
          originalUrl: url,
          deepLink: `snssdk1233://aweme/detail/${id}`, // TikTok deep link format
          fallbackUrl: url,
          color: '#00f2fe', // TikTok cyan-ish
          glowClass: 'shadow-[0_0_30px_-5px_rgba(0,242,254,0.3)] border-cyan-400/30',
        };
      }
    }

    // Spotify
    if (hostname.includes('spotify.com') || hostname.includes('spotify.link')) {
      if (hostname.includes('spotify.link')) {
        const shortId = pathname.slice(1);
        if (shortId) {
          return {
            platform: 'spotify',
            id: shortId,
            originalUrl: url,
            deepLink: url,
            fallbackUrl: url,
            color: '#1DB954',
            glowClass: 'shadow-[0_0_30px_-5px_rgba(29,185,84,0.3)] border-green-500/30',
          };
        }
      }
      const match = pathname.match(/\/(track|album|playlist|episode|show|user|artist)\/([^/?]+)/);
      if (match) {
        const type = match[1];
        const id = match[2];
        return {
          platform: 'spotify',
          id,
          originalUrl: url,
          deepLink: `spotify:${type}:${id}`,
          fallbackUrl: url,
          color: '#1DB954',
          glowClass: 'shadow-[0_0_30px_-5px_rgba(29,185,84,0.3)] border-green-500/30',
        };
      }
    }
  } catch (e) {
    // Invalid URL, fall through to unknown
  }

  return {
    platform: 'unknown',
    id: '',
    originalUrl: url,
    deepLink: '',
    fallbackUrl: url,
    color: 'transparent',
    glowClass: 'shadow-none border-white/10',
  };
}

export function encodeDeepLinkId(parsed: ParsedUrl): string {
  const data = JSON.stringify({ p: parsed.platform, i: parsed.id, u: parsed.originalUrl, d: parsed.deepLink });
  return btoa(encodeURIComponent(data)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export interface DecodedDeepLinkId {
  p: string;
  i: string;
  u: string;
  d: string;
}

export function decodeDeepLinkId(encoded: string): DecodedDeepLinkId | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    const decoded = JSON.parse(decodeURIComponent(atob(padded)));
    return {
      p: decoded.p,
      i: decoded.i,
      u: decoded.u,
      d: decoded.d || decoded.u // Fallback to original URL if deep link is missing
    };
  } catch (e) {
    return null;
  }
}
