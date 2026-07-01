/* ============================================================
   DreamDent — общий скрипт многостраничника.
   Один файл для обоих вариантов (spa / alt): тема задаётся CSS,
   разметка шапки/подвала/спрайта одинакова. Здесь же — поведение
   (липкая шапка, бургер, reveal, счётчики, лайтбокс, «наверх»).
   Подключается из /spa/ и /alt/ как ../js/site.js.
   ============================================================ */
(function () {
  'use strict';

  var page = document.body.getAttribute('data-page') || '';
  // Запись на приём ведёт во внешнюю систему онлайн-записи (МИС), как на оригинале
  // dreamdent.ru. Поменять ссылку — только здесь и в инлайн-CTA страниц (href="https://1dn.su/3hP").
  var BOOK_URL = 'https://1dn.su/3hP';

  /* ---------- Пункты меню ---------- */
  var NAV = [
    { key: 'uslugi',   href: 'uslugi.html',   label: 'Услуги' },
    { key: 'raboty',   href: 'raboty.html',   label: 'Наши работы' },
    { key: 'vrachi',   href: 'vrachi.html',   label: 'Врачи' },
    { key: 'price',    href: 'price.html',    label: 'Цены' },
    { key: 'akcii',    href: 'akcii.html',    label: 'Акции' },
    { key: 'blog',     href: 'blog.html',     label: 'Блог' },
    { key: 'contacts', href: 'contacts.html', label: 'Контакты' }
  ];

  var navItems = NAV.map(function (n) {
    var active = n.key === page ? ' is-active' : '';
    var current = n.key === page ? ' aria-current="page"' : '';
    return '<li><a class="nav__link' + active + '" href="' + n.href + '"' + current + '>' + n.label + '</a></li>';
  }).join('');

  /* ---------- Шапка ---------- */
  var headerHTML =
    '<a class="skip-link" href="#main">Перейти к содержимому</a>' +
    '<header class="header">' +
      '<div class="container navbar__inner">' +
        '<a class="logo" href="index.html" aria-label="ДРИМ — семейная стоматология, на главную">' +
          '<img class="logo__mark-img" src="../images/logo-mark.png" width="85" height="65" alt="" aria-hidden="true">' +
          '<span class="logo__text"><span class="logo__name">ДРИМ</span><span class="logo__tag">семейная стоматология</span></span>' +
        '</a>' +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Открыть меню"><span class="nav-toggle__bar"></span></button>' +
        '<nav class="nav" id="primary-nav" aria-label="Основное меню">' +
          '<ul class="nav__list">' + navItems + '</ul>' +
          '<a class="btn btn--accent btn--block nav__mob-cta" href="' + BOOK_URL + '" target="_blank" rel="noopener">Записаться</a>' +
        '</nav>' +
        '<a class="btn btn--accent navbar__cta" href="' + BOOK_URL + '" target="_blank" rel="noopener">Записаться</a>' +
      '</div>' +
    '</header>';

  /* ---------- Подвал ---------- */
  var footerHTML =
    '<footer class="footer">' +
      '<div class="container footer__inner">' +
        '<div class="footer__col">' +
          '<a class="logo" href="index.html">' +
            '<img class="logo__mark-img" src="../images/logo-mark.png" width="85" height="65" alt="" aria-hidden="true">' +
            '<span class="logo__text"><span class="logo__name">ДРИМ</span><span class="logo__tag">семейная стоматология</span></span>' +
          '</a>' +
          '<p class="footer__muted">DreamDent.ru © 2018–2025.<br>Не является публичной офертой.</p>' +
        '</div>' +
        '<div class="footer__col">' +
          '<h3 class="footer__title">Контакты</h3>' +
          '<address class="footer__address">' +
            '<p>129327, г. Москва, ул. Чичерина, д. 8, корп. 2</p>' +
            '<p><a href="tel:+74954710090">+7 (495) 471-00-90</a></p>' +
            '<p><a href="tel:+79859301238">+7 (985) 930-12-38</a></p>' +
            '<p><a href="mailto:info@dreamdent.ru">info@dreamdent.ru</a></p>' +
          '</address>' +
        '</div>' +
        '<div class="footer__col">' +
          '<h3 class="footer__title">Разделы</h3>' +
          '<address class="footer__address">' +
            '<p><a href="uslugi.html">Услуги</a></p>' +
            '<p><a href="price.html">Цены</a></p>' +
            '<p><a href="vrachi.html">Врачи</a></p>' +
            '<p><a href="akcii.html">Акции</a></p>' +
            '<p><a href="blog.html">Блог</a></p>' +
          '</address>' +
        '</div>' +
        '<div class="footer__col">' +
          '<h3 class="footer__title">Реквизиты</h3>' +
          '<p class="footer__muted">ООО «Крона-Мед»<br>Лицензия Л041-01137-77/00337833<br>ИНН 7715963316 · ОГРН 1137746410614</p>' +
          '<p class="footer__links"><a href="#">Политика обработки персональных данных</a></p>' +
        '</div>' +
      '</div>' +
    '</footer>';

  /* ---------- Плавающие кнопки + лайтбокс ---------- */
  var extrasHTML =
    '<div class="floaties">' +
      '<button class="to-top" type="button" aria-label="Наверх"><svg width="22" height="22"><use href="#i-arrow-up"></use></svg></button>' +
      '<a class="wa-fab" href="https://wa.me/74954710090" target="_blank" rel="noopener" aria-label="Написать в WhatsApp"><svg width="28" height="28"><use href="#i-whatsapp"></use></svg></a>' +
    '</div>' +
    '<div class="lightbox" id="lightbox" hidden>' +
      '<button class="lightbox__close" type="button" aria-label="Закрыть"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg></button>' +
      '<figure class="lightbox__figure"><img class="lightbox__img" src="" alt=""><figcaption class="lightbox__caption"></figcaption></figure>' +
    '</div>';

  /* ---------- SVG-спрайт (объединённый набор иконок) ---------- */
  var spriteHTML =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></symbol>' +
    '<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>' +
    '<symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></symbol>' +
    '<symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></symbol>' +
    '<symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.5 7 10 4-2.5 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></symbol>' +
    '<symbol id="i-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21Z"/></symbol>' +
    '<symbol id="i-wallet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h12v4"/><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H6a3 3 0 0 1-3-2Z"/><circle cx="16" cy="14" r="1.2"/></symbol>' +
    '<symbol id="i-tooth" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.5C10.5 3.5 6 3 5 6.5c-.8 2.8.5 5 1 8 .4 2.3.3 6 2 6s1.6-3 2-4.5c.2-.8.6-1.5 2-1.5s1.8.7 2 1.5c.4 1.5.3 4.5 2 4.5s1.6-3.7 2-6c.5-3 1.8-5.2 1-8C18 3 13.5 3.5 12 5.5Z"/></symbol>' +
    '<symbol id="i-implant" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 8 6h8l-4-4Z"/><path d="M9 6h6l-1 4h-4L9 6Z"/><path d="M10 10h4l-1 6h-2l-1-6Z"/><path d="M11 16h2l-1 6-1-6Z"/></symbol>' +
    '<symbol id="i-crown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8Z"/></symbol>' +
    '<symbol id="i-child" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3"/><path d="M9 11c-2 1-3 3-3 6h12c0-3-1-5-3-6"/><path d="M9 17h6"/></symbol>' +
    '<symbol id="i-braces" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9v6m18-6v6M3 12h18"/><rect x="6" y="9.5" width="3" height="5" rx="1"/><rect x="10.5" y="9.5" width="3" height="5" rx="1"/><rect x="15" y="9.5" width="3" height="5" rx="1"/></symbol>' +
    '<symbol id="i-clean" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v5H9z"/><path d="M8 8h8l1 13H7L8 8Z"/><path d="M10 12v5m4-5v5"/></symbol>' +
    '<symbol id="i-percent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></symbol>' +
    '<symbol id="i-gift" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v9H4v-9"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7S11 3 8.5 3 5.5 7 12 7Zm0 0s1-4 3.5-4S18.5 7 12 7Z"/></symbol>' +
    '<symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v3m8-3v3"/></symbol>' +
    '<symbol id="i-scan" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M3 12h18"/></symbol>' +
    '<symbol id="i-sparkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></symbol>' +
    '<symbol id="i-arrow-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-7 7 7-7 7 7"/></symbol>' +
    '<symbol id="i-whatsapp" viewBox="0 0 32 32" fill="currentColor"><path d="M16 .4C7.4.4.5 7.3.5 15.9c0 2.8.7 5.4 2 7.8L.4 31.6l8.1-2.1c2.3 1.3 4.9 1.9 7.5 1.9h.1c8.6 0 15.5-6.9 15.5-15.5C31.6 7.3 24.6.4 16 .4zm0 28.3h-.1c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.8 1.3 1.3-4.7-.3-.5c-1.3-2.1-2-4.5-2-7C3.1 8.8 8.9 3 16 3c3.4 0 6.7 1.3 9.1 3.8 2.4 2.4 3.8 5.7 3.8 9.1 0 7.1-5.8 12.8-12.9 12.8zm7.1-9.6c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.2-1.3-3-.3-.7-.6-.6-.9-.6h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1 0 1.8 1.3 3.6 1.5 3.8.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.2.7-.1 2.3-.9 2.6-1.9.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.6-.5z"/></symbol>' +
    '</defs></svg>';

  /* ---------- Вставка разметки ---------- */
  var top = document.getElementById('dd-top');
  var bottom = document.getElementById('dd-bottom');
  if (top) top.innerHTML = headerHTML;
  if (bottom) bottom.innerHTML = footerHTML + extrasHTML + spriteHTML;

  /* ---------- Данные: услуги и прайс ----------
     Грузятся ЗАПРОСОМ (fetch) из data/dental-data.json. Страница рисуется в
     зависимости от ответа: загрузка → успех → ошибка («Повторить»).
     Фолбэк: window.DD_DATA из js/data.js (чтобы демо открывалось и по file://,
     где fetch заблокирован браузером). */
  var DD = null;
  var DD_URL = '../data/dental-data.json';
  var observeReveal; // присваивается в блоке scroll-reveal ниже, используется после async-рендера
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmtPrice(p) { return /^[0-9][0-9 ]*$/.test(p) ? p + ' ₽' : esc(p); }
  function priceTable(rows) {
    var b = rows.map(function (r) { return '<tr><td>' + esc(r.n) + '</td><td>' + fmtPrice(r.p) + '</td></tr>'; }).join('');
    return '<div class="price-list"><table><thead><tr><th scope="col">Услуга</th><th scope="col">Цена</th></tr></thead><tbody>' + b + '</tbody></table></div>';
  }
  function renderServices(el) {
    var full = el.getAttribute('data-dd-mode') === 'full';
    var html = '<ul class="services-grid">';
    DD.directions.forEach(function (d) {
      html += '<li class="service-card reveal">' +
        '<span class="service-card__icon"><svg width="30" height="30"><use href="#' + d.icon + '"></use></svg></span>' +
        '<h3 class="service-card__title">' + esc(d.title) + '</h3>' +
        '<p class="service-card__text">' + esc(d.text) + '</p>';
      if (full && d.sub) html += '<ul class="service-card__list">' + d.sub.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
      html += '<a class="service-card__link" href="' + d.page + '">Подробнее</a></li>';
    });
    el.innerHTML = html + '</ul>';
  }
  function renderPrice(el) {
    var key = el.getAttribute('data-dd-cat');
    var d = DD.directions.filter(function (x) { return x.key === key; })[0];
    if (!d) return;
    var limit = parseInt(el.getAttribute('data-dd-limit') || '0', 10);
    var rows = DD.prices.filter(function (r) { return d.priceCats.indexOf(r.c) >= 0; });
    var shown = limit > 0 ? rows.slice(0, limit) : rows;
    var html = '<div class="price-group"><h3 class="price-group__title"><svg width="22" height="22"><use href="#' + d.icon + '"></use></svg> Цены — ' + esc(d.title) + '</h3>' + priceTable(shown) + '</div>';
    if (limit > 0 && rows.length > limit) html += '<p class="price-note" style="text-align:left">Показаны основные позиции (' + shown.length + ' из ' + rows.length + '). <a href="price.html">Полный прайс-лист →</a></p>';
    el.innerHTML = html;
  }
  function renderPriceFull(el) {
    var order = [], groups = {};
    DD.prices.forEach(function (r) { if (!groups[r.c]) { groups[r.c] = []; order.push(r.c); } groups[r.c].push(r); });
    el.innerHTML = order.map(function (c) {
      var icon = (DD.catIcon && DD.catIcon[c]) || 'i-tooth';
      return '<div class="price-group reveal"><h3 class="price-group__title"><svg width="22" height="22"><use href="#' + icon + '"></use></svg> ' + esc(c) + '</h3>' + priceTable(groups[c]) + '</div>';
    }).join('');
  }
  function renderReviews(el) {
    if (!DD.reviews || !DD.reviews.length) return;
    el.innerHTML = '<ul class="reviews-grid">' + DD.reviews.map(function (r) {
      var n = r.stars || 5, stars = '★★★★★'.slice(0, n);
      return '<li class="review-card reveal">' +
        '<div class="review-card__stars" aria-label="Оценка ' + n + ' из 5">' + stars + '</div>' +
        '<blockquote class="review-card__text">' + esc(r.text) + '</blockquote>' +
        '<footer class="review-card__author">— ' + esc(r.author) + (r.date ? ' · ' + esc(r.date) : '') + '</footer></li>';
    }).join('') + '</ul>';
  }
  function ddNodes() { return [].slice.call(document.querySelectorAll('[data-dd]')); }
  function ddRenderAll() {
    document.querySelectorAll('[data-dd="services"]').forEach(renderServices);
    document.querySelectorAll('[data-dd="price"]').forEach(renderPrice);
    document.querySelectorAll('[data-dd="price-full"]').forEach(renderPriceFull);
    document.querySelectorAll('[data-dd="reviews"]').forEach(renderReviews);
    if (typeof observeReveal === 'function') observeReveal(document); // подхватить новые .reveal
  }
  function ddSetLoading() {
    ddNodes().forEach(function (el) {
      el.innerHTML = '<div class="dd-state dd-state--loading" aria-live="polite"><span class="dd-spinner" aria-hidden="true"></span><span>Загружаем данные…</span></div>';
    });
  }
  function ddSetError() {
    ddNodes().forEach(function (el) {
      el.innerHTML = '<div class="dd-state dd-state--error" role="alert"><p>Не удалось загрузить данные. Проверьте соединение и попробуйте ещё раз.</p><button type="button" class="btn btn--ghost dd-retry">Повторить</button></div>';
    });
    document.querySelectorAll('.dd-retry').forEach(function (b) { b.addEventListener('click', ddLoad); });
  }
  function ddLoad() {
    if (!ddNodes().length) return;
    ddSetLoading();
    fetch(DD_URL, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) { DD = data; ddRenderAll(); })
      .catch(function () {
        if (window.DD_DATA) { DD = window.DD_DATA; ddRenderAll(); } // офлайн / file:// фолбэк
        else ddSetError();
      });
  }
  ddLoad();

  /* ---------- Поведение ---------- */
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.querySelector('.header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 10);
    if (toTop) toTop.classList.toggle('is-visible', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' }); });

  /* Бургер-меню */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
  }

  /* Scroll-reveal (observeReveal переиспользуется после async-рендера данных) */
  if ('IntersectionObserver' in window) {
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); revIO.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    observeReveal = function (scope) { (scope || document).querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) { revIO.observe(el); }); };
  } else {
    observeReveal = function (scope) { (scope || document).querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); }); };
  }
  observeReveal(document);

  /* Счётчик цифр */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    if (rm) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1500;
    function step(t) {не
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target.toFixed(dec);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.4 });
    document.querySelectorAll('.stats__count').forEach(function (c) { cio.observe(c); });
  } else {
    document.querySelectorAll('.stats__count').forEach(function (c) { c.textContent = c.dataset.count; });
  }

  /* Лайтбокс */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lightbox__img');
    var lbCap = lb.querySelector('.lightbox__caption');
    var openLb = function (full, cap) { lbImg.src = full; lbImg.alt = cap || ''; lbCap.textContent = cap || ''; lb.hidden = false; document.body.style.overflow = 'hidden'; };
    var closeLb = function () { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; };
    document.querySelectorAll('.work-card__btn').forEach(function (b) {
      b.addEventListener('click', function () { openLb(b.dataset.full, b.dataset.caption); });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.lightbox__close')) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
  }
})();
