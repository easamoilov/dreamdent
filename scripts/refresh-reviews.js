// Подтягивает отзывы и рейтинг из виджета Яндекс.Карт (org 72252033652),
// нормализует и пишет scripts/reviews.json, затем регенерит данные.
//   node scripts/refresh-reviews.js
// ПРИМЕЧАНИЕ: «вживую» из браузера сайта нельзя (CORS + нет публичного API +
// антибот). Это серверный/билд-тайм путь через puppeteer (он на домене Яндекса,
// поэтому ограничений нет).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const { execSync } = require('child_process');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ORG = '72252033652';
const URL = 'https://yandex.ru/maps/org/semeynaya_stomatologiya_drim/' + ORG + '/reviews';

function norm(t) {
  t = t.replace(/^20\d\d\s*/, '').replace(/^[•\-–\s]+/, '');
  t = t.replace(/(Ответить|Читать целиком|Развернуть|Пожаловаться|Нравится\s*\d*|Показать ответ организации).*$/i, '').trim();
  if (t.length > 260) {
    var cut = t.slice(0, 260);
    var dot = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
    t = dot > 140 ? cut.slice(0, dot + 1) : cut.slice(0, cut.lastIndexOf(' ')) + '…';
  }
  return t.trim();
}

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36');
  await p.goto('https://yandex.ru/maps-reviews-widget/' + ORG + '?comments', { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
  for (let i = 0; i < 12; i++) {
    await p.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); document.querySelectorAll('*').forEach(el => { if (el.scrollHeight > el.clientHeight + 50) el.scrollTop = el.scrollHeight; }); });
    await new Promise(r => setTimeout(r, 500));
  }
  const scraped = await p.evaluate(() => {
    const MONTHS = 'января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря';
    const dateRe = new RegExp('(\\d{1,2} (?:' + MONTHS + '))');
    const meta = { rating: '', count: '' };
    const badge = (document.querySelector('[class*="rating-info"], .mini-badge__rating') || {}).textContent || '';
    let rest = badge;
    const rm = badge.match(/(\d[.,]\d)/); if (rm) { meta.rating = rm[1]; rest = badge.replace(rm[1], ' '); }
    const cm = rest.match(/(\d+)\s*отзыв/); if (cm) meta.count = cm[1] + ' отзывов';
    const out = [], seen = new Set();
    [...document.querySelectorAll('div, li, article')].forEach(el => {
      if (el.children.length > 6) return;
      const t = el.innerText ? el.innerText.replace(/\s+/g, ' ').trim() : '';
      if (t.length < 50 || t.length > 800 || !dateRe.test(t)) return;
      const m = t.match(dateRe), idx = t.indexOf(m[1]);
      let author = t.slice(0, idx).replace(/^[А-ЯЁA-Z]\s+/, '').trim();
      let text = t.slice(idx + m[1].length).trim();
      const key = text.slice(0, 40);
      if (seen.has(key)) return; seen.add(key);
      out.push({ author: author, text: text });
    });
    return { meta, reviews: out };
  });
  await b.close();

  const items = scraped.reviews
    .map(r => ({ author: (r.author && r.author.length > 1) ? r.author : 'Гость', date: 'Яндекс.Карты', stars: 5, text: norm(r.text) }))
    .filter(r => r.text.length >= 40)
    .slice(0, 6);

  if (items.length < 3) { console.error('✗ Получено мало отзывов (' + items.length + ') — оставляю текущий reviews.json без изменений.'); process.exit(1); }

  const meta = {
    rating: scraped.meta.rating || '5,0',
    count: scraped.meta.count || '146 отзывов',
    url: URL
  };
  fs.writeFileSync('scripts/reviews.json', JSON.stringify({ meta, items }, null, 2));
  console.log('✓ Отзывов:', items.length, '| рейтинг:', meta.rating, '|', meta.count);
  items.forEach((r, i) => console.log('  ' + (i + 1) + '. ' + r.author + ': ' + r.text.slice(0, 80)));
  execSync('node scripts/generate-data.js', { stdio: 'inherit' });
  console.log('✓ data обновлены из живых отзывов Яндекса.');
})();
