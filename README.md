# Mohammed Almonzer & Eman · محمد المنذر وإيمان

A cinematic, editorial wedding microsite for **Tuesday 27 October 2026, 8:00 PM** at **Tia Vie hall, Cairo**.
English and Arabic (one tap to switch). Built with **Vite**, plain **JavaScript/HTML/CSS** and **Anime.js v4**.

```bash
npm install
npm run dev        # http://localhost:5173 — the /api routes work locally too
npm run build      # outputs dist/ for Vercel
npm run preview    # serves dist/ (static only: /api needs `npm run dev` or Vercel)
```

## The experience

1. **Opening.** Light opens from the centre of the dark onto sage paper. Generated florals grow in: wisteria racemes unfurl down from the top corners, leaves arrive, white and pink lilies bloom open, and sprays rise at the bottom. Then the names rise letter by letter (*Mohammed / Almonzer / & Eman*) over a gold rule. Any tap skips to the end. Scrolling away parts the florals like curtains.
2. **Bismillah.** The Basmala in gold and the verse from Ar-Rum (30:21) as printed on the invitation, with an English rendering in English mode.
3. **Prologue.** Overlapping, asymmetric lily imagery from image 1, with *Two families, one story.*
4. **The invitation.** The four families, the invitation line lighting up word by word, the formal names (م. محمد المنذر و إيمان) and the date line, all as worded on the printed card.
5. **The evening.** A monumental **27** that counts up into place, plus a quiet days / hours / minutes countdown.
6. **The venue.** Pinned: a small window opens to full bleed as you scroll, then *Tia Vie*, directions and calendar links. "Venue location" opens the hall's exact pin (from the QR code on the printed card).
7. **The order of the evening.** 8:00 PM reception · 9:00 PM the zaffa · 10:00 PM dinner · 12:00 AM the jertig, as large numerals that roll up to each hour.
8. **Interlude.** A curtain of wisteria grows down, and a bouquet of lilies blooms open.
9. **A word from you.** A private message to the couple.
10. **The end.** The florals return, glowing on deep green, with the names like closing credits.

The flowers are generated SVG (`src/art/flora.js`, modeled on image 1's lilies, wisteria and leaves). Change a composition's seed in `index.html` (`data-flora="cascade:3"`) to get a different arrangement.

**Music:** `public/audio/evening.mp3` is an original, soft piano-and-pad loop (58 s) composed for the site. It never autoplays: it fades in on the guest's first tap, and the **Sound** button turns it on or off. To use a different song, replace that file and keep the name.

Animation touches only `transform`, `opacity` and `clip-path`. Scroll scenes use Anime.js `onScroll`. With `prefers-reduced-motion`, everything is simply shown.

## Palette

Sampled from image **1**, the arched lily invitation, as CSS variables at the top of `src/styles/main.css`:

| Variable | Color | From |
|---|---|---|
| `--color-paper` / `--color-sage` | `#dfe0cb` / `#bcbea6` | the sage paper and arch |
| `--color-leaf` / `--color-ink` | `#64674d` / `#33371f` | the leaves (deepest green is the text color) |
| `--color-plum` / `--color-magenta` | `#511f2a` / `#853d4f` | the wisteria (magenta is the accent) |
| `--color-pink` / `--color-blush` | `#cb9496` / `#e5c2bf` | wisteria tips and pink lilies |
| `--color-gold` | `#8f7850` | the gold rules |
| `--color-night` | `#23271a` | deep leaf green, for the dark scenes |

## Images

`public/images/` holds three crops of image 1 (`lilies-side`, `lilies-top`, `lilies-low`), each as `.webp` plus a `.jpg` fallback, used in the prologue and the venue. To use real wedding photographs, drop them in and update the `<picture>` sources in `index.html`.

## Editing content

- **All text, both languages, and the schedule:** `src/content.js`.
- **Date / venue / map link:** `EVENT` in `src/content.js`. The calendar file is `public/wedding.ics`.
- **Link preview:** `public/og-bloom.jpg` (1200×630), referenced with absolute URLs at the top of `index.html` (domain `monzeremaninvitation.vercel.app`). To recapture it, open `/?og` at 1200×630. WhatsApp caches previews per URL, so give a new image a new file name.

## Messages (kept from the previous version)

| Route | What it is |
|---|---|
| `/messages` | Private messages from guests (sender, message, IP and location, browser), with search and CSV export. No password. |
| `/api/message` | `POST {"name","message"}` saves a message |
| `/api/messages` | `GET` all messages · `?diag=1` shows which Blob credentials the deployment can see |

On Vercel, messages are stored in **Vercel Blob**: project → **Storage** → **Blob** → connect it to this project (Production) → redeploy. Locally they go to `data/messages.json`.

## Preview helpers

- `/?snap=<section id>` shows one finished section (`story`, `invitation`, `evening`, `venue`, `schedule`, `bloom`, `note`, `ending`).
- `/?lang=ar` or `/?lang=en` picks the language.
- `/?og` is the frame captured for the link preview.
