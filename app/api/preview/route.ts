import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { isSafeUrlForFetch } from '@/lib/security';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!isSafeUrlForFetch(url)) {
    return NextResponse.json({ error: 'Invalid or unsafe URL' }, { status: 400 });
  }

  try {
    // For YouTube and X, we can try oEmbed first or just fetch
    // Note: Some platforms block automated requests, so this is a best-effort approach.
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const metaProperties: Record<string, string> = {};
    const metaNames: Record<string, string> = {};

    $('meta').each((_, el) => {
      const $el = $(el);
      const content = $el.attr('content');
      if (!content) return;

      const property = $el.attr('property');
      const name = $el.attr('name');

      if (property && !metaProperties[property]) metaProperties[property] = content;
      if (name && !metaNames[name]) metaNames[name] = content;
    });

    const getMetaTag = (name: string) => 
      metaProperties[name] ||
      metaNames[name] ||
      metaProperties[`twitter:${name}`] ||
      metaNames[`twitter:${name}`];

    const title = getMetaTag('og:title') || getMetaTag('title') || $('title').text();
    const description = getMetaTag('og:description') || getMetaTag('description');
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
