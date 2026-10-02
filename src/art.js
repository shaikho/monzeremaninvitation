// Procedural watercolor artwork: pink lilies, magenta wisteria, sage leaves, an arched portal
// with cream columns, a cusped quatrefoil monogram frame and a mosaic medallion.
// Palette from the reference (photo 1): lime/olive greens, orchid pinks, cream and mint.

export const P = {
  lime: '#a7b86a', limeLight: '#c3cf8c', olive: '#6d8442', deep: '#3e562b',
  mint: '#d6e6c6', mintDeep: '#bcd4a8',
  orchid: '#c27bb0', orchidLight: '#e3b0d4', orchidDeep: '#9c4f87',
  cream: '#f3ecd6', creamShade: '#ddd1b0', gold: '#b48a4a',
  lav: '#cbbcd8',
  leaf: ['#7d9255', '#8fa564', '#6c8247', '#9db170'],
  wis: ['#8a2e64', '#a8417d', '#c46a9e', '#dc97c1', '#ecc0da'],
  lily: { tip: '#f6d3e2', mid: '#e7a2c0', base: '#c76a98', streak: '#a9467c', spot: '#8e2f63' },
};

// ---------- helpers ----------
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;
const pick = (r, a) => a[Math.floor(r() * a.length)];

// shared defs: watercolor bleed filter + petal gradients (embedded in every piece so they also
// work when rasterised into <img>)
export const DEFS = `<defs>
  <filter id="wc" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation="0.35"/>
  </filter>
  <linearGradient id="petal" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="${P.lily.base}"/><stop offset=".45" stop-color="${P.lily.mid}"/><stop offset="1" stop-color="${P.lily.tip}"/>
  </linearGradient>
  <linearGradient id="petalBack" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#b9588b"/><stop offset="1" stop-color="#e9b3cb"/>
  </linearGradient>
  <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#6c8247"/><stop offset="1" stop-color="#a4b878"/>
  </linearGradient>
</defs>`;

export function asImage(svg, cls = '') {
  const vb = svg.match(/viewBox="(\S+) (\S+) (\S+) (\S+)"/);
  const sized = svg.replace('<svg ', `<svg width="${vb[3] * 2}" height="${vb[4] * 2}" `);
  return `<img class="${cls}" alt="" decoding="async" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}">`;
}

// ---------- botanicals ----------
export function leaf(x, y, ang, len, col, w = .34) {
  const L = len, W = len * w;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">
    <path d="M0 0C${f(L * .3)} ${f(-W)} ${f(L * .75)} ${f(-W * .8)} ${f(L)} 0C${f(L * .75)} ${f(W * .8)} ${f(L * .3)} ${f(W)} 0 0Z" fill="${col}" opacity=".92"/>
    <path d="M${f(L * .05)} 0Q${f(L * .5)} ${f(-W * .08)} ${f(L * .95)} 0" stroke="#e8eccd" stroke-width=".9" fill="none" opacity=".55"/>
  </g>`;
}

function petalPath(L, W) {
  return `M0 0C${f(W)} ${f(-L * .2)} ${f(W * .8)} ${f(-L * .72)} 0 ${f(-L)}C${f(-W * .8)} ${f(-L * .72)} ${f(-W)} ${f(-L * .2)} 0 0Z`;
}

// an open lily seen from the front: three back petals, three front petals, streaks, spots, stamens
export function lily(x, y, size, rot, r) {
  const L = size, W = size * .3;
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">`;
  for (const a of [0, 120, 240]) s += `<path transform="rotate(${a + 60})" d="${petalPath(L * .95, W)}" fill="url(#petalBack)" opacity=".85"/>`;
  for (const a of [0, 120, 240]) {
    s += `<g transform="rotate(${a + (r() - .5) * 10})"><path d="${petalPath(L, W * 1.08)}" fill="url(#petal)"/>`;
    s += `<path d="M0 ${f(-L * .06)}Q${f(W * .08)} ${f(-L * .45)} 0 ${f(-L * .8)}" stroke="${P.lily.streak}" stroke-width="${f(W * .14)}" stroke-linecap="round" fill="none" opacity=".5"/>`;
    for (let k = 0; k < 4; k++) s += `<circle cx="${f((r() - .5) * W * .7)}" cy="${f(-L * (.15 + r() * .35))}" r="${f(.6 + r() * .9)}" fill="${P.lily.spot}" opacity=".55"/>`;
    s += `<path d="${petalPath(L, W * 1.08)}" fill="none" stroke="#fff" stroke-width=".7" opacity=".45"/></g>`;
  }
  for (let k = 0; k < 6; k++) {
    const a = (k * 60 + 20 + (r() - .5) * 20) * Math.PI / 180, l = L * (.42 + r() * .12);
    const ex = Math.cos(a) * l, ey = Math.sin(a) * l;
    s += `<path d="M0 0Q${f(ex * .4)} ${f(ey * .6 - 4)} ${f(ex)} ${f(ey)}" stroke="#b7c27e" stroke-width=".9" fill="none"/>`;
    s += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="2.6" ry="1.3" transform="rotate(${f(a * 180 / Math.PI)} ${f(ex)} ${f(ey)})" fill="#a05a2c"/>`;
  }
  s += `<circle r="${f(W * .22)}" fill="#cfd897"/>`;
  return s + '</g>';
}

export function lilyBud(x, y, size, rot) {
  const L = size, W = size * .2;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">
    <path d="${petalPath(L, W)}" fill="url(#petalBack)"/>
    <path d="M0 0Q${f(W * .3)} ${f(-L * .5)} 0 ${f(-L * .95)}" stroke="#f3d0e0" stroke-width="1" fill="none" opacity=".7"/>
  </g>`;
}

// a hanging wisteria raceme: dense deep magenta at the top fading to pale pink at the tip
export function wisteria(x, y, len, width, r, sway = true) {
  let s = `<g class="${sway ? 'sway' : ''}" style="transform-origin:${f(x)}px ${f(y)}px">`;
  s += `<path d="M${f(x)} ${f(y)}q3 ${f(len * .45)} 0 ${f(len * .92)}" stroke="#6f6a3e" stroke-width="1" fill="none"/>`;
  const n = Math.round(len / 3.1);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const w = width * (1 - t * .78) * .5;
    const cx = x + (r() * 2 - 1) * w + Math.sin(t * 6) * 1.5;
    const cy = y + 3 + t * len;
    const rr = (width * .085) * (1 - t * .45) + 1;
    const col = P.wis[Math.min(P.wis.length - 1, Math.floor(t * P.wis.length + (r() - .5) * 1.4))] || P.wis[0];
    s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rr * 1.1)}" ry="${f(rr * .85)}" fill="${col}" opacity="${f(.75 + r() * .25)}"/>`;
  }
  return s + '</g>';
}

function blossomSpray(x, y, len, ang, r) {
  const a = ang * Math.PI / 180;
  const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
  let s = `<path d="M${f(x)} ${f(y)}Q${f((x + ex) / 2 + 6)} ${f((y + ey) / 2 - 6)} ${f(ex)} ${f(ey)}" stroke="#7a7346" stroke-width=".9" fill="none"/>`;
  for (let i = 0; i < 6; i++) {
    const t = .3 + i * .12;
    const px = x + (ex - x) * t + (r() - .5) * 8, py = y + (ey - y) * t + (r() - .5) * 8;
    const rr = 2.2 + r() * 1.6;
    for (let k = 0; k < 5; k++) {
      const pa = (k * 72) * Math.PI / 180;
      s += `<circle cx="${f(px + Math.cos(pa) * rr)}" cy="${f(py + Math.sin(pa) * rr)}" r="${f(rr * .8)}" fill="${pick(r, ['#f2bcd0', '#e9a6c2', '#f7d2df'])}"/>`;
    }
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(rr * .35)}" fill="#b45b88"/>`;
  }
  return s;
}

// a cluster of lilies, buds, leaves and blossom sprays — the reference's side bouquets
export function lilyBouquet(seed = 3, W = 300, H = 420) {
  const r = rng(seed);
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${DEFS}<g filter="url(#wc)">`;
  // stems from the bottom-left
  for (let i = 0; i < 7; i++) {
    const x2 = 70 + r() * 170, y2 = 40 + r() * 260;
    s += `<path d="M${f(10 + r() * 30)} ${H}Q${f(x2 * .4)} ${f((H + y2) / 2)} ${f(x2)} ${f(y2)}" stroke="#56693a" stroke-width="${f(1.6 + r())}" fill="none"/>`;
  }
  for (let i = 0; i < 16; i++) s += leaf(20 + r() * 150, 120 + r() * 280, -80 + r() * 140, 42 + r() * 30, pick(r, P.leaf));
  for (let i = 0; i < 5; i++) s += blossomSpray(40 + r() * 120, 140 + r() * 240, 70 + r() * 50, -60 + r() * 80, r);
  s += lily(150, 110, 78, -18, r) + lily(96, 236, 70, 12, r) + lily(186, 300, 58, 30, r);
  s += lilyBud(220, 70, 46, 28) + lilyBud(60, 120, 40, -24) + lilyBud(236, 210, 36, 52);
  for (let i = 0; i < 6; i++) s += leaf(60 + r() * 160, 150 + r() * 220, -120 + r() * 240, 30 + r() * 18, pick(r, P.leaf));
  return s + '</g></svg>';
}

// wisteria cascading from a top corner
export function wisteriaCorner(seed = 5, W = 260, H = 420) {
  const r = rng(seed);
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${DEFS}<g filter="url(#wc)">`;
  s += `<path d="M0 14Q${f(W * .5)} 4 ${W} 30" stroke="#6f6a3e" stroke-width="2" fill="none"/>`;
  s += `<path d="M10 0Q20 ${f(H * .5)} 4 ${H}" stroke="#6f6a3e" stroke-width="1.6" fill="none"/>`;
  for (let i = 0; i < 12; i++) s += leaf(10 + r() * (W - 20), 10 + r() * 50, 60 + r() * 60, 26 + r() * 14, pick(r, P.leaf));
  for (let i = 0; i < 8; i++) s += leaf(6 + r() * 30, 40 + r() * (H - 80), r() < .5 ? -20 + r() * 40 : 160 + r() * 40, 24 + r() * 14, pick(r, P.leaf));
  const drops = [[30, 300], [62, 240], [96, 200], [130, 170], [168, 130], [205, 100], [18, 360], [44, 190]];
  drops.forEach(([x, len]) => { s += wisteria(x, 16 + r() * 18, len * (H / 420), 22 + r() * 8, r, false); });
  for (let i = 0; i < 6; i++) s += blossomSpray(20 + r() * 80, 30 + r() * 120, 50, 40 + r() * 60, r);
  return s + '</g></svg>';
}

// ---------- the arched portal (hero) ----------
// returns inline SVG; parts carry ids so the scroll animation can move them
export function portal() {
  const W = 400, H = 760, cx = 200, spring = 340, R = 128;
  const opening = `M${cx - R} ${H}V${spring}A${R} ${R} 0 0 1 ${cx + R} ${spring}V${H}Z`;
  const r = rng(11);
  let hatch = '';
  for (let i = 0; i < 44; i++) {
    const x = r() * W, y = 70 + r() * 230;
    hatch += `<path d="M${f(x)} ${f(y)}l${f(8 + r() * 10)} ${f(-3 + r() * 6)}" stroke="${P.olive}" stroke-width=".8" opacity=".35"/>`;
  }
  const flutes = (x0, w) => {
    let s = '';
    for (let k = 1; k < 5; k++) s += `<path d="M${f(x0 + (w * k) / 5)} ${spring + 34}V${H - 26}" stroke="${P.creamShade}" stroke-width="1.6"/>`;
    return s;
  };
  const column = (x0, side) => `<g id="col-${side}" class="col">
      <rect x="${x0}" y="${spring + 20}" width="56" height="${H - spring - 20}" fill="${P.cream}"/>
      ${flutes(x0 + 4, 48)}
      <rect x="${x0 - 8}" y="${spring + 4}" width="72" height="22" rx="3" fill="${P.cream}" stroke="${P.creamShade}"/>
      <path d="M${x0 - 6} ${spring + 4}q10 -14 20 0M${x0 + 42} ${spring + 4}q10 -14 20 0" stroke="${P.creamShade}" stroke-width="2" fill="none"/>
      <rect x="${x0 - 10}" y="${H - 26}" width="76" height="26" fill="${P.cream}" stroke="${P.creamShade}"/>
    </g>`;
  return `<svg class="portal-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="mintGlow" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#eef5e4"/><stop offset=".6" stop-color="${P.mint}"/><stop offset="1" stop-color="${P.mintDeep}"/></radialGradient>
      <linearGradient id="limeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.limeLight}"/><stop offset="1" stop-color="${P.lime}"/></linearGradient>
      <mask id="openingMask"><rect width="${W}" height="${H}" fill="#fff"/><path d="${opening}" fill="#000"/></mask>
    </defs>
    <g id="portal-wall" mask="url(#openingMask)">
      <rect width="${W}" height="${H}" fill="url(#limeG)"/>
      ${hatch}
      <path d="M0 64H${W}" stroke="${P.olive}" stroke-width="2" opacity=".5"/>
      <path d="M0 70H${W}" stroke="${P.cream}" stroke-width="1.2" opacity=".6"/>
      <path d="M26 96L104 96L26 190Z" fill="${P.limeLight}" stroke="${P.olive}" stroke-width="1.4" opacity=".9"/>
      <path d="M${W - 26} 96L${W - 104} 96L${W - 26} 190Z" fill="${P.limeLight}" stroke="${P.olive}" stroke-width="1.4" opacity=".9"/>
      <circle cx="52" cy="124" r="6" fill="${P.orchid}" opacity=".7"/><circle cx="${W - 52}" cy="124" r="6" fill="${P.orchid}" opacity=".7"/>
    </g>
    <path d="${opening}" fill="url(#mintGlow)"/>
    <g id="arch-band" fill="none">
      <path d="M${cx - R - 30} ${spring}A${R + 30} ${R + 30} 0 0 1 ${cx + R + 30} ${spring}" stroke="${P.orchidLight}" stroke-width="14"/>
      <path d="M${cx - R - 12} ${spring}A${R + 12} ${R + 12} 0 0 1 ${cx + R + 12} ${spring}" stroke="${P.orchid}" stroke-width="22"/>
      <path d="M${cx - R - 12} ${spring}A${R + 12} ${R + 12} 0 0 1 ${cx + R + 12} ${spring}" stroke="${P.orchidDeep}" stroke-width="1.4" stroke-dasharray="6 5" opacity=".6"/>
      <path d="M${cx - R} ${spring}A${R} ${R} 0 0 1 ${cx + R} ${spring}" stroke="${P.cream}" stroke-width="3"/>
    </g>
    ${column(cx - R - 60, 'l')}
    ${column(cx + R + 4, 'r')}
  </svg>`;
}

// ---------- cusped quatrefoil frame (monogram, headings) ----------
export function quatrefoilPath(cx, cy, R) {
  const pts = [];
  for (let i = 0; i <= 360; i += 2) {
    const t = (i * Math.PI) / 180;
    const sq = 1 / Math.pow(Math.pow(Math.abs(Math.cos(t - Math.PI / 4)), 4) + Math.pow(Math.abs(Math.sin(t - Math.PI / 4)), 4), 1 / 4);
    const rr = R * sq * (1 + 0.05 * Math.cos(12 * (t - Math.PI / 4))) * .86;
    pts.push(`${f(cx + Math.cos(t) * rr)} ${f(cy + Math.sin(t) * rr)}`);
  }
  return `M${pts.join('L')}Z`;
}

export function quatrefoil(inner = '', cls = 'qf') {
  return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true">
    <path d="${quatrefoilPath(100, 100, 98)}" fill="${P.olive}"/>
    <path d="${quatrefoilPath(100, 100, 90)}" fill="${P.cream}"/>
    <path d="${quatrefoilPath(100, 100, 84)}" fill="none" stroke="${P.olive}" stroke-width="1.2"/>
    ${inner}
  </svg>`;
}

// ---------- timeline vignettes (line art) ----------
export const vignettes = {
  arrive: `<svg viewBox="0 0 120 120" aria-hidden="true"><g class="draw" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path pathLength="1" d="M28 108V58a32 32 0 0 1 64 0v50"/><path pathLength="1" d="M60 26v82"/><path pathLength="1" d="M52 70v8M68 70v8"/><path pathLength="1" d="M16 108h88"/></g></svg>`,
  zaffa: `<svg viewBox="0 0 120 120" aria-hidden="true"><g class="draw" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle pathLength="1" cx="54" cy="66" r="32"/><circle pathLength="1" cx="54" cy="66" r="25"/><path pathLength="1" d="M94 18v24l12 3v-8l-12-3"/><path pathLength="1" d="M94 42a5 4 0 1 1-5-4"/></g></svg>`,
  dinner: `<svg viewBox="0 0 120 120" aria-hidden="true"><g class="draw" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle pathLength="1" cx="60" cy="64" r="30"/><circle pathLength="1" cx="60" cy="64" r="20"/><path pathLength="1" d="M16 34v20a6 6 0 0 0 12 0V34M22 34v74"/><path pathLength="1" d="M104 34c-10 8-10 26 0 32v42"/></g></svg>`,
  cake: `<svg viewBox="0 0 120 120" aria-hidden="true"><g class="draw" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path pathLength="1" d="M26 108V84h68v24"/><path pathLength="1" d="M36 84V62h48v22"/><path pathLength="1" d="M46 62V44h28v18"/><path pathLength="1" d="M16 108h88"/><path pathLength="1" d="M60 44V32"/><path pathLength="1" d="M60 26c-4 3 4 3 0 6"/></g></svg>`,
  farewell: `<svg viewBox="0 0 120 120" aria-hidden="true"><g class="draw" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path pathLength="1" d="M48 92C22 76 16 56 28 46c9-7 18 0 20 6 2-6 11-13 20-6 12 10 6 30-20 46z"/><path pathLength="1" d="M74 98C52 84 48 68 58 60c7-6 15 0 16 5 1-5 9-11 16-5 10 8 6 24-16 38z"/></g></svg>`,
};

// ---------- mosaic medallion tiles (opener) ----------
// returns [{x, y, rot, color, ring}] laid in concentric rings like the reference's mosaic
export function mosaicTiles(R = 190, tile = 9.5) {
  const r = rng(27);
  const tiles = [];
  const pinks = ['#c4547f', '#d06a8f', '#b9467a', '#d77c9c', '#c95f88', '#e08fac'];
  const greens = ['#9fb766', '#a9c06f', '#b6cb82', '#8eab59', '#c4d595', '#95b062'];
  const pale = ['#dfe9c8', '#e9f0d7', '#d4e2b8', '#f1f5e6', '#cddcae'];
  for (let rad = R; rad > 30; rad -= tile * 1.12) {
    const n = Math.floor((2 * Math.PI * rad) / (tile * 1.12));
    const off = r() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = off + (i / n) * Math.PI * 2;
      const t = rad / R;
      let col;
      if (t > .8) col = pick(r, pinks);
      else if (t > .76) col = '#f4eedf';
      else if (t > .4) col = r() < t ? pick(r, greens) : pick(r, pale);
      else col = r() < .7 ? pick(r, pale) : pick(r, greens);
      tiles.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad, rot: (a * 180) / Math.PI + (r() - .5) * 14, color: col, t });
    }
  }
  return tiles;
}
