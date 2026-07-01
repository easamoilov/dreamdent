// Генерирует js/data.js (window.DD_DATA) из реального прайса dreamdent.ru.
// directions — 6 маркетинговых направлений (услуги) + маппинг на категории прайса.
// prices — все позиции (c=категория, n=название, p=цена).
const fs = require('fs');
const raw = require('./prices_raw.json');
const clean = s => String(s).replace(/\s+/g, ' ').trim();

const prices = raw.map(x => ({
  c: clean(x.value.ninja_column_1),
  n: clean(x.value.ninja_column_2),
  p: clean(x.value.ninja_column_4),
})).filter(r => r.c && r.n);

const directions = [
  { key: 'implantaciya', page: 'implantaciya.html', icon: 'i-implant', title: 'Имплантация',
    text: 'Восстановление утраченных зубов с пожизненной гарантией на импланты.',
    sub: ['Имплантация под ключ', 'Костная пластика и синус-лифтинг', 'Удаление зубов, в т.ч. мудрости', 'Консультация хирурга'],
    priceCats: ['Имплантация', 'Хирургическая стоматология'] },
  { key: 'protezirovanie', page: 'protezirovanie.html', icon: 'i-crown', title: 'Протезирование',
    text: 'Коронки, виниры и протезы, неотличимые от собственных зубов.',
    sub: ['Коронки металлокерамика / E-max', 'Виниры', 'Протезы', 'Временные коронки'],
    priceCats: ['Ортопедическая стоматология'] },
  { key: 'lechenie', page: 'lechenie.html', icon: 'i-tooth', title: 'Лечение зубов',
    text: 'Лечение кариеса, каналов и реставрация без боли и стресса.',
    sub: ['Лечение кариеса', 'Лечение корневых каналов', 'Художественная реставрация', 'Консультация терапевта'],
    priceCats: ['Терапевтическая стоматология', 'Эндодонтическое лечение', 'Обезболивание', 'Рентгенологическое исследование'] },
  { key: 'ortodontiya', page: 'ortodontiya.html', icon: 'i-braces', title: 'Исправление прикуса',
    text: 'Брекеты и элайнеры для красивой улыбки в любом возрасте.',
    sub: ['Брекет-системы', 'Элайнеры (каппы)', 'Ретейнеры', 'Детская ортодонтия'],
    priceCats: ['Ортодонтия'] },
  { key: 'detskaya', page: 'detskaya.html', icon: 'i-child', title: 'Детская стоматология',
    text: 'Бережный подход к маленьким пациентам и профилактика кариеса.',
    sub: ['Лечение молочных зубов', 'Профилактика кариеса', 'Удаление молочных зубов', 'Консультация'],
    priceCats: ['Стоматология детского возраста'] },
  { key: 'gigiena', page: 'gigiena.html', icon: 'i-clean', title: 'Гигиена и отбеливание',
    text: 'Профессиональная чистка и отбеливание для здоровья и красоты.',
    sub: ['Комплексная гигиена', 'Отбеливание Philips Zoom', 'Air-Flow', 'Реминерализация'],
    priceCats: ['Профессиональная гигиена и отбеливание'] },
];

// иконка для каждой категории прайса (для полного прайса)
const catIcon = {
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

// реальные отзывы (scripts/reviews.json), если есть
let reviews = [], reviewsMeta = {};
try { const rv = require('./reviews.json'); reviews = rv.items || []; reviewsMeta = rv.meta || {}; } catch (e) {}

const out =
  '/* ============================================================\n' +
  '   DreamDent — данные услуг и прайса (window.DD_DATA).\n' +
  '   АВТОГЕНЕРАЦИЯ: scripts/generate-data.js из реального прайса\n' +
  '   dreamdent.ru (Ninja Tables, table_id=6140). Не править вручную —\n' +
  '   перегенерить: node scripts/generate-data.js\n' +
  '   ============================================================ */\n' +
  'window.DD_DATA = {\n' +
  '  directions: ' + JSON.stringify(directions, null, 2).replace(/\n/g, '\n  ') + ',\n' +
  '  catIcon: ' + JSON.stringify(catIcon, null, 2).replace(/\n/g, '\n  ') + ',\n' +
  '  reviewsMeta: ' + JSON.stringify(reviewsMeta) + ',\n' +
  '  reviews: ' + JSON.stringify(reviews, null, 2).replace(/\n/g, '\n  ') + ',\n' +
  '  prices: [\n' +
  prices.map(r => '    ' + JSON.stringify(r)).join(',\n') + '\n  ]\n' +
  '};\n';

fs.writeFileSync('js/data.js', out);

// JSON-эндпоинт для fetch (основной источник; js/data.js — офлайн-фолбэк)
const json = JSON.stringify({ directions: directions, catIcon: catIcon, reviewsMeta: reviewsMeta, reviews: reviews, prices: prices });
if (!fs.existsSync('data')) fs.mkdirSync('data');
fs.writeFileSync('data/dental-data.json', json);

console.log('js/data.js:', (out.length / 1024).toFixed(1), 'KB | data/dental-data.json:', (json.length / 1024).toFixed(1), 'KB |', prices.length, 'prices,', directions.length, 'directions');
