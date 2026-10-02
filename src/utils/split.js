// Text splitting for animation.
// Latin text can be split into letters; Arabic must never be split below the word,
// or the letters lose their joined shapes. Screen readers keep reading the full text
// through aria-label on the parent.

const isArabic = (s) => /[؀-ۿ]/.test(s);

/** Wrap each letter (Latin) or the whole text (Arabic) of `el` in span.ch. Returns the spans. */
export function splitLetters(el) {
  const text = el.textContent;
  el.textContent = '';
  if (isArabic(text)) {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = text;
    el.append(s);
    return [s];
  }
  return [...text].map((c) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = c === ' ' ? ' ' : c;
    el.append(s);
    return s;
  });
}

/** Wrap each word of `el` in span.w (spaces kept as text nodes). Returns the spans. */
export function splitWords(el) {
  const parts = el.textContent.split(/(\s+)/);
  el.textContent = '';
  const words = [];
  for (const p of parts) {
    if (!p) continue;
    if (/^\s+$/.test(p)) { el.append(p); continue; }
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = p;
    el.append(s);
    words.push(s);
  }
  return words;
}
