// Вставляет виджет отзывов Яндекс.Карт после .reviews-grid (идемпотентно).
const fs = require('fs');
const WIDGET =
  '\n        <div class="reviews-widget reveal">' +
  '\n          <iframe title="Отзывы о стоматологии ДРИМ на Яндекс.Картах" src="https://yandex.ru/maps-reviews-widget/72252033652?comments" loading="lazy"></iframe>' +
  '\n        </div>';

['spa/index.html', 'alt/index.html', 'spa/raboty.html'].forEach(function (f) {
  let h = fs.readFileSync(f, 'utf8');
  if (h.indexOf('reviews-widget') >= 0) { console.log('already has widget:', f); return; }
  const i = h.indexOf('<ul class="reviews-grid">');
  if (i < 0) { console.log('no reviews-grid:', f); return; }
  const j = h.indexOf('</ul>', i);
  if (j < 0) { console.log('no </ul>:', f); return; }
  const end = j + '</ul>'.length;
  h = h.slice(0, end) + WIDGET + h.slice(end);
  fs.writeFileSync(f, h);
  console.log('widget added:', f);
});
