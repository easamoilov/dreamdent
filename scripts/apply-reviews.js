// Заменяет статические карточки отзывов на плейсхолдер data-dd="reviews"
// и удаляет iframe-виджет Яндекса.
const fs = require('fs');
['spa/index.html', 'alt/index.html', 'spa/raboty.html'].forEach(function (f) {
  let h = fs.readFileSync(f, 'utf8');

  // 1) удалить блок виджета .reviews-widget
  let s = h.indexOf('<div class="reviews-widget');
  if (s >= 0) {
    const ifr = h.indexOf('</iframe>', s);
    let e = h.indexOf('</div>', ifr >= 0 ? ifr : s) + '</div>'.length;
    let bs = s;
    while (bs > 0 && /\s/.test(h[bs - 1])) bs--;
    h = h.slice(0, bs) + h.slice(e);
    console.log('widget removed:', f);
  }

  // 2) заменить <ul class="reviews-grid">…</ul> на плейсхолдер
  const gs = h.indexOf('<ul class="reviews-grid">');
  if (gs >= 0) {
    const ge = h.indexOf('</ul>', gs) + '</ul>'.length;
    h = h.slice(0, gs) + '<div data-dd="reviews"></div>' + h.slice(ge);
    console.log('grid -> placeholder:', f);
  }

  fs.writeFileSync(f, h);
});
