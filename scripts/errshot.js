const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  await p.setRequestInterception(true);
  p.on('request', r => {
    const u = r.url();
    if (u.includes('dental-data.json') || u.endsWith('/js/data.js')) return r.abort();
    r.continue();
  });
  await p.goto('http://localhost:8090/spa/lechenie.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));
  await p.screenshot({ path: '.shots/spa-lechenie-error.png', fullPage: false });
  await b.close();
})();
