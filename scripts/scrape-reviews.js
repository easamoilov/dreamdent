// Достаёт реальные отзывы из виджета Яндекс.Карт (org 72252033652).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36');
  await p.goto('https://yandex.ru/maps-reviews-widget/72252033652?comments', { waitUntil: 'networkidle2', timeout: 60000 }).catch(e => console.log('nav', e.message));
  await new Promise(r => setTimeout(r, 3000));
  const data = await p.evaluate(() => {
    function pick(sel) { return [...document.querySelectorAll(sel)].map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean); }
    // пробуем известные классы виджета, плюс эвристику
    const out = { rating: null, count: null, reviews: [] };
    const ratingEl = document.querySelector('[class*="rating"] [class*="value"], [class*="ratingValue"], [class*="rating__val"]');
    if (ratingEl) out.rating = ratingEl.textContent.trim();
    const cards = document.querySelectorAll('[class*="review"]');
    const seen = new Set();
    cards.forEach(c => {
      const txtEl = c.querySelector('[class*="text"], [class*="body"]');
      const authEl = c.querySelector('[class*="author"], [class*="name"]');
      const t = txtEl ? txtEl.textContent.replace(/\s+/g, ' ').trim() : '';
      const a = authEl ? authEl.textContent.replace(/\s+/g, ' ').trim() : '';
      const stars = (c.querySelectorAll('[class*="_full"], [class*="star_full"], [class*="filled"]') || []).length;
      if (t && t.length > 15 && !seen.has(t)) { seen.add(t); out.reviews.push({ author: a, stars: stars, text: t }); }
    });
    out.bodyClasses = [...new Set([...document.querySelectorAll('*')].map(e => e.className).filter(c => typeof c === 'string' && /review|author|rating/i.test(c)))].slice(0, 25);
    return out;
  });
  fs.writeFileSync('.shots/reviews-raw.json', JSON.stringify(data, null, 1));
  console.log('rating:', data.rating, '| reviews found:', data.reviews.length);
  console.log('sample classes:', JSON.stringify(data.bodyClasses));
  data.reviews.slice(0, 8).forEach((r, i) => console.log((i + 1) + '. [' + r.stars + '★] ' + r.author + ': ' + r.text.slice(0, 90)));
  await b.close();
})();
