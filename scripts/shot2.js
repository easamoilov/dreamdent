const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const [rel, out, wait] = [process.argv[2], process.argv[3], parseInt(process.argv[4]||'4000',10)];
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  await p.goto('file:///' + path.resolve(rel).replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await p.evaluate(async () => { await new Promise(r => { let y=0,h=document.body.scrollHeight; const t=setInterval(()=>{y+=600;scrollTo(0,y);if(y>=h){clearInterval(t);r();}},25);}); scrollTo(0,0); });
  await new Promise(r => setTimeout(r, wait));
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
