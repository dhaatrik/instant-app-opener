import * as cheerio from 'cheerio';

async function testPerf() {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  console.log('Fetching...');

  console.time('fetch stream');
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  });

  if (!res.body) throw new Error('No body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let html = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    html += decoder.decode(value, { stream: true });

    if (html.toLowerCase().includes('</head>') || html.length > 150000) {
      reader.cancel();
      break;
    }
  }

  html += decoder.decode();
  console.timeEnd('fetch stream');
  console.log(`Stream HTML size: ${(html.length / 1024).toFixed(2)} KB`);

  console.time('cheerio parse');
  const $ = cheerio.load(html);
  $('meta').each(() => {});
  console.timeEnd('cheerio parse');
}

testPerf().catch(console.error);
