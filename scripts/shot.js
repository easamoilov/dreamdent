// Скриншот-хелпер для визуальной проверки. Запуск:
//   node scripts/shot.js <relPath.html> <out.png> [width=1280] [full=1]
const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const rel = process.argv[2];
  const out = process.argv[3] || 'shot.png';
  const width = parseInt(process.argv[4] || '1280', 10);
  const full = (process.argv[5] || '1') === '1';
  const fileUrl = 'file:///' + path.resolve(rel).replace(/\\/g, '/');

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    await new Promise(res => {
      let y = 0; const h = document.body.scrollHeight;
      const t = setInterval(() => { y += 600; window.scrollTo(0, y); if (y >= h) { clearInterval(t); res(); } }, 25);
    });
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 500));

  // замер горизонтального переполнения
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    const cw = d.clientWidth;
    const offenders = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > cw + 1 && r.width > 0) offenders.push(el.className + ' (' + Math.round(r.right) + ')');
    });
    return { scrollWidth: d.scrollWidth, clientWidth: cw, offenders: offenders.slice(0, 8) };
  });
  console.log(rel, JSON.stringify(overflow));

  await page.screenshot({ path: out, fullPage: full });
  await browser.close();
})();
