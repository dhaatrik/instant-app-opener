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
  const html = await res.text();
  console.log(`HTML size: ${(html.length / 1024).toFixed(2)} KB`);

  console.time('cheerio full parse');
  const $1 = cheerio.load(html);
  $1('meta').each(() => {});
  console.timeEnd('cheerio full parse');

  console.time('cheerio slice parse');
  const headMatch = html.match(/<\/head>/i);
  const headEndIndex = headMatch ? headMatch.index : -1;
  const htmlToParse = headEndIndex !== -1 ? html.slice(0, headEndIndex + 7) : html;
  const $2 = cheerio.load(htmlToParse);
  $2('meta').each(() => {});
  console.timeEnd('cheerio slice parse');
}

testPerf().catch(console.error);
