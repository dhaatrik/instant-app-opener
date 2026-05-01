import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { isSafeUrlForFetch } from '@/lib/security';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!(await isSafeUrlForFetch(url))) {
    return NextResponse.json({ error: 'Invalid or unsafe URL' }, { status: 400 });
  }

  try {
    // Note: To fully protect against DNS rebinding, we'd ideally use an undici Agent
    // that validates IPs on connect. However, Next.js fetch polyfill doesn't expose dispatcher.
    // The await isSafeUrlForFetch catches many static bypasses.

    // For YouTube and X, we can try oEmbed first or just fetch
    // Note: Some platforms block automated requests, so this is a best-effort approach.

    let currentUrl = url;
    let fetchResponse: Response;
    let redirectCount = 0;
    const MAX_REDIRECTS = 5;

    while (true) {
      if (redirectCount > MAX_REDIRECTS) {
        throw new Error('Too many redirects');
      }

      fetchResponse = await fetch(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        redirect: 'manual',
        // Timeout after 5 seconds
        signal: AbortSignal.timeout(5000)
      });

      if ([301, 302, 303, 307, 308].includes(fetchResponse.status)) {
        const location = fetchResponse.headers.get('location');
        if (!location) {
          throw new Error('Redirect with no location header');
        }

        // Resolve relative URLs
        currentUrl = new URL(location, currentUrl).toString();

        if (!(await isSafeUrlForFetch(currentUrl))) {
           return NextResponse.json({ error: 'Redirected to invalid or unsafe URL' }, { status: 400 });
        }

        redirectCount++;
        continue;
      }

      break;
    }

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch: ${fetchResponse.status}`);
    }

    // Performance Optimization: Stream the HTML and abort early
    // Instead of downloading and parsing the entire HTML document (which can be huge),
    // we only download up to the </head> tag or a reasonable limit, then parse it with RegExp.
    let html = '';

    if (fetchResponse.body) {
      const reader = fetchResponse.body.getReader();
      const decoder = new TextDecoder('utf-8');

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          html += decoder.decode(value, { stream: true });

          // Stop downloading if we've seen the end of the head or reached 150KB
          if (html.toLowerCase().includes('</head>') || html.length > 150000) {
            reader.cancel();
            break;
          }
        }
        html += decoder.decode(); // flush remaining
      } catch (err) {
        // Ignore abort errors from canceling the reader
      }
    } else {
      html = await fetchResponse.text();
    }

    const metaProperties: Record<string, string> = {};
    const metaNames: Record<string, string> = {};

    // Extract title from <title> tag
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const parsedTitle = titleMatch ? titleMatch[1] : null;

    // Extract meta tags using RegExp
    // This is significantly faster than parsing the DOM with cheerio
    const metaTagRegex = /<meta\s+([^>]+)>/gi;
    let match;

    while ((match = metaTagRegex.exec(html)) !== null) {
      const attrs = match[1];
      let nameOrProperty = '';
      let content = '';

      const nameMatch = attrs.match(/(?:name|property)\s*=\s*(['"])(.*?)\1/i);
      if (nameMatch) {
        nameOrProperty = nameMatch[2];
      }

      const contentMatch = attrs.match(/content\s*=\s*(['"])([\s\S]*?)\1/i);
      if (contentMatch) {
        content = contentMatch[2];
      }

      if (nameOrProperty && content) {
        if (nameOrProperty.includes(':') || attrs.toLowerCase().includes('property')) {
          metaProperties[nameOrProperty] = content;
        } else {
          metaNames[nameOrProperty] = content;
        }
      }
    }

    const getMetaTag = (name: string) => 
      metaProperties[name] ||
      metaNames[name] ||
      metaProperties[`twitter:${name}`] ||
      metaNames[`twitter:${name}`];

    // Decode HTML entities since we are using regex
    const decodeHtml = (text: string | null) => {
      if (!text) return text;
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
    };

    const title = decodeHtml(getMetaTag('og:title') || getMetaTag('title') || parsedTitle);
    const description = decodeHtml(getMetaTag('og:description') || getMetaTag('description'));
    const image = getMetaTag('og:image') || getMetaTag('image');

    return NextResponse.json({
      title: title?.trim() || null,
      description: description?.trim() || null,
      image: image?.trim() || null,
    });
  } catch (error) {
    console.error('Preview fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 });
  }
}
