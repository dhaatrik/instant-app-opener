import * as cheerio from 'cheerio';

async function testPerf() {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  console.log('Fetching...');
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  });

  console.time('fetch text');
  const html = await res.text();
  console.timeEnd('fetch text');

  console.time('cheerio slice parse');
  // Find </head> or take first 100KB as fallback
  const headMatch = html.match(/<\/head>/i);
  const headEndIndex = headMatch ? headMatch.index : -1;
  const htmlToParse = headEndIndex !== -1 ? html.slice(0, headEndIndex + 7) : html.slice(0, 100000);
  const $2 = cheerio.load(htmlToParse);
  $2('meta').each(() => {});
  console.timeEnd('cheerio slice parse');

  console.time('regex parse');
  const metaProperties: Record<string, string> = {};
  const metaNames: Record<string, string> = {};

  const headMatch2 = html.match(/<\/head>/i);
  const headHtml = headMatch2 && headMatch2.index ? html.slice(0, headMatch2.index + 7) : html.slice(0, 100000);

  const titleMatch = headHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : null;

  const metaTagRegex = /<meta\s+(?:[^>]*?\s+)?(?:name|property)="([^"]*)"\s+(?:[^>]*?\s+)?content="([^"]*)"[^>]*>|<meta\s+(?:[^>]*?\s+)?content="([^"]*)"\s+(?:[^>]*?\s+)?(?:name|property)="([^"]*)"[^>]*>/gi;
  let match;

  while ((match = metaTagRegex.exec(headHtml)) !== null) {
      if (match[1] && match[2]) {
          const key = match[1];
          const value = match[2];
          if (key.includes(':')) metaProperties[key] = value;
          else metaNames[key] = value;
      } else if (match[3] && match[4]) {
          const key = match[4];
          const value = match[3];
          if (key.includes(':')) metaProperties[key] = value;
          else metaNames[key] = value;
      }
  }
  console.timeEnd('regex parse');
}

testPerf().catch(console.error);
