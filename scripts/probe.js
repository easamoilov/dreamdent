const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36');
  const xhr = [];
  p.on('response', r => { const u = r.url(); if (/ajax|wdt|table|price|json/i.test(u) && r.request().method() !== 'OPTIONS') xhr.push(r.request().method()+' '+u); });
  await p.goto('https://dreamdent.ru/price/', { waitUntil: 'networkidle2', timeout: 60000 }).catch(e=>{});
  await new Promise(r=>setTimeout(r,2500));
  const info = await p.evaluate(() => {
    const tbl = document.querySelector('table');
    const wrap = tbl ? tbl.closest('[class]') : null;
    return {
      jQuery: !!(window.jQuery||window.$),
      dataTable: !!(window.jQuery && window.jQuery.fn && window.jQuery.fn.dataTable),
      tableClass: tbl ? tbl.className : null,
      tableId: tbl ? tbl.id : null,
      wrapClass: wrap ? wrap.className : null,
      paginationHTML: (document.querySelector('.dataTables_paginate, .pagination, [class*=paginate]')||{}).outerHTML || 'none',
      bodyRows: document.querySelectorAll('table tbody tr').length,
      infoText: (document.querySelector('.dataTables_info, [class*=info]')||{}).textContent || ''
    };
  });
  console.log(JSON.stringify(info, null, 1));
  console.log('XHR candidates:', JSON.stringify([...new Set(xhr)].slice(0,15), null, 1));
  await b.close();
})();
