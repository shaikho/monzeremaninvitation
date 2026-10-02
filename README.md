# Mohammed Almonzer & Eman · محمد المنذر وإيمان

A cinematic, editorial wedding microsite for **Tuesday 27 October 2026, 7:00 PM** at **Tia Vie, Cairo**.
English and Arabic (one tap to switch). Built with **Vite**, plain **JavaScript/HTML/CSS** and **Anime.js v4**.

```bash
npm install
npm run dev        # http://localhost:5173 — the /api routes work locally too
npm run build      # outputs dist/ for Vercel
npm run preview    # serves dist/ (static only: /api needs `npm run dev` or Vercel)
```

## The experience

1. **Opening.** A hairline of light splits the dark and opens like a curtain onto the bloom while the image pulls back from a deep zoom. The names rise letter by letter: *Mohammed / Almonzer / & Eman*. Any tap skips to the end. On desktop it becomes an editorial split: the names cut across a tall image plate.
2. **Prologue.** Overlapping, asymmetric imagery: a tall plate unveils upward, the lilies drift at a different speed, with *Two families, one story.*
3. **The invitation.** One large paragraph that lights up word by word as you read.
4. **The evening.** A monumental **27** that counts up into place, plus a quiet days / hours / minutes countdown.
5. **The venue.** Pinned: a small window opens to full bleed as you scroll, then *Tia Vie*, directions and calendar links fade in.
6. **The order of the evening.** Large numerals that roll up to each hour, with rules drawing in.
7. **In print.** The two printed invitations drift past each other.
8. **A word from you.** A private message to the couple, as a quiet, underlined editorial form.
9. **The end.** A slow pull-back on the bloom, then the names like closing credits.

**Music:** `public/audio/evening.mp3` is an original, soft piano-and-pad loop (58 s) composed for the site. It never autoplays: it fades in on the guest's first tap, and the **Sound** button turns it on or off. To use a different song, replace that file and keep the name.

Animation touches only `transform`, `opacity` and `clip-path`. Scroll scenes use Anime.js `onScroll`. With `prefers-reduced-motion`, everything is simply shown.

## Palette

Sampled from image **1** (`public/images/1.jpg`, the couple's floral invitation), as CSS variables at the top of `src/styles/main.css`:

| Variable | Color | From |
|---|---|---|
| `--color-paper` | `#ebdfd3` | the card's paper |
| `--color-blush` / `--color-rose` | `#d3ada6` / `#b68d8a` | petals |
| `--color-mauve` | `#6c4546` | petal shadows (accent) |
| `--color-ink` | `#35301d` | the script ink (text) |
| `--color-gold` | `#9a7440` | the monogram |
| `--color-night` | `#2a1d1e` | petal shadow deepened to a film black |

## Images

`public/images/`, each as `.webp` plus a `.jpg` fallback. Blurred placeholders are in `src/data/lqip.json`.

- `1`: the floral invitation (the primary, palette-setting image). `2`: the arched lily invitation.
- `flora-*` and `lilies-*`: crops from those two artworks, clear of their printed lettering.

To use real wedding photographs instead, drop them into `public/images/` and update the `<picture>` sources in `index.html` (and `IMAGES` in `src/content.js`).

## Editing content

- **All text, both languages, and the schedule:** `src/content.js`.
- **Date / venue / map link:** `EVENT` in `src/content.js`. The calendar file is `public/wedding.ics`.
- **Link preview:** `public/og-film.jpg` (1200×630), referenced with absolute URLs at the top of `index.html` (domain `monzeremaninvitation.vercel.app`). To recapture it, open `/?og` at 1200×630. WhatsApp caches previews per URL, so give a new image a new file name.

## Messages (kept from the previous version)

| Route | What it is |
|---|---|
| `/messages` | Private messages from guests (sender, message, IP and location, browser), with search and CSV export. No password. |
| `/api/message` | `POST {"name","message"}` saves a message |
| `/api/messages` | `GET` all messages · `?diag=1` shows which Blob credentials the deployment can see |

On Vercel, messages are stored in **Vercel Blob**: project → **Storage** → **Blob** → connect it to this project (Production) → redeploy. Locally they go to `data/messages.json`.

## Preview helpers

- `/?snap=<section id>` shows one finished section (`story`, `invitation`, `evening`, `venue`, `schedule`, `paper`, `note`, `ending`).
- `/?lang=ar` or `/?lang=en` picks the language.
- `/?og` is the frame captured for the link preview.
