// The opening: light opens from the centre of the dark onto sage paper; the wisteria grows
// down from the corners, the leaves arrive, the lilies bloom open, then the names rise
// letter by letter and a gold rule draws in beneath them.
import { createTimeline, stagger, utils } from 'animejs';
import { $, $$ } from '../utils/dom.js';
import { splitLetters } from '../utils/split.js';

export function playIntro({ onDone }) {
  const stage = $('.hero-stage');
  const lines = $$('.names-line');
  const letters = lines.map((l) => splitLetters(l));
  const racemes = $$('.hero .fl-raceme');
  const greens = $$('.hero .fl-leaf, .hero .fl-sprig');
  const lilies = $$('.hero .fl-bloom');

  // starting states, set before the copy is shown so nothing flashes
  utils.set(stage, { clipPath: 'circle(0% at 50% 50%)' });
  utils.set(racemes, { scaleY: 0 });
  utils.set(greens, { opacity: 0 });
  utils.set(lilies, { scale: 0, rotate: -40 });
  utils.set(letters.flat(), { translateY: '115%' });
  utils.set('.hero-rule', { scaleX: 0 });
  utils.set(['.hero-kicker', '.scroll-cue', '.chrome'], { opacity: 0 });
  utils.set('.hero-copy', { opacity: 1 });

  const tl = createTimeline({ defaults: { ease: 'outExpo' }, onComplete: finish });

  tl.add(stage, { clipPath: ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'], duration: 1700, ease: 'inOutQuart' }, 150)
    .add(greens, { opacity: [0, 1], duration: 900, delay: stagger(6, { from: 'random' }), ease: 'outQuad' }, 700)
    .add(racemes, { scaleY: [0, 1], duration: 1800, delay: stagger(70, { from: 'random' }), ease: 'outQuart' }, 850)
    .add(lilies, { scale: [0, 1], rotate: [-40, 0], duration: 1300, delay: stagger(28, { from: 'random' }), ease: 'outBack(1.3)' }, 1150)
    .add('.hero-kicker', { opacity: [0, 1], translateY: [14, 0], duration: 1000 }, 1750)
    .add(letters[0], { translateY: ['115%', '0%'], duration: 1300, delay: stagger(36) }, 1900)
    .add(letters[1], { translateY: ['115%', '0%'], duration: 1300, delay: stagger(36) }, 2100)
    .add(letters[2], { translateY: ['115%', '0%'], rotate: [-12, 0], duration: 1400 }, 2500)
    .add(letters[3], { translateY: ['115%', '0%'], duration: 1300, delay: stagger(45) }, 2600)
    .add('.hero-rule', { scaleX: [0, 1], duration: 1200, ease: 'inOutQuart' }, 3000)
    .add(['.scroll-cue', '.chrome'], { opacity: [0, 1], duration: 1200, delay: stagger(140) }, 3200);

  // any tap, key or wheel during the opening jumps to its final frame
  const skip = () => { if (!tl.completed) tl.seek(tl.duration); };
  const opts = { once: true, passive: true };
  const kinds = ['pointerdown', 'keydown', 'wheel', 'touchmove'];
  kinds.forEach((t) => addEventListener(t, skip, opts));

  // safety net: if frames are throttled (low-power mode, a backgrounded tab), never leave the
  // page locked — after 7s jump to the end of the opening
  const safety = setTimeout(() => { if (!tl.completed) { tl.seek(tl.duration); finish(); } }, 7000);

  let done = false;
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(safety);
    kinds.forEach((t) => removeEventListener(t, skip));
    utils.set(stage, { clipPath: 'circle(150% at 50% 50%)' });
    onDone?.();
  }
  return tl;
}

/** No opening (reduced motion, previews): show the final frame immediately. */
export function skipIntro() {
  $$('.names-line').forEach((l) => splitLetters(l));
  utils.set('.hero-stage', { clipPath: 'circle(150% at 50% 50%)' });
  utils.set(['.hero-copy', '.hero-kicker', '.scroll-cue', '.chrome'], { opacity: 1 });
}
