// Обновляет данные из ЖИВОГО прайса dreamdent.ru одной командой:
//   node scripts/refresh-data.js
// Открывает страницу оригинала браузером (там запрос same-origin — CORS нет,
// nonce свежий), перехватывает ответ Ninja Tables get-all-data, пишет
// scripts/prices_raw.json и регенерит js/data.js + data/dental-data.json.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const { execSync } = require('child_process');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const p = await b.newPage();
  await p.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36');
  let rows = null;
  p.on('response', async (r) => {
    if (r.url().includes('get-all-data')) { try { rows = await r.json(); } catch (e) {} }
  });
  console.log('Открываю https://dreamdent.ru/price/ …');
  await p.goto('https://dreamdent.ru/price/', { waitUntil: 'networkidle2', timeout: 60000 }).catch(e => console.log('nav:', e.message));
  await new Promise(r => setTimeout(r, 2500));
  await b.close();

  if (!Array.isArray(rows) || !rows.length) { console.error('✗ Не удалось получить данные (эндпоинт изменился или недоступен).'); process.exit(1); }
  fs.writeFileSync('scripts/prices_raw.json', JSON.stringify(rows));
  console.log('✓ Получено строк:', rows.length, '→ scripts/prices_raw.json');
  execSync('node scripts/generate-data.js', { stdio: 'inherit' });
  console.log('✓ Готово: js/data.js и data/dental-data.json обновлены из живого прайса.');
})();
