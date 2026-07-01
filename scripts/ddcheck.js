const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  for (const rel of process.argv.slice(2)) {
    const p = await b.newPage();
    const url = /^https?:/.test(rel) ? rel : 'file:///' + path.resolve(rel).replace(/\\/g, '/');
    await p.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
    const r = await p.evaluate(() => ({
      services: document.querySelectorAll('.service-card').length,
      priceRows: document.querySelectorAll('.price-list tbody tr').length,
      groups: document.querySelectorAll('.price-group').length,
      ddLeft: document.querySelectorAll('[data-dd]').length && [...document.querySelectorAll('[data-dd]')].some(e=>!e.innerHTML.trim()),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    console.log(rel.padEnd(24), JSON.stringify(r));
    await p.close();
  }
  await b.close();
})();
