// Soft background music, never autoplayed: it starts on the guest's first tap (or the Sound
// button) and fades in. Routed through Web Audio so the fade also works on iOS, where
// HTMLMediaElement.volume is read-only.
const TARGET = 0.55;

export function createMusic(src) {
  let el, ctx, gain, playing = false, pauseTimer;

  function setup() {
    if (el) return;
    el = new Audio(src);
    el.loop = true;
    el.preload = 'auto';
    el.playsInline = true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      try {
        ctx = new AC();
        gain = ctx.createGain();
        gain.gain.value = 0;
        ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination);
      } catch { ctx = null; gain = null; }
    }
    if (!gain) el.volume = 0;
    // pause with the tab, resume when the guest comes back
    document.addEventListener('visibilitychange', () => {
      if (!playing) return;
      if (document.hidden) el.pause();
      else { ctx?.resume(); el.play().catch(() => {}); }
    });
  }

  function fade(to, seconds) {
    if (gain && ctx) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(to, now + seconds);
    } else if (el) {
      const from = el.volume, start = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - start) / (seconds * 1000));
        el.volume = from + (to - from) * k;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  return {
    get playing() { return playing; },
    play() {
      setup();
      clearTimeout(pauseTimer);
      // play() has to be called inside the tap for iOS
      const p = el.play();
      ctx?.resume();
      playing = true;
      fade(TARGET, 3);
      return p && p.catch ? p.catch(() => { playing = false; }) : Promise.resolve();
    },
    pause() {
      if (!el) return;
      playing = false;
      fade(0, 0.8);
      pauseTimer = setTimeout(() => el.pause(), 850);
    },
  };
}
