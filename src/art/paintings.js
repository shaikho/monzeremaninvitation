// Painted panels: the three "photographs" of the site (prologue ×2, venue), generated from the
// same lilies, wisteria and leaves as the rest of the florals, set against a paneled sage wall
// with a fluted pilaster, like the reference invitation.
//
// They are rendered once to high-resolution images by tools/paint.html (see tools/README.md),
// so they can be blurred, shadowed and lit without costing anything while the page scrolls.
import { parts } from './flora.js';

const { P, f, rng, defs, leaf, lily, blossom, raceme, sprig, nextId } = parts;

// ── the wall ─────────────────────────────────────────────────────────
function wallDefs(id) {
  return `
    <linearGradient id="${id}wall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eeecdd"/><stop offset=".45" stop-color="#dcdcc6"/><stop offset="1" stop-color="#bfc1a7"/>
    </linearGradient>
    <linearGradient id="${id}pil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#c3c5ab"/><stop offset=".35" stop-color="#f1f0e4"/><stop offset=".6" stop-color="#e2e2cf"/><stop offset="1" stop-color="#b3b59a"/>
    </linearGradient>
    <linearGradient id="${id}shaft" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffdf2" stop-opacity=".55"/><stop offset=".6" stop-color="#fffdf2" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="${id}vig" cx=".45" cy=".42" r=".8">
      <stop offset=".45" stop-color="#3b3e28" stop-opacity="0"/><stop offset="1" stop-color="#2f331f" stop-opacity=".42"/>
    </radialGradient>
    <filter id="${id}far" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="${id}mid" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
    <filter id="${id}sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="7" dy="12" stdDeviation="10" flood-color="#2a2e1b" flood-opacity=".38"/>
    </filter>
    <filter id="${id}grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .21  0 0 0 0 .14  0 0 0 .07 0"/></filter>`;
}

/** A raised-and-recessed molding frame. */
function frame(x, y, w, h, inset = 14) {
  const lit = '#faf9ef', dark = 'rgba(70,74,50,.28)';
  const r = (dx, dy, dw, dh, stroke, sw) => `<rect x="${f(dx)}" y="${f(dy)}" width="${f(dw)}" height="${f(dh)}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>`;
  return r(x - 1.5, y - 1.5, w, h, lit, 3) + r(x + 1.5, y + 1.5, w, h, dark, 3)
    + r(x + inset + 1.5, y + inset + 1.5, w - inset * 2, h - inset * 2, lit, 2.4) + r(x + inset - 1.2, y + inset - 1.2, w - inset * 2, h - inset * 2, dark, 2.4)
    + `<rect x="${f(x + inset)}" y="${f(y + inset)}" width="${f(w - inset * 2)}" height="${f(h - inset * 2)}" fill="#ffffff" opacity=".06"/>`;
}

/** A fluted pilaster with a capital and base. */
function pilaster(id, x, w, h) {
  let s = `<rect x="${f(x)}" y="0" width="${f(w)}" height="${f(h)}" fill="url(#${id}pil)"/>`;
  const flutes = 5, gap = w / (flutes + 1);
  for (let i = 1; i <= flutes; i++) {
    const fx = x + gap * i;
    s += `<rect x="${f(fx - 4)}" y="${f(h * .1)}" width="8" height="${f(h * .8)}" rx="4" fill="rgba(70,74,50,.13)"/>`;
    s += `<rect x="${f(fx + 2)}" y="${f(h * .1)}" width="2" height="${f(h * .8)}" rx="1" fill="#fbfaf0" opacity=".7"/>`;
  }
  for (const [y0, hh, out] of [[h * .045, h * .02, 10], [h * .07, h * .012, 6], [h * .9, h * .012, 6], [h * .915, h * .025, 12]]) {
    s += `<rect x="${f(x - out)}" y="${f(y0)}" width="${f(w + out * 2)}" height="${f(hh)}" fill="url(#${id}pil)"/>`;
    s += `<rect x="${f(x - out)}" y="${f(y0 + hh - 2)}" width="${f(w + out * 2)}" height="2" fill="rgba(70,74,50,.25)"/>`;
  }
  // its shadow on the wall
  s += `<rect x="${f(x + w)}" y="0" width="${f(w * .35)}" height="${f(h)}" fill="url(#${id}pil)" opacity="0"/>`;
  s += `<linearGradient id="${id}ps" x1="0" x2="1"><stop offset="0" stop-color="#2f331f" stop-opacity=".22"/><stop offset="1" stop-color="#2f331f" stop-opacity="0"/></linearGradient>`;
  s += `<rect x="${f(x + w)}" y="0" width="${f(w * .4)}" height="${f(h)}" fill="url(#${id}ps)"/>`;
  return s;
}

function wall(id, w, h, { panels = [], pil = null }) {
  let s = `<rect width="${w}" height="${h}" fill="url(#${id}wall)"/>`;
  for (const p of panels) s += frame(...p);
  if (pil) s += pilaster(id, pil[0], pil[1], h);
  s += `<polygon points="0,0 ${f(w * .7)},0 ${f(w * .15)},${f(h)} 0,${f(h)}" fill="url(#${id}shaft)"/>`;
  return s;
}
const finish = (id, w, h) => `<rect width="${w}" height="${h}" fill="url(#${id}vig)"/><rect width="${w}" height="${h}" filter="url(#${id}grain)"/>`;

// ── flowers ──────────────────────────────────────────────────────────
/** A closed lily bud on a short stem. */
function bud(x, y, len, ang, tone) {
  const c1 = tone === 'pink' ? P.lilyPinkDeep : P.lilyThroat, c2 = tone === 'pink' ? P.lilyPinkTip : P.lilyWhite;
  const g = nextId();
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">
    <linearGradient id="${g}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <path d="M0 0L0 ${f(-len * .35)}" stroke="${P.stem}" stroke-width="2"/>
    <path d="M0 ${f(-len * .3)}C${f(len * .16)} ${f(-len * .5)} ${f(len * .12)} ${f(-len * .85)} 0 ${f(-len)}C${f(-len * .12)} ${f(-len * .85)} ${f(-len * .16)} ${f(-len * .5)} 0 ${f(-len * .3)}Z" fill="url(#${g})" stroke="${tone === 'pink' ? '#b9708c' : '#d9cfb3'}" stroke-width=".8"/>
    <path d="M0 ${f(-len * .34)}L0 ${f(-len * .96)}" stroke="#ffffff" stroke-width="1" opacity=".5"/></g>`;
}

/**
 * A spilling cluster: leaves radiating, wisteria trailing below, lilies and buds at the heart.
 * (cx, cy) is the heart, s the scale, drop how far the racemes trail (×s).
 */
function spill(id, cx, cy, s, r, { lilies = 6, drop = 1, spread = 1, racemes = 8, tilt = 0 } = {}) {
  let o = '';
  // greenery behind, mostly falling
  for (let i = 0; i < 22; i++) {
    const a = 180 + tilt + (r() - .5) * 230 * spread;
    o += leaf(id, cx + (r() - .5) * 40 * s, cy + (r() - .5) * 30 * s, (70 + r() * 70) * s, (14 + r() * 7) * s, a, i % 3 === 0);
  }
  for (let i = 0; i < 9; i++) o += sprig(id, cx, cy, (110 + r() * 120) * s, 90 + tilt + (r() - .5) * 200 * spread, r);
  // wisteria trailing down
  for (let i = 0; i < racemes; i++) {
    const x = cx + ((i / Math.max(1, racemes - 1)) - .5) * 210 * s * spread + (r() - .5) * 20 * s;
    o += raceme(x, cy + (20 + r() * 40) * s, (170 + r() * 230) * s * drop, (r() - .5) * 40 * s + tilt * 1.5, r);
  }
  // buds reaching out
  for (let i = 0; i < 3; i++) o += bud(cx + (r() - .5) * 150 * s, cy - (40 + r() * 50) * s, (44 + r() * 20) * s, (r() - .5) * 90, i % 2 ? 'pink' : 'white');
  // small blossoms tucked among the greenery, behind the lilies
  for (let i = 0; i < 18; i++) {
    const a = r() * Math.PI * 2, d = (70 + r() * 120) * s;
    o += blossom(cx + Math.cos(a) * d * 1.15, cy + Math.sin(a) * d * .9, (6 + r() * 5) * s, r);
  }
  // lilies at the heart, biggest in front
  const spots = [];
  for (let i = 0; i < lilies; i++) {
    const a = (i / lilies) * Math.PI * 2 + r() * .6, d = i === 0 ? 0 : (55 + r() * 45) * s * spread;
    spots.push([cx + Math.cos(a) * d * 1.2, cy + Math.sin(a) * d * .8, (i === 0 ? 112 : 70 + r() * 34) * s, i % 3 === 1 ? 'white' : (i % 2 ? 'pink' : 'white')]);
  }
  spots.reverse().forEach(([x, y, size, tone]) => { o += lily(id, x, y, size, (r() - .5) * 90, tone, r); });
  // a few blossoms drifting just outside the lilies
  for (let i = 0; i < 6; i++) {
    const a = r() * Math.PI * 2, d = (150 + r() * 60) * s;
    o += blossom(cx + Math.cos(a) * d * 1.1, cy + Math.sin(a) * d * .9, (6 + r() * 4) * s, r);
  }
  // a few leaves in front
  for (let i = 0; i < 5; i++) o += leaf(id, cx + (r() - .5) * 120 * s, cy + (30 + r() * 40) * s, (60 + r() * 40) * s, (12 + r() * 5) * s, 160 + (r() - .5) * 120, i % 2);
  return o;
}

/** Soft, out-of-focus wisteria in the distance. */
function farRacemes(id, x0, x1, y, n, len, r) {
  let o = `<g filter="url(#${id}far)" opacity=".55">`;
  for (let i = 0; i < n; i++) o += raceme(x0 + (i / Math.max(1, n - 1)) * (x1 - x0), y + r() * 30, len * (.6 + r() * .6), (r() - .5) * 30, r);
  return o + '</g>';
}

const svg = (w, h, id, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>${wallDefs(id)}</defs>${defs(id)}${body}${finish(id, w, h)}</svg>`;

// ── the three panels ─────────────────────────────────────────────────

/** Prologue, the tall image: a paneled wall, a pilaster, lilies spilling from the top. 600×880. */
export function paneled(seed = 41) {
  const r = rng(seed), id = nextId(), W = 600, H = 880;
  let b = wall(id, W, H, { panels: [[46, 60, 330, 360], [46, 470, 330, 360]], pil: [430, 104] });
  b += farRacemes(id, 300, 580, -10, 6, 380, r);
  b += `<g filter="url(#${id}mid)" opacity=".85">${spill(id, 470, 700, .55, r, { lilies: 3, drop: .5, racemes: 4 })}</g>`;
  b += `<g filter="url(#${id}sh)">${spill(id, 200, 190, 1.25, r, { lilies: 6, drop: 1.25, racemes: 9, tilt: 10 })}</g>`;
  return svg(W, H, id, b);
}

/** Prologue, the small image: a cascade falling from the top right, like the reference. 600×920. */
export function trail(seed = 52) {
  const r = rng(seed), id = nextId(), W = 600, H = 920;
  let b = wall(id, W, H, { panels: [[200, 70, 330, 780]], pil: [40, 110] });
  b += farRacemes(id, 20, 260, 0, 5, 420, r);
  b += `<g filter="url(#${id}sh)">${spill(id, 360, 210, 1.3, r, { lilies: 6, drop: 1.4, racemes: 9, tilt: -8 })}</g>`;
  b += `<g filter="url(#${id}sh)">${spill(id, 250, 640, .75, r, { lilies: 4, drop: .8, racemes: 5, spread: .9 })}</g>`;
  return svg(W, H, id, b);
}

/**
 * The venue: an alcove in full bloom, shown full-bleed (cropped by object-fit). On a phone the
 * visible band is around x 7–53%, so the heart of the composition sits there. 1000×1000.
 */
export function alcove(seed = 63) {
  const r = rng(seed), id = nextId(), W = 1000, H = 1000;
  let b = wall(id, W, H, { panels: [[70, 80, 380, 840], [700, 80, 260, 840]], pil: [540, 120] });
  b += farRacemes(id, 560, 980, -20, 9, 460, r);
  b += farRacemes(id, 40, 420, -20, 6, 300, r);
  // wisteria garland across the top
  b += `<g filter="url(#${id}sh)">`;
  for (let i = 0; i < 30; i++) b += leaf(id, i * 34 + r() * 20, 8 + r() * 30, 50 + r() * 40, 12 + r() * 5, 130 + r() * 100, i % 3 === 0);
  for (let i = 0; i < 22; i++) b += raceme(10 + i * 46 + (r() - .5) * 26, 6 + r() * 34, 110 + Math.pow(r(), .7) * 380 * (.6 + .4 * Math.abs(Math.sin(i * .9))), (r() - .5) * 34, r);
  for (let i = 0; i < 5; i++) b += lily(id, 90 + i * 210 + (r() - .5) * 60, 30 + r() * 30, 46 + r() * 18, (r() - .5) * 90, i % 2 ? 'pink' : 'white', r);
  b += '</g>';
  b += `<g filter="url(#${id}mid)" opacity=".9">${spill(id, 820, 560, .8, r, { lilies: 4, drop: .8, racemes: 5 })}</g>`;
  b += `<g filter="url(#${id}sh)">${spill(id, 300, 420, 1.7, r, { lilies: 7, drop: 1.1, racemes: 10, spread: 1.1 })}</g>`;
  b += `<g filter="url(#${id}sh)">${spill(id, 140, 860, 1.25, r, { lilies: 4, drop: .4, racemes: 3, tilt: -30 })}</g>`;
  return svg(W, H, id, b);
}

/** The venue on a phone: the same alcove, composed for a tall screen. 700×1300. */
export function alcoveTall(seed = 74) {
  const r = rng(seed), id = nextId(), W = 700, H = 1300;
  let b = wall(id, W, H, { panels: [[50, 90, 400, 1110]], pil: [510, 110] });
  b += farRacemes(id, 420, 690, -20, 6, 420, r);
  b += `<g filter="url(#${id}sh)">`;
  for (let i = 0; i < 24; i++) b += leaf(id, i * 30 + r() * 16, 6 + r() * 26, 40 + r() * 34, 10 + r() * 4, 130 + r() * 100, i % 3 === 0);
  for (let i = 0; i < 16; i++) b += raceme(10 + i * 45 + (r() - .5) * 22, 6 + r() * 28, 90 + Math.pow(r(), .7) * 300 * (.6 + .4 * Math.abs(Math.sin(i * .9))), (r() - .5) * 30, r);
  for (let i = 0; i < 4; i++) b += lily(id, 70 + i * 185 + (r() - .5) * 40, 26 + r() * 24, 38 + r() * 14, (r() - .5) * 90, i % 2 ? 'pink' : 'white', r);
  b += '</g>';
  b += `<g filter="url(#${id}mid)" opacity=".9">${spill(id, 590, 820, .55, r, { lilies: 3, drop: .7, racemes: 4 })}</g>`;
  b += `<g filter="url(#${id}sh)">${spill(id, 270, 440, 1.05, r, { lilies: 7, drop: 1.25, racemes: 9 })}</g>`;
  b += `<g filter="url(#${id}sh)">${spill(id, 120, 1120, .85, r, { lilies: 4, drop: .4, racemes: 3, tilt: -30 })}</g>`;
  return svg(W, H, id, b);
}
