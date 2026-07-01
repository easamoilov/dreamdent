// Переводит статические блоки услуг/цен на динамические плейсхолдеры [data-dd].
const fs = require('fs');

function replacePriceBlock(file, placeholder) {
  let h = fs.readFileSync(file, 'utf8');
  const s = h.indexOf('<div class="price-group reveal">');
  const n = h.indexOf('<p class="price-note"');
  if (s < 0 || n < 0) { console.log('SKIP price', file); return; }
  h = h.slice(0, s) + placeholder + '\n        ' + h.slice(n);
  fs.writeFileSync(file, h);
  console.log('price ->', file);
}

function replaceServicesGrid(file, placeholder) {
  let h = fs.readFileSync(file, 'utf8');
  const s = h.indexOf('<ul class="services-grid">');
  if (s < 0) { console.log('SKIP services', file); return; }
  const containerClose = h.indexOf('\n      </div>', s);
  if (containerClose < 0) { console.log('SKIP services(close)', file); return; }
  h = h.slice(0, s) + placeholder + h.slice(containerClose);
  fs.writeFileSync(file, h);
  console.log('services ->', file);
}

// категории: таблица цен направления (с лимитом + ссылкой на полный прайс)
const cats = ['implantaciya', 'protezirovanie', 'lechenie', 'ortodontiya', 'detskaya', 'gigiena'];
cats.forEach(k => replacePriceBlock('spa/' + k + '.html', '<div data-dd="price" data-dd-cat="' + k + '" data-dd-limit="14"></div>'));

// полный прайс
replacePriceBlock('spa/price.html', '<div data-dd="price-full"></div>');

// каталог услуг (с подсписками)
replaceServicesGrid('spa/uslugi.html', '<div data-dd="services" data-dd-mode="full"></div>');

// услуги на главных (компактные карточки) — обе темы правим напрямую
replaceServicesGrid('spa/index.html', '<div data-dd="services" data-dd-mode="compact"></div>');
replaceServicesGrid('alt/index.html', '<div data-dd="services" data-dd-mode="compact"></div>');
