// DreamDent — интерактив: мобильное меню + закрытие по клику/Escape
(function () {
  'use strict';

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Закрыть меню при переходе по якорю
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') && window.matchMedia('(max-width: 768px)').matches) {
      setOpen(false);
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Сброс состояния при возврате на десктоп
  window.matchMedia('(min-width: 769px)').addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();

// ---------- Появление при скролле ----------
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // что анимируем
  var selectors = [
    '.section__head', '.about__inner', '.chief__inner', '.booking__inner',
    '.contacts__inner', '.price-table-wrap', '.price-note', '.hero__content', '.hero__media'
  ];
  var groups = ['.services-grid', '.doctors-grid', '.works-grid', '.reviews-grid', '.licenses-grid'];

  var targets = [];
  selectors.forEach(function (s) { document.querySelectorAll(s).forEach(function (el) { targets.push(el); }); });
  // дети сеток — со «ступенчатой» задержкой
  groups.forEach(function (s) {
    var grid = document.querySelector(s);
    if (!grid) return;
    Array.prototype.forEach.call(grid.children, function (child, i) {
      child.setAttribute('data-delay', String(Math.min(i % 4, 3)));
      targets.push(child);
    });
  });

  if (reduce || !('IntersectionObserver' in window)) return; // контент и так виден

  targets.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(function (el) { io.observe(el); });
})();

// ---------- Счётчик цифр ----------
(function () {
  'use strict';
  var nums = document.querySelectorAll('.stats__count');
  if (!nums.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduce) { el.textContent = target.toFixed(decimals); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) { nums.forEach(animate); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  nums.forEach(function (el) { io.observe(el); });
})();

// ---------- Лайтбокс для «Наших работ» ----------
(function () {
  'use strict';
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var img = lb.querySelector('.lightbox__img');
  var caption = lb.querySelector('.lightbox__caption');
  var closeBtn = lb.querySelector('.lightbox__close');
  var lastFocused = null;

  function open(src, alt) {
    lastFocused = document.activeElement;
    img.src = src; img.alt = alt || '';
    caption.textContent = alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    lb.hidden = true; img.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.work-card__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      open(btn.getAttribute('data-full'), btn.getAttribute('data-caption'));
    });
  });
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lb.hidden) close();
  });
})();

// ---------- Подсветка активного пункта меню при скролле ----------
(function () {
  'use strict';
  var ids = ['services', 'works', 'doctors', 'prices', 'reviews', 'contacts'];
  var map = {}, order = [];
  ids.forEach(function (id) {
    var link = document.querySelector('.nav__link[href="#' + id + '"]');
    var sec = document.getElementById(id);
    if (link && sec) { map[id] = { link: link, sec: sec }; order.push(id); }
  });
  if (!order.length || !('IntersectionObserver' in window)) return;

  var visible = {};
  function update() {
    var current = null;
    for (var i = 0; i < order.length; i++) { if (visible[order[i]]) { current = order[i]; break; } }
    order.forEach(function (id) { map[id].link.classList.toggle('is-active', id === current); });
  }
  var io = new IntersectionObserver(function (obs) {
    obs.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    update();
  }, { rootMargin: '-72px 0px -62% 0px', threshold: 0 });
  order.forEach(function (id) { io.observe(map[id].sec); });
})();

// ---------- Кнопка «наверх» ----------
(function () {
  'use strict';
  var btn = document.querySelector('.to-top');
  if (!btn) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function onScroll() { btn.classList.toggle('is-visible', window.scrollY > 500); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
