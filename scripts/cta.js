const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  for (const rel of process.argv.slice(2)) {
    const p = await b.newPage();
    await p.goto('file:///' + path.resolve(rel).replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    const r = await p.evaluate(() => {
      const out = {};
      const cta = document.querySelector('.navbar__cta');
      out.headerCTA = cta ? cta.getAttribute('href') + ' target=' + cta.getAttribute('target') : null;
      out.bookLinks = [...document.querySelectorAll('a')]
        .filter(a => /Записаться/i.test(a.textContent))
        .map(a => a.getAttribute('href'))
        .filter((v, i, arr) => arr.indexOf(v) === i);
      return out;
    });
    console.log(rel, JSON.stringify(r));
    await p.close();
  }
  await b.close();
})();
