async function test() {
  const url = 'https://www.nykaa.com/minimalist-b12-oat-extract-6-5-gentle-cleanser/p/13247854';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    const ogMatch = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i);
    console.log('og:image:', ogMatch ? ogMatch[1] : 'not found');
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
test();
