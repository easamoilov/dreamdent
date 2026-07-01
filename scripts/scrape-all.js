const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36');
  await p.goto('https://dreamdent.ru/price/', { waitUntil: 'networkidle2', timeout: 60000 }).catch(e => console.log('nav:', e.message));
  await new Promise(r => setTimeout(r, 2500));

  // попробуем показать все строки через DataTables API
  const allViaApi = await p.evaluate(() => {
    try {
      const $ = window.jQuery || window.$;
      if (!$ || !$.fn || !$.fn.dataTable) return null;
      const tbl = $('table').filter((i, t) => $.fn.dataTable.isDataTable(t)).first();
      if (!tbl.length) return null;
      const dt = tbl.DataTable();
      const info = dt.page.info();
      return { total: info.recordsTotal };
    } catch (e) { return { error: e.message }; }
  });
  console.log('API info:', JSON.stringify(allViaApi));

  // надёжный путь: листаем пагинацию и собираем строки
  const rows = [];
  const seen = new Set();
  let guard = 0;
  while (guard++ < 40) {
    const pageRows = await p.evaluate(() => {
      const r = [];
      document.querySelectorAll('table tbody tr').forEach(tr => {
        const c = [...tr.querySelectorAll('td')].map(td => td.textContent.replace(/\s+/g, ' ').trim());
        if (c.length >= 4) r.push(c);
      });
      return r;
    });
    let added = 0;
    for (const c of pageRows) { const k = c.join('|'); if (!seen.has(k)) { seen.add(k); rows.push(c); added++; } }
    // следующая страница
    const next = await p.evaluate(() => {
      const btn = document.querySelector('.paginate_button.next, a.next, li.next a');
      if (!btn) return 'no-btn';
      const disabled = btn.classList.contains('disabled') || btn.parentElement.classList.contains('disabled') || btn.getAttribute('aria-disabled') === 'true';
      if (disabled) return 'disabled';
      btn.click(); return 'clicked';
    });
    if (next !== 'clicked') { console.log('pagination end:', next, '| collected', rows.length); break; }
    await new Promise(r => setTimeout(r, 700));
  }

  fs.writeFileSync('scripts/prices.json', JSON.stringify(rows, null, 0));
  console.log('TOTAL rows:', rows.length);
  const cats = {};
  rows.forEach(r => { cats[r[0]] = (cats[r[0]] || 0) + 1; });
  console.log('CATEGORIES:', JSON.stringify(cats, null, 1));
  await b.close();
})();
