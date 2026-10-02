// Generated florals in the spirit of image "1": white and pink lilies, hanging plum-to-pink
// wisteria racemes, dark lance leaves, small pink blossoms and fine sprigs.
// Everything is SVG markup. Animatable parts carry classes:
//   .fl-leaf  .fl-sprig  .fl-raceme (grows from its top)  .fl-bloom (opens from its centre)

const P = {
  plum: '#511f2a', wine: '#6e2a40', magenta: '#8f3d5a', rose: '#b35f7e', pink: '#cb9496', blush: '#e5c2bf',
  leafDeep: '#2f331f', leaf: '#4b5236', leafMid: '#64674d', leafLight: '#8a8d6c', vein: '#a9ac8c',
  lilyWhite: '#f6f2e6', lilyCream: '#ece5cf', lilyThroat: '#d8d39a',
  lilyPinkDeep: '#c25f80', lilyPink: '#e7a6bc', lilyPinkTip: '#f6dbe3',
  anther: '#8a4a2a', stem: '#4b5236',
};

let uid = 0;
const f = (n) => Math.round(n * 10) / 10;
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const mix = (a, b, t) => {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16)), pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

// ── gradients shared inside one <svg> ────────────────────────────────
function defs(id) {
  return `<defs>
    <linearGradient id="${id}lw" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.lilyThroat}"/><stop offset=".28" stop-color="${P.lilyCream}"/><stop offset="1" stop-color="${P.lilyWhite}"/></linearGradient>
    <linearGradient id="${id}lp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.lilyPinkDeep}"/><stop offset=".55" stop-color="${P.lilyPink}"/><stop offset="1" stop-color="${P.lilyPinkTip}"/></linearGradient>
    <linearGradient id="${id}lf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.leafDeep}"/><stop offset="1" stop-color="${P.leafMid}"/></linearGradient>
    <linearGradient id="${id}lf2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.leaf}"/><stop offset="1" stop-color="${P.leafLight}"/></linearGradient>
  </defs>`;
}

// ── parts ────────────────────────────────────────────────────────────
function leaf(id, x, y, len, w, ang, light = false) {
  return `<g class="fl-leaf" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">
    <path d="M0 0C${f(w)} ${f(-len * .3)} ${f(w * .75)} ${f(-len * .72)} 0 ${f(-len)}C${f(-w * .75)} ${f(-len * .72)} ${f(-w)} ${f(-len * .3)} 0 0Z" fill="url(#${id}${light ? 'lf2' : 'lf'})"/>
    <path d="M0 ${f(-len * .04)}Q${f(w * .12)} ${f(-len * .5)} 0 ${f(-len * .94)}" stroke="${P.vein}" stroke-width=".7" fill="none" opacity=".55"/>
  </g>`;
}

function lily(id, x, y, size, rot, tone, r) {
  const fill = tone === 'pink' ? `url(#${id}lp)` : `url(#${id}lw)`;
  const edge = tone === 'pink' ? '#b9708c' : '#d9cfb3';
  const rib = tone === 'pink' ? '#f4cfdb' : '#ffffff';
  const petal = (L, W, a, back) => {
    const sway = (r() - .5) * 8;
    return `<g transform="rotate(${f(a + sway)})"><path d="M0 0C${f(-W * .95)} ${f(-L * .22)} ${f(-W * .7)} ${f(-L * .78)} ${f(W * .08)} ${f(-L)}C${f(W * .62)} ${f(-L * .74)} ${f(W * .9)} ${f(-L * .22)} 0 0Z" fill="${fill}" stroke="${edge}" stroke-width=".7" ${back ? 'opacity=".9"' : ''}/>
      <path d="M0 ${f(-L * .08)}Q${f(W * .1)} ${f(-L * .5)} ${f(W * .05)} ${f(-L * .9)}" stroke="${rib}" stroke-width="${f(Math.max(.8, W * .08))}" fill="none" opacity=".7"/>
      ${tone === 'pink' ? Array.from({ length: 5 }, (_, k) => `<circle cx="${f((r() - .5) * W * .5)}" cy="${f(-L * (.15 + k * .07))}" r="${f(W * .04 + .4)}" fill="${P.magenta}" opacity=".55"/>`).join('') : ''}</g>`;
  };
  const L = size, W = size * .34;
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><g class="fl-bloom"><g transform="scale(1 .82)">`;
  for (let k = 0; k < 3; k++) s += petal(L * .96, W * 1.05, 60 + k * 120, true);
  for (let k = 0; k < 3; k++) s += petal(L, W, k * 120, false);
  // stamens and pistil
  for (let k = 0; k < 6; k++) {
    const a = (k * 60 + 30 + (r() - .5) * 20) * Math.PI / 180, l = L * (.52 + r() * .12);
    const ex = Math.cos(a) * l, ey = Math.sin(a) * l;
    s += `<path d="M0 0Q${f(ex * .4)} ${f(ey * .6)} ${f(ex)} ${f(ey)}" stroke="#cfd39a" stroke-width=".9" fill="none"/><ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(size * .05)}" ry="${f(size * .022)}" transform="rotate(${f(a * 57.3)} ${f(ex)} ${f(ey)})" fill="${P.anther}"/>`;
  }
  s += `<circle r="${f(size * .06)}" fill="#c9cf8e"/></g></g></g>`;
  return s;
}

function blossom(x, y, rad, r) {
  const c = r() < .5 ? P.pink : P.blush, mid = r() < .5 ? P.magenta : P.rose;
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(r() * 72)})"><g class="fl-bloom">`;
  for (let k = 0; k < 5; k++) {
    const a = k * 72 * Math.PI / 180;
    s += `<ellipse cx="${f(Math.cos(a) * rad * .62)}" cy="${f(Math.sin(a) * rad * .62)}" rx="${f(rad * .58)}" ry="${f(rad * .44)}" transform="rotate(${k * 72} ${f(Math.cos(a) * rad * .62)} ${f(Math.sin(a) * rad * .62)})" fill="${c}"/>`;
  }
  return s + `<circle r="${f(rad * .3)}" fill="${mid}"/></g></g>`;
}

// a hanging wisteria / foxglove raceme: a full, tapering cone of florets, deep plum at the top
// opening to pink at the tip, irregular like the real thing
function raceme(x, y, len, sway, r) {
  const ex = x + sway, ey = y + len;
  let s = `<g class="fl-raceme" style="transform-origin:${f(x)}px ${f(y)}px">`;
  s += `<path d="M${f(x)} ${f(y)}Q${f(x + sway * .2)} ${f(y + len * .55)} ${f(ex)} ${f(ey)}" stroke="${P.stem}" stroke-width="1.1" fill="none"/>`;
  const tones = [P.plum, P.wine, P.magenta, P.rose, P.pink, P.blush];
  const n = Math.max(12, Math.round(len / 3.6));
  for (let i = 0; i < n; i++) {
    const t = .04 + (i / n) * .96;
    const width = 10 * Math.pow(1 - t, .75) + 1.4;
    const px = x + sway * (t * t * .8 + t * .2) + (r() - .5) * 2 * width;
    const py = y + len * t + (r() - .5) * 3;
    const rad = 3.6 * (1 - t) + 1.7 + r() * 1.3;
    const k = Math.min(tones.length - 1, Math.max(0, Math.round(t * 4.2 + (r() - .5) * 1.6)));
    const rot = (r() - .5) * 120;
    s += `<g transform="translate(${f(px)} ${f(py)}) rotate(${f(rot)})"><ellipse rx="${f(rad)}" ry="${f(rad * .78)}" fill="${tones[k]}"/><ellipse cx="${f(rad * .25)}" cy="${f(-rad * .2)}" rx="${f(rad * .5)}" ry="${f(rad * .32)}" fill="${P.blush}" opacity="${f(.22 + t * .25)}"/></g>`;
  }
  return s + '</g>';
}

// a fine sprig: thin stem, small alternating leaves, pink buds at the tip
function sprig(id, x, y, len, ang, r) {
  const a = ang * Math.PI / 180;
  const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
  const bend = (r() - .5) * len * .25;
  const cx = (x + ex) / 2 + Math.cos(a + 1.57) * bend, cy = (y + ey) / 2 + Math.sin(a + 1.57) * bend;
  let s = `<g class="fl-sprig"><path d="M${f(x)} ${f(y)}Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}" stroke="${P.leafMid}" stroke-width=".8" fill="none"/>`;
  const n = Math.round(len / 14);
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1), u = 1 - t;
    const px = u * u * x + 2 * u * t * cx + t * t * ex, py = u * u * y + 2 * u * t * cy + t * t * ey;
    s += leaf(id, px, py, 9 + r() * 5, 3, ang + 90 + (i % 2 ? 50 : -50), true);
  }
  for (let k = 0; k < 3; k++) s += `<circle cx="${f(ex + (r() - .5) * 8)}" cy="${f(ey + (r() - .5) * 8)}" r="${f(1.8 + r() * 1.6)}" fill="${r() < .5 ? P.rose : P.pink}"/>`;
  return s + '</g>';
}

// ── compositions ─────────────────────────────────────────────────────

/** A cascade anchored in the top-left corner (mirror with CSS for the right). viewBox 440×760. */
export function cascade(seed = 1, { long = 1 } = {}) {
  const r = rng(seed), id = `fl${uid++}`;
  let s = `<svg viewBox="0 0 440 760" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="flora">${defs(id)}`;
  // greenery hugging the corner
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    const x = 10 + t * 300, y = 14 + Math.sin(t * 3) * 18 + (1 - t) * 30;
    s += leaf(id, x, y, 48 + r() * 40, 11 + r() * 5, 120 + t * 60 + (r() - .5) * 40);
  }
  for (let i = 0; i < 8; i++) s += leaf(id, 14 + r() * 30, 40 + i * 34, 44 + r() * 30, 10 + r() * 4, 150 + (r() - .5) * 60, i % 2);
  for (let i = 0; i < 6; i++) s += sprig(id, 60 + r() * 120, 60 + r() * 80, 70 + r() * 70, 10 + r() * 70, r);
  // hanging racemes
  const hangs = [[36, 96, 300], [84, 130, 230], [138, 104, 360], [206, 80, 200], [256, 70, 280], [318, 52, 170], [176, 150, 150]];
  for (const [x, y, len] of hangs) s += raceme(x, y, len * long * (.85 + r() * .25), (r() - .5) * 26, r);
  // front leaves
  for (let i = 0; i < 9; i++) s += leaf(id, 60 + r() * 220, 90 + r() * 90, 40 + r() * 34, 10 + r() * 4, 180 + (r() - .5) * 120, i % 3 === 0);
  // lilies and blossoms
  s += lily(id, 92, 108, 74, -20, 'pink', r);
  s += lily(id, 190, 168, 80, 15, 'white', r);
  s += lily(id, 300, 86, 52, 40, 'pink', r);
  s += lily(id, 52, 236, 46, -60, 'white', r);
  for (let i = 0; i < 16; i++) s += blossom(40 + r() * 300, 60 + r() * 220, 5 + r() * 4, r);
  return s + '</svg>';
}

/** A spray rising from the bottom-left corner. viewBox 360×360. */
export function spray(seed = 7) {
  const r = rng(seed), id = `fl${uid++}`;
  let s = `<svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="flora">${defs(id)}`;
  for (let i = 0; i < 12; i++) s += leaf(id, 20 + r() * 150, 350 - r() * 40, 60 + r() * 60, 12 + r() * 5, -50 + r() * 110, i % 3 === 0);
  for (let i = 0; i < 6; i++) s += sprig(id, 30 + r() * 120, 340, 90 + r() * 110, -100 + r() * 70, r);
  s += lily(id, 92, 250, 70, 10, 'white', r);
  s += lily(id, 190, 292, 52, -30, 'pink', r);
  for (let i = 0; i < 10; i++) s += blossom(30 + r() * 220, 200 + r() * 140, 5 + r() * 4, r);
  return s + '</svg>';
}

/** A wisteria curtain: a dense garland band with lilies and racemes of varied length. viewBox 1000×520. */
export function curtain(seed = 11, { count: n = 16 } = {}) {
  const r = rng(seed), id = `fl${uid++}`;
  let s = `<svg viewBox="0 0 1000 520" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="flora">${defs(id)}`;
  for (let i = 0; i < n; i++) {
    const x = 24 + (i / (n - 1)) * 952 + (r() - .5) * 26;
    const len = 130 + Math.abs(Math.sin(i * 1.7)) * 150 + r() * 110;
    s += raceme(x, 34 + r() * 26, len, (r() - .5) * 26, r);
  }
  for (let layer = 0; layer < 2; layer++) for (let i = 0; i < 34; i++) s += leaf(id, i * 30 + r() * 20, 10 + layer * 24 + r() * 14, 34 + r() * 30, 9 + r() * 4, 130 + r() * 100, (i + layer) % 3 === 0);
  for (let i = 0; i < 8; i++) s += sprig(id, r() * 1000, 30, 50 + r() * 50, 40 + r() * 100, r);
  for (let i = 0; i < 6; i++) s += lily(id, 70 + i * 172 + (r() - .5) * 40, 30 + r() * 26, 38 + r() * 14, (r() - .5) * 80, i % 2 ? 'pink' : 'white', r);
  for (let i = 0; i < 18; i++) s += blossom(r() * 1000, 20 + r() * 50, 4 + r() * 3, r);
  return s + '</svg>';
}

/** A round bouquet of lilies with racemes trailing below. viewBox 600×760. */
export function bouquet(seed = 21) {
  const r = rng(seed), id = `fl${uid++}`;
  const cx = 300, cy = 300;
  let s = `<svg viewBox="0 0 600 760" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="flora">${defs(id)}`;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * 360 + (r() - .5) * 10;
    s += leaf(id, cx, cy, 150 + r() * 70, 18 + r() * 8, a, i % 4 === 0);
  }
  for (let i = 0; i < 10; i++) s += sprig(id, cx, cy, 170 + r() * 90, -170 + r() * 160, r);
  for (let i = 0; i < 7; i++) s += raceme(cx - 150 + i * 50 + (r() - .5) * 20, cy + 60 + r() * 40, 150 + r() * 160, (r() - .5) * 30, r);
  const lilies = [[0, 0, 110, 'white'], [-110, -40, 92, 'pink'], [108, -52, 96, 'pink'], [-60, 90, 86, 'white'], [80, 96, 84, 'white'], [0, -120, 78, 'white'], [-150, 60, 64, 'pink'], [156, 52, 66, 'white']];
  for (const [dx, dy, size, tone] of lilies) s += lily(id, cx + dx, cy + dy, size, (r() - .5) * 90, tone, r);
  for (let i = 0; i < 28; i++) {
    const a = r() * Math.PI * 2, d = 60 + r() * 150;
    s += blossom(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .9, 6 + r() * 5, r);
  }
  return s + '</svg>';
}

/** A single leafy branch with a few blossoms, for small accents. viewBox 200×420. */
export function branch(seed = 31) {
  const r = rng(seed), id = `fl${uid++}`;
  let s = `<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="flora">${defs(id)}`;
  s += `<path d="M150 415Q90 260 120 20" stroke="${P.stem}" stroke-width="1.6" fill="none"/>`;
  for (let i = 0; i < 12; i++) {
    const t = i / 12, y = 400 - t * 370, x = 150 - Math.sin(t * 2.4) * 46;
    s += leaf(id, x, y, 44 + r() * 26, 11 + r() * 4, (i % 2 ? 60 : -60) + (r() - .5) * 20, i % 3 === 0);
  }
  s += raceme(118, 40, 150, -10, r);
  for (let i = 0; i < 5; i++) s += blossom(100 + r() * 60, 60 + r() * 120, 5 + r() * 3, r);
  return s + '</svg>';
}
