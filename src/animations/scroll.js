// Scroll choreography. Everything animates transform / opacity / clip-path only.
// "sync" animations are tied to scroll position; the rest play once when they enter.
import { animate, createTimeline, onScroll, stagger, utils } from 'animejs';
import { $, $$ } from '../utils/dom.js';
import { splitWords } from '../utils/split.js';

// Play once when the trigger element scrolls into view. If it has already been passed (the language was
// switched mid-page, or the page was opened partway down), jump straight to the final state,
// so nothing is ever left invisible.
function reveal(targets, params, trigger, enter = '88% top', from = null) {
  const el = typeof trigger === 'string' ? $(trigger) : trigger;
  const fraction = parseFloat(enter) / 100;
  const passed = el && el.getBoundingClientRect().top < innerHeight * fraction;
  if (from && !passed) utils.set(targets, from);
  if (passed) {
    const a = animate(targets, { ...params, autoplay: false });
    a.seek(a.duration);
    return a;
  }
  return animate(targets, { ...params, autoplay: onScroll({ target: el, enter, repeat: false }) });
}
const synced = (target, extra = {}) => onScroll({ target, sync: true, ...extra });

export function initScroll({ formatTime, formatNumber }) {
  // ── 1 · the opening slowly gives way ──────────────────────────────
  // the florals part like curtains as you leave the opening
  const leaving = { enter: 'top top', leave: 'top bottom' };
  animate('.hero-flora--tl', { translateX: ['0vw', '-14vw'], translateY: ['0vh', '-10vh'], ease: 'linear', autoplay: synced('.hero', leaving) });
  animate('.hero-flora--tr', { translateX: ['0vw', '14vw'], translateY: ['0vh', '-10vh'], ease: 'linear', autoplay: synced('.hero', leaving) });
  animate('.hero-flora--bl', { translateX: ['0vw', '-10vw'], ease: 'linear', autoplay: synced('.hero', leaving) });
  animate('.hero-flora--br', { translateX: ['0vw', '10vw'], ease: 'linear', autoplay: synced('.hero', leaving) });
  animate('.hero-copy', { translateY: [0, -90], opacity: [1, 0], ease: 'inQuad', autoplay: synced('.hero', { enter: 'top top', leave: 'top 75%' }) });
  animate('.scroll-cue', { opacity: [1, 0], ease: 'linear', autoplay: synced('.hero', { enter: 'top top', leave: 'top 25%' }) });

  // ── 2 · prologue: the tall image unveils upward, layers drift ─────
  const storyImg = $('.story-a img');
  reveal('.story-a', { clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], duration: 1700, ease: 'inOutQuart' }, '.story-a');
  reveal(storyImg, { scale: [1.3, 1], duration: 2400, ease: 'outQuart' }, '.story-a');

  $$('[data-parallax]').forEach((el) => {
    const v = parseFloat(el.dataset.parallax);
    animate(el, { translateY: [`${-v}vh`, `${v}vh`], ease: 'linear', autoplay: synced(el) });
  });

  // ── fades: present quietly as they arrive ─────────────────────────
  $$('[data-fade]').forEach((el) => {
    reveal(el, { opacity: [0, 1], translateY: [28, 0], duration: 1500, ease: 'outExpo' }, el);
  });

  // ── 3 · the invitation lights up word by word as you read ─────────
  const text = $('[data-words]');
  const words = splitWords(text);
  utils.set(words, { opacity: 0.14 });
  animate(words, {
    opacity: [0.14, 1], duration: 300, delay: stagger(70), ease: 'linear',
    autoplay: synced(text, { enter: '78% top', leave: '38% bottom' }),
  });

  // ── 4 · the evening: the date counts up into place ────────────────
  const num = $('[data-count]');
  const counter = { v: 1 };
  reveal(counter, {
    v: [1, Number(num.dataset.count)], duration: 1800, ease: 'outExpo',
    onUpdate: () => { num.textContent = formatNumber(Math.round(counter.v)); },
  }, num, '85% top');
  reveal(num.closest('.eve-num'), { opacity: [0, 1], translateY: ['18%', '0%'], duration: 1800, ease: 'outExpo' }, num, '85% top');

  // ── 5 · venue: pinned; the window opens to full bleed as you scroll ─
  createTimeline({ defaults: { ease: 'linear' }, autoplay: synced('.venue', { enter: 'top top', leave: 'bottom bottom' }) })
    .add('.venue-window', { clipPath: ['inset(22% 16% 22% 16%)', 'inset(0% 0% 0% 0%)'], duration: 1000, ease: 'inOutQuad' }, 0)
    .add('.venue-img', { scale: [1.35, 1], duration: 1400, ease: 'outQuad' }, 0)
    .add('.venue-shade', { opacity: [0, 1], duration: 500 }, 700)
    .add('.venue-copy', { opacity: [0, 1], translateY: [70, 0], duration: 600, ease: 'outQuad' }, 900)
    .add('.venue-copy', { opacity: 1, duration: 500 }, 1500); // hold, so there's time to read

  // ── 6 · schedule: rules draw in, the times roll up to the hour ─────
  $$('.sched-row').forEach((row) => {
    const t = $('.sched-time', row);
    const target = Number(t.dataset.min);
    const roll = { m: target - 90 };
    reveal(row, { '--rule': [0, 1], duration: 1400, ease: 'inOutQuart' }, row, '90% top');
    reveal(roll, {
      m: target, duration: 1600, ease: 'outExpo',
      onUpdate: () => { t.innerHTML = formatTime(Math.round(roll.m / 5) * 5); },
      onComplete: () => { t.innerHTML = formatTime(target); },
    }, row, '90% top');
    reveal([t, $('.sched-what', row)], { opacity: [0, 1], translateY: [36, 0], duration: 1400, delay: stagger(120), ease: 'outExpo' }, row, '90% top');
  });

  // ── 7 · interlude: the wisteria grows down, the bouquet blooms open ─
  reveal('.interlude .fl-raceme', { scaleY: [0, 1], duration: 2000, delay: stagger(80, { from: 'random' }), ease: 'outQuart' }, '.interlude', '80% top', { scaleY: 0 });
  reveal('.interlude-bouquet .fl-bloom', { scale: [0, 1], rotate: [-35, 0], duration: 1400, delay: stagger(40, { from: 'center' }), ease: 'outBack(1.2)' }, '.interlude-bouquet', '85% top', { scale: 0 });
  animate('.interlude-bouquet', { translateY: ['5vh', '0vh'], ease: 'linear', autoplay: synced('.interlude') });

  // ── 9 · the end: a slow pull back, then the names, like credits ───
  reveal('.ending-flora--tl, .ending-flora--tr', { opacity: [0, .92], translateY: ['-6vh', '0vh'], duration: 2200, delay: stagger(150), ease: 'outQuart' }, '.ending', '70% top');
  reveal('.ending-flora--b', { opacity: [0, .92], translateY: ['8vh', '0vh'], duration: 2200, ease: 'outQuart' }, '.ending', '70% top');
  reveal('.ending-line, .ending-tag, .ending-sign', {
    opacity: [0, 1], translateY: [30, 0], duration: 1600, delay: stagger(160), ease: 'outExpo',
  }, '.ending', '60% top');
}
