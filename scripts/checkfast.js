const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  for (const rel of process.argv.slice(2)) {
    const p = await b.newPage();
    await p.setViewport({ width: 1280, height: 900 });
    const url = /^https?:/.test(rel) ? rel : 'file:///' + path.resolve(rel).replace(/\\/g, '/');
    await p.goto(url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 900));
    const r = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      reviewsWidget: document.querySelectorAll('.reviews-widget iframe').length,
      reviewCards: document.querySelectorAll('.review-card').length,
      firstAuthor: (document.querySelector('.review-card__author') || {}).textContent || '',
      header: !!document.querySelector('.header'),
      services: document.querySelectorAll('.service-card').length
    }));
    console.log(rel.padEnd(22), JSON.stringify(r));
    await p.close();
  }
  await b.close();
})();
