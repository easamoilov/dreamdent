const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const target = process.argv[2] || 'http://1dn.su/3hP';
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  const chain = [];
  p.on('framenavigated', f => { if (f === p.mainFrame()) chain.push(f.url()); });
  try {
    await p.goto(target, { waitUntil: 'networkidle2', timeout: 45000 });
  } catch (e) { console.log('goto note:', e.message); }
  await new Promise(r => setTimeout(r, 1500));
  console.log('FINAL URL:', p.url());
  console.log('TITLE:', await p.title());
  console.log('CHAIN:', JSON.stringify(chain, null, 1));
  await b.close();
})();
