const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setRequestInterception(true);
  p.on('request', r => {
    const u = r.url();
    if (u.includes('dental-data.json') || u.endsWith('/js/data.js')) return r.abort();
    r.continue();
  });
  await p.goto('http://localhost:8090/spa/lechenie.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  const res = await p.evaluate(() => ({
    error: document.querySelectorAll('.dd-state--error').length,
    retry: document.querySelectorAll('.dd-retry').length,
    text: (document.querySelector('.dd-state--error p') || {}).textContent || ''
  }));
  console.log('ERROR STATE:', JSON.stringify(res));
  await b.close();
})();
