async function testPerf() {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    }
  });
  const html = await res.text();

  console.time('regex match');
  for (let i = 0; i < 100; i++) {
    const headMatch = html.match(/<\/head>/i);
    const headEndIndex = headMatch ? headMatch.index : -1;
  }
  console.timeEnd('regex match');

  console.time('indexOf');
  for (let i = 0; i < 100; i++) {
    let headEndIndex = html.indexOf('</head>');
    if (headEndIndex === -1) {
        headEndIndex = html.indexOf('</HEAD>');
    }
  }
  console.timeEnd('indexOf');
}

testPerf().catch(console.error);
