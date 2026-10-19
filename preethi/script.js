(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- Data ---------- */
  var IMG = 'assets/img/';
  var EVENTS = [
    { id: 'psn', label: 'PSN Arts and Science College', count: 4, alt: 'Self-introduction training session at PSN Arts and Science College' },
    { id: 'step', label: 'Government Colleges', count: 2, alt: 'Training session at a government college' },
    { id: 'kanyakumari', label: 'Kanyakumari District Colleges', count: 6, alt: 'Training session at a college in Kanyakumari district' },
    { id: 'workshops', label: 'Workshops & Seminars', count: 5, alt: 'Workshop and seminar session' },
    { id: 'school', label: 'School Students', count: 5, alt: 'Training session for school students' },
    { id: 'bootcamp', label: 'Boot Camp Project', count: 6, alt: 'Boot camp project activity' },
    { id: 'nagapattinam', label: 'Govt. Arts & Science College, Nagapattinam', count: 2, alt: 'Session at Govt. Arts and Science College, Nagapattinam' },
    { id: 'finpro', label: 'Sir Issac Newton College', count: 6, alt: 'Training session at Sir Issac Newton College' },
    { id: 'arifa', label: 'Arifa Institute of Technology', count: 10, alt: 'Programme at Arifa Institute of Technology' },
    { id: 'allied', label: 'Sri Vijay Vidyalaya College of Allied Health Science', count: 18, alt: 'Bridge course session at Sri Vijay Vidyalaya College of Allied Health Science' },
    { id: 'nursing', label: 'Sri Vijay Vidyalaya College of Nursing', count: 15, alt: 'Session at Sri Vijay Vidyalaya College of Nursing' },
    { id: 'skilldev', label: 'Skill Development Programme', count: 10, alt: 'Skill development programme session' },
    { id: 'rbd', label: 'RBD College', count: 3, alt: 'Session at RBD College' },
    { id: 'fdp', label: 'Faculty Development Programme', count: 13, alt: 'Faculty Development Programme session' },
    { id: 'adm', label: 'A.D.M. College for Women', count: 1, alt: 'Session at A.D.M. College for Women, Nagapattinam' },
    { id: 'sristi', label: 'Sristi Foundation', count: 6, alt: 'Interactive session at Sristi Special School, Konamangalam' }
  ];

  /* ---------- Helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html) n.innerHTML = html;
    return n;
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var items = [], idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    lbImg.src = items[idx].src;
    lbImg.alt = items[idx].alt;
    lbCap.textContent = items[idx].caption;
  }
  function openLb(list, i) {
    items = list; lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }
  function closeLb() {
    lb.hidden = true;
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  });

  /* ---------- Gallery ---------- */
  var filters = document.getElementById('filters');
  var grid = document.getElementById('galleryGrid');
  var all = [];
  EVENTS.forEach(function (ev) {
    for (var n = 1; n <= ev.count; n++) {
      all.push({ ev: ev.id, src: IMG + 'gallery/' + ev.id + '-' + n + '.jpg', alt: ev.alt + ' (photo ' + n + ')', caption: ev.label });
    }
  });
  var current = 'all', visible = [];

  function render() {
    grid.innerHTML = '';
    visible = all.filter(function (p) { return current === 'all' || p.ev === current; });
    visible.forEach(function (p, i) {
      var b = el('button', 'shot pop');
      b.style.setProperty('--i', i % 12);
      b.type = 'button';
      b.setAttribute('aria-label', 'Open photo: ' + p.caption);
      b.innerHTML = '<img loading="lazy" src="' + p.src + '" alt="' + p.alt + '"><span>' + p.caption + '</span>';
      b.addEventListener('click', function () { openLb(visible, i); });
      grid.appendChild(b);
    });
  }
  function tab(id, label) {
    var b = el('button', '', label);
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', id === current ? 'true' : 'false');
    b.addEventListener('click', function () {
      current = id;
      Array.prototype.forEach.call(filters.children, function (c) { c.setAttribute('aria-selected', 'false'); });
      b.setAttribute('aria-selected', 'true');
      render();
    });
    filters.appendChild(b);
  }
  tab('all', 'All (' + all.length + ')');
  EVENTS.forEach(function (ev) { tab(ev.id, ev.label); });
  render();


  /* ---------- Stagger lists, ticker, progress, copy ---------- */
  document.querySelectorAll('.chips, .ticks, .orgs, .tags').forEach(function (ul) {
    ul.classList.add('stagger', 'reveal');
    Array.prototype.forEach.call(ul.children, function (li, i) { li.style.setProperty('--i', i); });
  });

  var track = document.getElementById('tickerTrack');
  if (track) {
    track.innerHTML += track.innerHTML;
    track.setAttribute('aria-hidden', 'false');
  }

  var bar = document.getElementById('progress');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toast = document.getElementById('toast');
  var toastTimer = null;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  document.querySelectorAll('[data-copy], [data-copy-from]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.getAttribute('data-copy-from');
      var node = src ? document.querySelector(src) : null;
      var text = node ? node.textContent.trim() : btn.getAttribute('data-copy');
      var long = text.length > 60;
      function done(ok) { say(ok ? (long ? 'Bio copied' : 'Copied: ' + text) : (long ? 'Select the text to copy it' : 'Press and hold to copy: ' + text)); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
      } else { done(fallbackCopy(text)); }
    });
  });

  /* ---------- Reveal + counters ---------- */
  function countUp(node) {
    var target = parseInt(node.getAttribute('data-count'), 10);
    if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var start = null, dur = 1400;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      node.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    node.textContent = '0';
    requestAnimationFrame(step);
  }
  var counted = new WeakSet();
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('[data-count]').forEach(function (n) {
          if (!counted.has(n)) { counted.add(n); countUp(n); }
        });
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
  }

  /* ---------- Nav scroll-spy ---------- */
  (function () {
    var links = {};
    document.querySelectorAll('#menu a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var ids = Object.keys(links);
    if (!('IntersectionObserver' in window) || !ids.length) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        ids.forEach(function (id) { links[id].classList.toggle('active', id === en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  })();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
