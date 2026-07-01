// Генерирует <main> для price.html из реального прайса dreamdent.ru (Ninja Tables)
// и вставляет в spa/price.html и alt/price.html (тело идентично, хром инжектится).
const fs = require('fs');

const raw = require('./prices_raw.json');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clean = s => String(s).replace(/\s+/g, ' ').trim();

const ICON = {
  'Терапевтическая стоматология': 'i-tooth',
  'Эндодонтическое лечение': 'i-tooth',
  'Профессиональная гигиена и отбеливание': 'i-clean',
  'Стоматология детского возраста': 'i-child',
  'Рентгенологическое исследование': 'i-scan',
  'Обезболивание': 'i-shield',
  'Хирургическая стоматология': 'i-implant',
  'Имплантация': 'i-implant',
  'Ортодонтия': 'i-braces',
  'Ортопедическая стоматология': 'i-crown',
};

// группировка с сохранением порядка появления
const order = [];
const groups = {};
for (const r of raw) {
  const cat = clean(r.value.ninja_column_1);
  const name = clean(r.value.ninja_column_2);
  let price = clean(r.value.ninja_column_4);
  if (!cat || !name) continue;
  if (!groups[cat]) { groups[cat] = []; order.push(cat); }
  if (/^\d[\d ]*$/.test(price)) price = price + ' ₽';
  groups[cat].push({ name, price });
}

let body = '';
body += '    <section class="page-hero">\n';
body += '      <div class="container page-hero__inner reveal">\n';
body += '        <nav aria-label="Хлебные крошки"><ul class="crumbs"><li><a href="index.html">Главная</a></li><li><span aria-current="page">Цены</span></li></ul></nav>\n';
body += '        <h1 class="page-hero__title">Цены <em>на услуги</em></h1>\n';
body += '        <p class="page-hero__lead">Полный прайс‑лист клиники. Стоимость лечения известна до его начала: после осмотра врач составляет план и смету. Точную сумму назовёт врач на приёме.</p>\n';
body += '      </div>\n';
body += '    </section>\n\n';
body += '    <section class="section">\n      <div class="container">\n';

for (const cat of order) {
  const icon = ICON[cat] || 'i-tooth';
  body += '        <div class="price-group reveal">\n';
  body += `          <h3 class="price-group__title"><svg width="22" height="22"><use href="#${icon}"></use></svg> ${esc(cat)}</h3>\n`;
  body += '          <div class="price-list"><table>\n';
  body += '            <thead><tr><th scope="col">Услуга</th><th scope="col">Цена</th></tr></thead>\n            <tbody>\n';
  for (const it of groups[cat]) {
    body += `              <tr><td>${esc(it.name)}</td><td>${esc(it.price)}</td></tr>\n`;
  }
  body += '            </tbody>\n          </table></div>\n        </div>\n\n';
}

body += '        <p class="price-note">* Прайс‑лист ознакомительный и не является публичной офертой. Точную стоимость врач назовёт после осмотра и составления плана лечения. Действуют акции и программа лояльности.</p>\n';
body += '      </div>\n    </section>\n\n';
body += '    <section class="section section--muted">\n      <div class="container">\n';
body += '        <div class="cta-band reveal">\n';
body += '          <div class="cta-band__text">\n            <h2>Бесплатная консультация и смета</h2>\n            <p>Узнайте точную стоимость вашего лечения на приёме у врача.</p>\n          </div>\n';
body += '          <a class="btn btn--accent btn--lg" href="https://1dn.su/3hP" target="_blank" rel="noopener">Записаться на приём</a>\n';
body += '        </div>\n      </div>\n    </section>\n';

// вставка в оба файла
for (const f of ['spa/price.html', 'alt/price.html']) {
  let html = fs.readFileSync(f, 'utf8');
  const a = html.indexOf('<main id="main">');
  const b = html.indexOf('</main>');
  if (a < 0 || b < 0) { console.error('main markers not found in', f); continue; }
  const head = html.slice(0, a + '<main id="main">'.length);
  const tail = html.slice(b);
  fs.writeFileSync(f, head + '\n' + body + '  ' + tail);
  console.log('updated', f);
}
const total = order.reduce((n, c) => n + groups[c].length, 0);
console.log('groups:', order.length, 'rows:', total);
