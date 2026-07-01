const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const url = process.argv[2] || 'https://dreamdent.ru/price/';
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36');
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }).catch(e => console.log('nav:', e.message));
  await new Promise(r => setTimeout(r, 2500));
  const data = await p.evaluate(() => {
    const out = { title: document.title, h2: [], tables: [], priceLines: [] };
    document.querySelectorAll('h1,h2,h3').forEach(h => { const t = h.textContent.trim(); if (t) out.h2.push(t); });
    document.querySelectorAll('table').forEach(tb => {
      const rows = [];
      tb.querySelectorAll('tr').forEach(tr => {
        const cells = [...tr.querySelectorAll('th,td')].map(c => c.textContent.replace(/\s+/g, ' ').trim());
        if (cells.some(Boolean)) rows.push(cells);
      });
      if (rows.length) out.tables.push(rows);
    });
    // любые элементы, чей текст содержит цену
    const seen = new Set();
    document.querySelectorAll('li,tr,div,p,span').forEach(el => {
      if (el.children.length > 2) return;
      const t = el.textContent.replace(/\s+/g, ' ').trim();
      if (/\d[\d  ]{2,}\s*(₽|руб)/i.test(t) && t.length < 120 && !seen.has(t)) { seen.add(t); out.priceLines.push(t); }
    });
    return out;
  });
  console.log('TITLE:', data.title);
  console.log('HEADINGS:', JSON.stringify(data.h2.slice(0, 30), null, 0));
  console.log('TABLES count:', data.tables.length);
  data.tables.forEach((t, i) => { console.log('--- table', i, 'rows', t.length); t.slice(0, 60).forEach(r => console.log('   ', r.join('  |  '))); });
  console.log('PRICE LINES (' + data.priceLines.length + '):');
  data.priceLines.slice(0, 120).forEach(l => console.log('   ', l));
  await b.close();
})();
