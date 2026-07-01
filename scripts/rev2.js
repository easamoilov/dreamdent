const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36');
  await p.goto('https://yandex.ru/maps-reviews-widget/72252033652?comments', { waitUntil: 'networkidle2', timeout: 60000 }).catch(()=>{});
  await new Promise(r => setTimeout(r, 2000));
  const info = await p.evaluate(() => ({
    rating: (document.querySelector('.mini-badge__rating, [class*="rating-info"]')||{}).textContent || '',
    moreHref: (document.querySelector('.badge__more-reviews-link, a[class*="more-reviews"]')||{}).href || '',
    bodyText: document.body.innerText.replace(/\s+/g,' ').slice(0, 300)
  }));
  console.log(JSON.stringify(info, null, 1));
  await b.close();
})();
