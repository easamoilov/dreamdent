// Пакетная проверка всех страниц: переполнение по X + битые картинки.
// node scripts/verify.js spa/index.html alt/uslugi.html ...
const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const files = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  let problems = 0;
  for (const rel of files) {
    const url = 'file:///' + path.resolve(rel).replace(/\\/g, '/');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    // прокрутить до низа, чтобы подгрузить lazy-картинки
    await page.evaluate(async () => {
      await new Promise(res => {
        let y = 0; const h = document.body.scrollHeight;
        const t = setInterval(() => { y += 600; window.scrollTo(0, y); if (y >= h) { clearInterval(t); res(); } }, 30);
      });
    });
    await new Promise(r => setTimeout(r, 300));
    const res = await page.evaluate(() => {
      const d = document.documentElement;
      const broken = [...document.images]
        .filter(i => i.getAttribute('src') && (!i.complete || i.naturalWidth === 0))
        .map(i => i.currentSrc || i.src);
      const offenders = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.right > d.clientWidth + 1 && r.width > 0 && getComputedStyle(el).position !== 'absolute')
          offenders.push((el.className || el.tagName) + ' @' + Math.round(r.right));
      });
      return { overflow: d.scrollWidth - d.clientWidth, broken, offenders: offenders.slice(0, 6) };
    });
    const bad = res.overflow > 1 || res.broken.length || res.offenders.length;
    if (bad) problems++;
    console.log((bad ? 'XX ' : 'ok ') + rel + '  overflow=' + res.overflow +
      (res.broken.length ? '  BROKEN=' + JSON.stringify(res.broken) : '') +
      (res.offenders.length ? '  OFFENDERS=' + JSON.stringify(res.offenders) : ''));
    await page.close();
  }
  await browser.close();
  console.log('\n' + (problems ? problems + ' page(s) with issues' : 'all clean'));
})();
