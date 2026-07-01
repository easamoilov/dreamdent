const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36');
  await p.goto('https://yandex.ru/maps-reviews-widget/72252033652?comments', { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
  // подгрузить больше отзывов прокруткой (и окна, и внутренних скролл-контейнеров)
  for (let i = 0; i < 12; i++) {
    await p.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
      document.querySelectorAll('*').forEach(el => { if (el.scrollHeight > el.clientHeight + 50) el.scrollTop = el.scrollHeight; });
    });
    await new Promise(r => setTimeout(r, 600));
  }
  const reviews = await p.evaluate(() => {
    const MONTHS = 'января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря';
    const dateRe = new RegExp('(\\d{1,2} (?:' + MONTHS + '))');
    const all = [...document.querySelectorAll('div, li, article, section')];
    const cand = [];
    all.forEach(el => {
      if (el.children.length > 6) return; // не контейнер целиком
      const t = el.innerText ? el.innerText.replace(/\s+/g, ' ').trim() : '';
      if (t.length < 50 || t.length > 700) return;
      if (!dateRe.test(t)) return;
      cand.push(t);
    });
    // дедуп и парсинг
    const seen = new Set(), out = [];
    cand.forEach(t => {
      const m = t.match(dateRe);
      if (!m) return;
      const idx = t.indexOf(m[1]);
      let author = t.slice(0, idx).replace(/^[А-ЯЁA-Z]\s+/, '').trim(); // убрать инициал-аватар
      let text = t.slice(idx + m[1].length).trim();
      text = text.replace(/^20\d\d\s*/, '').replace(/^[•\-–\s]+/, '');
      // отрезать хвосты интерфейса
      text = text.replace(/(Ответить|Читать целиком|Развернуть|Пожаловаться|Нравится\s*\d*).*$/i, '').trim();
      if (text.length < 40) return;
      const key = text.slice(0, 40);
      if (seen.has(key)) return; seen.add(key);
      out.push({ author: author || 'Гость', date: m[1], text: text });
    });
    return out;
  });
  fs.writeFileSync('.shots/reviews-raw.json', JSON.stringify(reviews, null, 1));
  console.log('reviews:', reviews.length);
  reviews.slice(0, 12).forEach((r, i) => console.log((i + 1) + '. ' + r.author + ' (' + r.date + '): ' + r.text.slice(0, 110)));
  await b.close();
})();
