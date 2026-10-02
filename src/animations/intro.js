// The opening: a hairline of light splits the dark, opens like a curtain onto the image
// (which pulls back from a deep zoom), then the names rise letter by letter.
import { createTimeline, stagger, utils } from 'animejs';
import { $, $$ } from '../utils/dom.js';
import { splitLetters } from '../utils/split.js';

export function playIntro({ onDone }) {
  const frame = $('.hero-frame');
  const img = $('.hero-img');
  const lqip = $('.hero-lqip');
  const lines = $$('.names-line');
  const letters = lines.map((l) => splitLetters(l));

  // starting states (set before the copy becomes visible, so nothing flashes)
  utils.set(frame, { clipPath: 'inset(50% 50% 50% 50%)' });
  utils.set(img, { scale: 1.9, opacity: img.complete ? 1 : 0 });
  utils.set(letters.flat(), { translateY: '115%' });
  utils.set(['.hero-kicker', '.hero-date', '.scroll-cue', '.chrome'], { opacity: 0 });
  utils.set('.hero-copy', { opacity: 1 });

  // the sharp image fades in over its blurred placeholder as soon as it's decoded
  const showImg = () => utils.set(img, { opacity: 1 });
  if (img.complete) showImg(); else img.addEventListener('load', showImg, { once: true });

  const tl = createTimeline({
    defaults: { ease: 'outExpo' },
    onComplete: finish,
  });

  tl.add(frame, { clipPath: ['inset(50% 50% 50% 50%)', 'inset(0% 49.7% 0% 49.7%)'], duration: 900, ease: 'inOutQuart' }, 200)
    .add(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1500, ease: 'inOutQuart' }, 950)
    .add(img, { scale: [1.9, 1.06], duration: 3000, ease: 'outQuart' }, 200)
    .add(lqip, { opacity: [1, 0], duration: 1200 }, 1600)
    .add('.hero-kicker', { opacity: [0, 1], translateY: [14, 0], duration: 1000 }, 1700)
    .add(letters[0], { translateY: ['115%', '0%'], duration: 1300, delay: stagger(38) }, 1850)
    .add(letters[1], { translateY: ['115%', '0%'], duration: 1300, delay: stagger(38) }, 2050)
    .add(letters[2], { translateY: ['115%', '0%'], rotate: [-12, 0], duration: 1400 }, 2450)
    .add(letters[3], { translateY: ['115%', '0%'], duration: 1300, delay: stagger(45) }, 2550)
    .add(['.hero-date', '.scroll-cue', '.chrome'], { opacity: [0, 1], duration: 1200, delay: stagger(140) }, 3150);

  // any tap, key or wheel during the opening jumps to its final frame
  const skip = () => { if (!tl.completed) tl.seek(tl.duration); };
  const opts = { once: true, passive: true };
  ['pointerdown', 'keydown', 'wheel', 'touchmove'].forEach((t) => addEventListener(t, skip, opts));

  // safety net: if frames are throttled (low-power mode, a backgrounded tab), never leave the
  // page locked — after 7s jump to the end of the opening
  const safety = setTimeout(() => { if (!tl.completed) { tl.seek(tl.duration); finish(); } }, 7000);

  let done = false;
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(safety);
    ['pointerdown', 'keydown', 'wheel', 'touchmove'].forEach((t) => removeEventListener(t, skip));
    // leave clean inline styles behind for the scroll animations that take over
    utils.set(frame, { clipPath: 'inset(0% 0% 0% 0%)' });
    utils.set(lqip, { opacity: 0 });
    onDone?.();
  }
  return tl;
}

/** No opening (reduced motion, previews): show the final frame immediately. */
export function skipIntro() {
  $$('.names-line').forEach((l) => splitLetters(l));
  utils.set(['.hero-copy', '.hero-kicker', '.hero-date', '.scroll-cue', '.chrome'], { opacity: 1 });
  utils.set('.hero-lqip', { opacity: 0 });
  utils.set('.hero-img', { scale: 1.06, opacity: 1 });
}
