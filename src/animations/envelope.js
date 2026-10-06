// The envelope: a sealed M & E envelope on the dark. One tap (or Enter / Space) breaks the
// seal, the flap folds back, the card rises out while lilies, blossoms and leaves spill out
// of the mouth and drift down like petals, and the whole scene dissolves into the
// opening. The same tap is the gesture that lets the music start.
import { animate, createTimeline, stagger, utils } from 'animejs';
import { $, $$ } from '../utils/dom.js';

export function showEnvelope({ onOpen, onDone }) {
  const root = $('#envelope');
  // a slow breathing float while it waits
  const idle = animate('.env', { translateY: [0, -8], duration: 2600, ease: 'inOutSine', loop: true, alternate: true });
  const glow = animate('.env-seal', { scale: [1, 1.06], duration: 1300, ease: 'inOutSine', loop: true, alternate: true });
  // (the envelope itself only fades in: its translateY belongs to the float)
  animate(['.env-kicker', '.env-hint'], { opacity: [0, 1], translateY: [18, 0], duration: 1400, delay: (_, i) => 200 + i * 360, ease: 'outExpo' });
  animate('.env', { opacity: [0, 1], duration: 1400, delay: 380, ease: 'outQuad' });

  let opened = false;
  function open() {
    if (opened) return;
    opened = true;
    root.removeEventListener('click', open);
    root.removeEventListener('keydown', onKey);
    onOpen?.();
    idle.pause();
    glow.pause();

    // every loose flower gets its own path: a fan of directions out of the envelope's mouth,
    // handed out in shuffled order so neighbours in the stagger fly apart
    const items = $$('.burst-item', root);
    const w = $('.env', root).offsetWidth;
    const order = utils.shuffle(items.map((_, i) => i));
    const paths = items.map((_, i) => {
      const k = order[i] / Math.max(1, items.length - 1);          // 0…1 across the fan
      const angle = (-78 + k * 156 + utils.random(-8, 8)) * Math.PI / 180;
      const dist = w * utils.random(.5, 1.15, 2);
      return {
        x: Math.sin(angle) * dist * 1.1,
        y: -Math.cos(angle) * dist - w * .08,
        spin: utils.random(-200, 200),
        fall: utils.random(70, 150),
        drift: utils.random(-30, 30),
        scale: utils.random(.8, 1.15, 2),
      };
    });

    const tl = createTimeline({ defaults: { ease: 'outExpo' }, onComplete: finish });
    tl.add(['.env-hint', '.env-kicker'], { opacity: 0, duration: 400 }, 0)
      .add('.env-seal', { scale: [1.06, 1.25], duration: 220, ease: 'outQuad' }, 0)
      .add('.env-seal', { scale: 0, opacity: 0, rotate: 30, duration: 420, ease: 'inBack(1.6)' }, 220)
      .add('.env-flora', { opacity: 0, duration: 400 }, 200)
      .add('.env-flap', { rotateX: [0, 180], duration: 900, ease: 'inOutQuart' }, 420)
      // once the flap has folded past upright it sits behind the card
      .call(() => utils.set('.env-flap', { zIndex: 1 }), 870)
      .add('.env-card', { translateY: ['0%', '-62%'], duration: 1100, ease: 'inOutCubic' }, 1000)
      // the flowers spill out of the mouth and open into the air…
      .add(items, {
        x: { from: 0, to: (_, i) => paths[i].x },
        y: { from: w * .06, to: (_, i) => paths[i].y },
        rotate: { from: 0, to: (_, i) => paths[i].spin },
        scale: { from: .25, to: (_, i) => paths[i].scale },
        opacity: { from: 0, to: 1, duration: 260, ease: 'outQuad' },
        duration: 1500, ease: 'outCubic', delay: stagger(24),
      }, 1050)
      // …then drift down like petals while the envelope dissolves beneath them
      .add(items, {
        x: (_, i) => paths[i].x + paths[i].drift,
        y: (_, i) => paths[i].y + paths[i].fall,
        rotate: (_, i) => paths[i].spin * 1.35,
        opacity: 0,
        duration: 1300, ease: 'inQuad', delay: stagger(18),
      }, 2650)
      // the flowers are out: lift them above the paper, which then fades as a single piece
      .call(() => utils.set('.env-burst', { zIndex: 8 }), 2480)
      .add('.env-body', { opacity: 0, scale: [1, 1.06], duration: 900, ease: 'inQuad' }, 2500)
      .add(root, { opacity: [1, 0], duration: 650, ease: 'linear' }, 3550);
  }
  function finish() {
    root.remove();
    onDone?.();
  }
  const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
  root.addEventListener('click', open);
  root.addEventListener('keydown', onKey);
  root.focus({ preventScroll: true });
}

/** Previews and reduced motion: no envelope. */
export function removeEnvelope() {
  $('#envelope')?.remove();
}
