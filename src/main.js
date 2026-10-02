import { animate, createScope, stagger } from 'animejs';
import './styles/main.css';
import { EVENT, SCHEDULE, I18N } from './content.js';
import * as flora from './art/flora.js';
import { $, $$, params, reducedMotion, isDesktop, store } from './utils/dom.js';
import { splitLetters } from './utils/split.js';
import { createMusic } from './audio.js';
import { playIntro, skipIntro } from './animations/intro.js';
import { initScroll } from './animations/scroll.js';

const root = document.documentElement;
// every visit starts at the opening
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);
root.classList.add('js');

// Preview helpers: ?snap=<section id> shows one finished section; ?og is the link-preview frame.
const snap = params.get('snap');
const og = params.has('og');
const staticMode = reducedMotion || snap !== null || og;
if (staticMode) root.classList.add('static');
if (snap) $$('main > section').forEach((s) => { if (s.id !== snap) s.style.display = 'none'; });
if (og) root.classList.add('og');

// ── language ─────────────────────────────────────────────────────────
const qsLang = params.get('lang');
let lang = qsLang === 'ar' || qsLang === 'en' ? qsLang : store.get('me-lang') || 'en';
const t = (k) => I18N[lang][k] ?? I18N.en[k] ?? '';

function applyLanguage() {
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('meta.title');
  $$('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
    el.hidden = el.textContent === ''; // e.g. the verse translation, English only
  });
  const names = `${t('hero.first')} ${t('hero.second')} ${t('hero.and')} ${t('hero.bride')}`;
  $('[data-names]').setAttribute('aria-label', names);
  $('.ending-names').setAttribute('aria-label', names);
  $('[data-count]').textContent = formatNumber(27);
  buildSchedule();
  updateLinks();
  renderCountdown();
}

const formatNumber = (n) => (lang === 'ar' ? String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n));

// ── schedule ─────────────────────────────────────────────────────────
function formatTime(min) {
  const m = ((min % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60), mm = String(m % 60).padStart(2, '0');
  const h12 = h24 % 12 || 12;
  if (lang === 'ar') {
    const digits = (s) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
    return `${digits(`${h12}:${mm}`)}<small>${h24 < 12 ? 'ص' : 'م'}</small>`;
  }
  return `${h12}:${mm}<small>${h24 < 12 ? 'AM' : 'PM'}</small>`;
}
function buildSchedule() {
  $('.sched-list').innerHTML = SCHEDULE.map(({ min, key }) => `
    <li class="sched-row">
      <span class="sched-time" data-min="${min}">${formatTime(min)}</span>
      <span class="sched-what">${t(key)}</span>
    </li>`).join('');
}

// ── countdown ────────────────────────────────────────────────────────
function renderCountdown() {
  const diff = Math.max(0, EVENT.start - Date.now());
  const parts = { days: Math.floor(diff / 864e5), hours: Math.floor(diff / 36e5) % 24, minutes: Math.floor(diff / 6e4) % 60 };
  const fmt = (n) => n.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { minimumIntegerDigits: 2, useGrouping: false });
  for (const [k, v] of Object.entries(parts)) $(`[data-cd="${k}"]`).textContent = fmt(v);
  $('.cd-until').textContent = diff === 0 ? t('eve.done') : t('eve.until');
}
setInterval(renderCountdown, 30_000);

// ── calendar & maps ──────────────────────────────────────────────────
const utc = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
function updateLinks() {
  $('#mapsLink').href = EVENT.maps;
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: lang === 'ar' ? 'زفاف محمد المنذر وإيمان' : 'Mohammed Almonzer & Eman’s Wedding',
    dates: `${utc(EVENT.start)}/${utc(EVENT.end)}`,
    details: t('venue.when'),
    location: EVENT.venue,
    ctz: 'Africa/Cairo',
  });
  $('#gcalLink').href = `https://calendar.google.com/calendar/render?${q}`;
}

// ── the chrome follows the tone of the section beneath it ────────────
function watchChromeTone() {
  const sections = $$('main > section');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const s = e.target;
      const tone = (isDesktop() && s.dataset.toneDesktop) || s.dataset.tone;
      root.dataset.chrome = tone === 'dark' ? 'dark' : 'light';
    }
  }, { rootMargin: '0px 0px -94% 0px' });
  sections.forEach((s) => io.observe(s));
}

// ── music ────────────────────────────────────────────────────────────
const music = createMusic('/audio/evening.mp3');
const soundBtn = $('#soundBtn');
let soundChosen = false; // once the guest uses the button, their choice wins
const syncSoundBtn = () => soundBtn.setAttribute('aria-pressed', String(music.playing));
soundBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  soundChosen = true;
  if (music.playing) music.pause(); else music.play().then(syncSoundBtn);
  syncSoundBtn();
});
// the first deliberate tap anywhere starts the music softly (a scroll does not)
function firstTap(e) {
  if (soundChosen || music.playing || e.target.closest('.chrome, input, textarea')) return;
  if (staticMode && !reducedMotion) return;
  music.play().then(syncSoundBtn);
  syncSoundBtn();
  removeEventListener('click', firstTap);
}
addEventListener('click', firstTap);

// ── message to the couple ────────────────────────────────────────────
function initForm() {
  const form = $('#noteForm');
  const status = $('.note-status');
  const btn = $('.note-send', form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), message = form.message.value.trim();
    status.textContent = '';
    if (!name) { status.textContent = t('msg.needName'); return form.name.focus(); }
    if (!message) { status.textContent = t('msg.needMsg'); return form.message.focus(); }
    btn.disabled = true;
    $('span', btn).textContent = t('msg.sending');
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
      const thanks = $('.note-thanks');
      $('.note-thanks-title', thanks).textContent = t('msg.thanks').replace('{name}', name);
      await animate(form, { opacity: 0, translateY: -16, duration: 500, ease: 'inQuad' });
      form.hidden = true;
      thanks.hidden = false;
      animate(thanks.children, { opacity: [0, 1], translateY: [24, 0], duration: 1400, delay: stagger(160), ease: 'outExpo' });
    } catch {
      status.textContent = t('msg.error');
      btn.disabled = false;
      $('span', btn).textContent = t('msg.send');
    }
  });
}

// ── boot ─────────────────────────────────────────────────────────────
// generated florals: data-flora="<composition>:<seed>"
function renderFlora() {
  $$('[data-flora]').forEach((el) => {
    const [name, seed, long] = el.dataset.flora.split(':');
    el.innerHTML = flora[name](Number(seed), { long: Number(long) || 1 });
  });
}

let scope = null;
function startScrollScene() {
  if (staticMode) return;
  scope = createScope().add(() => initScroll({ formatTime, formatNumber }));
}

$('#langBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  lang = lang === 'ar' ? 'en' : 'ar';
  store.set('me-lang', lang);
  scope?.revert();
  applyLanguage();
  $$('.names-line').forEach((l) => splitLetters(l));
  startScrollScene();
});

renderFlora();
applyLanguage();
initForm();
watchChromeTone();

if (staticMode) {
  skipIntro();
  document.body.classList.remove('is-intro');
} else {
  playIntro({
    onDone() {
      document.body.classList.remove('is-intro');
      startScrollScene();
    },
  });
}
