import { animate, createTimeline, onScroll, stagger, svg, utils } from 'animejs';
import './style.css';
import { I18N } from './i18n.js';
import { portal, lilyBouquet, wisteriaCorner, quatrefoil, vignettes, mosaicTiles, asImage } from './art.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = matchMedia('(max-width: 640px)').matches;
document.documentElement.classList.add('js');

const WEDDING = new Date('2026-10-27T19:00:00+03:00'); // 7:00 PM Cairo
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Tia Vie, Cairo, Egypt');

// ---------------------------------------------------------------- i18n
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const qsLang = new URLSearchParams(location.search).get('lang');
let lang = qsLang === 'en' || qsLang === 'ar' ? qsLang : store.get('me-lang') || 'ar';
const t = (k) => I18N[lang][k] ?? '';

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('meta.title');
  $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  updateLinks();
  renderCountdown(true);
}
$('#langToggle').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  store.set('me-lang', lang);
  animate('main', { opacity: [1, 0], duration: 220, ease: 'inQuad', onComplete: () => {
    applyLang();
    eveRefresh();
    animate('main', { opacity: [0, 1], duration: 380, ease: 'outQuad' });
  } });
});

// ---------------------------------------------------------------- artwork
const art = {
  portal: () => portal(),
  wisteria: () => asImage(wisteriaCorner(5)),
  wisteria2: () => asImage(wisteriaCorner(9)),
  wisteria3: () => asImage(wisteriaCorner(14, 260, 300)),
  wisteria4: () => asImage(wisteriaCorner(19, 260, 300)),
  bouquet: () => asImage(lilyBouquet(3)),
  bouquet2: () => asImage(lilyBouquet(8)),
  bouquet3: () => asImage(lilyBouquet(21, 320, 520)),
};
$$('[data-art]').forEach((el) => { el.innerHTML = art[el.dataset.art](); });
$$('.qf-mono').forEach((el) => el.insertAdjacentHTML('afterbegin', quatrefoil()));
$$('[data-vig]').forEach((el) => { el.innerHTML = vignettes[el.dataset.vig]; });

// ---------------------------------------------------------------- opener: the mosaic medallion
const NS = 'http://www.w3.org/2000/svg';
const tileSize = isSmall ? 11 : 9.5;
const tiles = mosaicTiles(190, tileSize);
const g = $('.mosaic .tiles');
const frag = document.createDocumentFragment();
tiles.forEach((tl) => {
  const r = document.createElementNS(NS, 'rect');
  r.setAttribute('x', (tl.x - tileSize / 2).toFixed(1));
  r.setAttribute('y', (tl.y - tileSize / 2).toFixed(1));
  r.setAttribute('width', (tileSize * .9).toFixed(1));
  r.setAttribute('height', (tileSize * .9).toFixed(1));
  r.setAttribute('rx', '1');
  r.setAttribute('fill', tl.color);
  r.style.transform = `rotate(${tl.rot.toFixed(1)}deg)`;
  r.dataset.t = tl.t.toFixed(3);
  frag.appendChild(r);
});
g.appendChild(frag);
const rects = $$('.mosaic rect');

// the medallion assembles from the centre outwards
if (!reduced) {
  animate(rects, {
    opacity: [0, 1],
    scale: [0, 1],
    duration: 700,
    delay: (el) => Number(el.dataset.t) * 1300 + Math.random() * 180,
    ease: 'outBack(1.6)',
  });
  animate('.opener-mono', { opacity: [0, 1], scale: [.6, 1], duration: 900, delay: 300, ease: 'outElastic(1, .6)' });
  animate('.opener-copy', { opacity: [0, 1], y: [16, 0], duration: 900, delay: 1300, ease: 'outQuad' });
}

function openInvitation() {
  const opener = $('.opener');
  if (opener.dataset.opening) return;
  opener.dataset.opening = '1';
  opener.style.pointerEvents = 'none';
  const done = () => { opener.remove(); document.body.classList.remove('locked'); portalIntro(); };
  if (reduced) { animate(opener, { opacity: [1, 0], duration: 400, onComplete: done }); return; }

  // tiles burst outwards from the centre like a mosaic shattering into petals of colour
  const tl = createTimeline({ onComplete: done });
  tl.add('.opener-copy', { opacity: 0, y: 20, duration: 300, ease: 'inQuad' }, 0)
    .add('.opener-mono', { scale: [1, 1.25, 0], opacity: [1, 1, 0], duration: 700, ease: 'inBack(1.4)' }, 0)
    .add(rects, {
      x: (el) => { const a = Math.atan2(+el.getAttribute('y'), +el.getAttribute('x')); return Math.cos(a) * (260 + Math.random() * 520); },
      y: (el) => { const a = Math.atan2(+el.getAttribute('y'), +el.getAttribute('x')); return Math.sin(a) * (260 + Math.random() * 520) + 120; },
      rotate: () => utils.random(-280, 280),
      opacity: [1, 0],
      duration: 1300,
      delay: (el) => Number(el.dataset.t) * 380,
      ease: 'outQuart',
    }, 200)
    .add(opener, { opacity: [1, 0], duration: 900, ease: 'outQuad' }, 650);
}
$('.opener-mono').addEventListener('click', openInvitation);
$('.opener').addEventListener('click', openInvitation);

// ---------------------------------------------------------------- 1 · the portal
function portalIntro() {
  if (reduced) return setupScroll();
  const arcs = svg.createDrawable('#arch-band path');
  createTimeline({ onComplete: setupScroll })
    .add('.portal-scene', { scale: [1.12, 1], opacity: [0, 1], duration: 1200, ease: 'outQuart' }, 0)
    .add(arcs, { draw: ['0 0', '0 1'], duration: 1400, delay: stagger(120), ease: 'inOutQuad' }, 200)
    .add('#col-l', { x: [-60, 0], opacity: [0, 1], duration: 1000, ease: 'outExpo' }, 300)
    .add('#col-r', { x: [60, 0], opacity: [0, 1], duration: 1000, ease: 'outExpo' }, 300)
    .add('.wis', { scaleY: [0, 1], opacity: [0, 1], duration: 1500, ease: 'outQuart' }, 500)
    .add('.lilies', { y: ['40%', '0%'], opacity: [0, 1], duration: 1300, ease: 'outBack(1.2)' }, 650)
    .add('.portal-text > *', { opacity: [0, 1], y: [24, 0], filter: ['blur(6px)', 'blur(0px)'], duration: 900, delay: stagger(110), ease: 'outQuad' }, 900)
    .add('.portal-cue', { opacity: [0, 1], duration: 800 }, 1800);
}

// ---------------------------------------------------------------- scroll animations
function setupScroll() {
  // walk through the arch: the scene zooms into the mint opening as you scroll
  createTimeline({
    autoplay: onScroll({ target: '.portal-wrap', enter: 'top top', leave: 'bottom bottom', sync: .25 }),
  })
    .add('.portal-text', { opacity: [1, 0], y: [0, -40], duration: 300, ease: 'inQuad' }, 0)
    .add('.portal-cue', { opacity: [1, 0], duration: 150 }, 0)
    .add('.wis-l', { x: ['0%', '-60%'], y: ['0%', '-30%'], duration: 700 }, 0)
    .add('.wis-r', { x: ['0%', '60%'], y: ['0%', '-30%'], duration: 700 }, 0)
    .add('.lilies-l', { x: ['0%', '-70%'], y: ['0%', '40%'], duration: 700 }, 0)
    .add('.lilies-r', { x: ['0%', '70%'], y: ['0%', '40%'], duration: 700 }, 0)
    .add('.portal-scene', { scale: [1, isSmall ? 4.2 : 3.4], duration: 1000, ease: 'inQuad' }, 0);

  // fade-up reveals, played once when they enter
  $$('.reveal').forEach((el) => {
    animate(el, {
      opacity: [0, 1], y: [30, 0], duration: 1000, ease: 'outQuart',
      autoplay: onScroll({ target: el, enter: 'bottom-=8% top', repeat: false }),
    });
  });
  // names write themselves in
  $$('.reveal-name').forEach((el, i) => {
    animate(el, {
      opacity: [0, 1], scale: [.92, 1], filter: ['blur(10px)', 'blur(0px)'], clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
      duration: 1500, delay: i * 250, ease: 'outQuart',
      autoplay: onScroll({ target: el, enter: 'bottom-=10% top', repeat: false }),
    });
  });
  // the invitation card rises and the side bouquet drifts with scroll
  animate('.card', { y: [60, 0], rotate: [-1.5, 0], duration: 1000, autoplay: onScroll({ target: '.card', enter: 'bottom top', leave: 'center center', sync: .3 }) });
  animate('.card-bouquet', { y: ['-10%', '18%'], rotate: [-6, 4], duration: 1000, autoplay: onScroll({ target: '.card-sec', enter: 'bottom top', leave: 'top bottom', sync: .4 }) });
  // countdown tiles flip in one by one
  animate('.count-tile', { rotateY: [90, 0], opacity: [0, 1], duration: 900, delay: stagger(140), ease: 'outBack(1.4)',
    autoplay: onScroll({ target: '.count', enter: 'bottom-=10% top', repeat: false }) });
  // the venue window opens like a shutter
  animate('.window', { clipPath: ['inset(100% 0 0 0 round 220px 220px 18px 18px)', 'inset(0% 0 0 0 round 220px 220px 18px 18px)'], duration: 1400, ease: 'outQuart',
    autoplay: onScroll({ target: '.window', enter: 'bottom-=5% top', repeat: false }) });

  setupEvening();
}

// ---------------------------------------------------------------- 4 · the evening (horizontal)
const track = $('.eve-track');
const bar = $('.eve-progress i');
const cards = $$('.eve-card');
const drawn = new Set();
let eveDistance = 0;
function eveRefresh() {
  eveDistance = Math.max(0, track.scrollWidth - innerWidth);
}
function eveUpdate(p) {
  const dir = document.documentElement.dir === 'rtl' ? 1 : -1;
  track.style.transform = `translate3d(${(dir * eveDistance * p).toFixed(1)}px, 0, 0)`;
  bar.style.transform = `scaleX(${p.toFixed(3)})`;
  const active = Math.min(cards.length - 1, Math.round(p * (cards.length - 1)));
  cards.forEach((c, i) => c.classList.toggle('is-active', i === active));
  if (!drawn.has(active)) {
    drawn.add(active);
    const paths = svg.createDrawable($$('.draw > *', cards[active]));
    animate(paths, { draw: ['0 0', '0 1'], duration: 1200, delay: stagger(100), ease: 'inOutQuad' });
  }
}
function setupEvening() {
  eveRefresh();
  addEventListener('resize', eveRefresh);
  onScroll({
    target: '.eve', enter: 'top top', leave: 'bottom bottom',
    onUpdate: (self) => eveUpdate(Math.min(1, Math.max(0, self.progress))),
  });
  eveUpdate(0);
}

// ---------------------------------------------------------------- countdown
const nums = Object.fromEntries($$('.num').map((el) => [el.dataset.unit, el]));
let prev = {};
const fmt = (n) => n.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { minimumIntegerDigits: 2, useGrouping: false });
function renderCountdown(force = false) {
  const diff = Math.max(0, WEDDING - Date.now());
  const parts = {
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff % 864e5) / 36e5),
    minutes: Math.floor((diff % 36e5) / 6e4),
  };
  for (const k in parts) {
    if (!force && prev[k] === parts[k]) continue;
    nums[k].textContent = fmt(parts[k]);
    if (!force && !reduced && prev[k] !== undefined) animate(nums[k], { y: [-14, 0], opacity: [0, 1], duration: 500, ease: 'outBack' });
  }
  prev = parts;
  $('.count-done').hidden = diff > 0;
}
setInterval(renderCountdown, 1000 * 15);

// ---------------------------------------------------------------- links
function updateLinks() {
  $('#directionsBtn').href = MAPS;
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: lang === 'ar' ? 'زفاف محمد المنذر وإيمان' : 'Mohammed Almonzer & Eman’s Wedding',
    dates: '20261027T160000Z/20261027T220000Z',
    details: lang === 'ar' ? 'الثلاثاء ٢٧ أكتوبر ٢٠٢٦ · الساعة ٧:٠٠ مساءً' : 'Tuesday 27 October 2026 · 7:00 PM',
    location: 'Tia Vie, Cairo, Egypt',
    ctz: 'Africa/Cairo',
  });
  $('#googleCalBtn').href = `https://calendar.google.com/calendar/render?${q}`;
}

// ---------------------------------------------------------------- message to the couple
const form = $('#msgForm'), formMsg = $('.form-msg', form), done = $('.msg-done');
const nameIn = $('#guestName'), msgIn = $('#guestMsg');
const shake = (el) => { animate(el, { x: [0, -8, 8, -5, 5, 0], duration: 400 }); el.focus(); };

// a burst of mosaic tiles from a point
function tileBurst(x, y) {
  if (reduced) return;
  const colors = ['#c4547f', '#e08fac', '#a7b86a', '#c3cf8c', '#f3ecd6', '#9c4f87'];
  const els = Array.from({ length: isSmall ? 40 : 64 }, () => {
    const d = document.createElement('div');
    d.className = 'burst-tile';
    d.style.background = colors[(Math.random() * colors.length) | 0];
    d.style.left = `${x}px`;
    d.style.top = `${y}px`;
    document.body.appendChild(d);
    return d;
  });
  animate(els, {
    x: () => utils.random(-260, 260),
    y: () => utils.random(-300, 160),
    rotate: () => utils.random(-360, 360),
    scale: [{ to: 1.4, duration: 300 }, { to: 0, duration: 900 }],
    duration: 1200, ease: 'outQuart',
    onComplete: () => els.forEach((e) => e.remove()),
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameIn.value.trim(), message = msgIn.value.trim();
  formMsg.textContent = '';
  if (!name) { formMsg.textContent = t('msg.needName'); return shake(nameIn); }
  if (!message) { formMsg.textContent = t('msg.needMsg'); return shake(msgIn); }
  const btn = $('button', form), label = $('span', btn);
  btn.disabled = true;
  label.textContent = t('msg.sending');
  try {
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, message, lang,
        client: {
          lang: navigator.language,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen: `${screen.width}×${screen.height} @${devicePixelRatio || 1}x`,
          platform: navigator.userAgentData?.platform || navigator.platform || '',
          touch: navigator.maxTouchPoints || 0,
        },
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const r = btn.getBoundingClientRect();
    tileBurst(r.left + r.width / 2, r.top + r.height / 2);
    animate(form, { opacity: [1, 0], scale: [1, .94], duration: 350, ease: 'inQuad', onComplete: () => {
      form.remove();
      $('.thanks', done).textContent = t('msg.thanks').replace('{name}', name);
      done.hidden = false;
      animate($$('.msg-done > *'), { opacity: [0, 1], y: [20, 0], duration: 900, delay: stagger(140), ease: 'outBack(1.3)' });
    } });
  } catch {
    formMsg.textContent = t('msg.error');
    btn.disabled = false;
    label.textContent = t('msg.send');
  }
});

// ---------------------------------------------------------------- start
applyLang();
// ?open skips the opener (handy for screenshots / link previews)
if (new URLSearchParams(location.search).has('open')) {
  $('.opener').remove();
  document.body.classList.remove('locked');
  setupScroll();
  utils.set('.reveal, .reveal-name', { opacity: 1 });
}

// ?snap=<section id> shows one section in its finished state (for screenshots / previews)
const snap = new URLSearchParams(location.search).get('snap');
if (snap) {
  $('.opener')?.remove();
  document.body.classList.remove('locked');
  $$('main > *').forEach((s) => { if (s.id !== snap) s.style.display = 'none'; });
  utils.set('.reveal, .reveal-name', { opacity: 1 });
  if (snap === 'evening') {
    $('.eve').style.height = '100svh';
    eveRefresh();
    $$('.draw > *').forEach((p) => { p.style.strokeDashoffset = '0'; });
    eveUpdate(.5);
  }
}
// ?og hides the controls for the link-preview capture
if (new URLSearchParams(location.search).has('og')) {
  $('.lang').style.display = 'none';
  $('.portal-cue').style.display = 'none';
}
