export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const params = new URLSearchParams(location.search);
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

// localStorage can throw (private mode, blocked storage): never let that break the page
export const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
