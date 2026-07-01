const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const rel = process.argv[2];
  const url = 'file:///' + path.resolve(rel).replace(/\\/g, '/');
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'networkidle0' });
  const broken = await p.evaluate(() =>
    [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src));
  console.log(rel, 'broken:', JSON.stringify(broken));
  await b.close();
})();
