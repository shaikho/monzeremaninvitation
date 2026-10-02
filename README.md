# Mohammed Almonzer & Eman · محمد المنذر وإيمان

Wedding invitation for **Tuesday 27 October 2026, 7:00 PM** at **Tia Vie, Cairo**.
Arabic first (RTL), with a one-tap switch to English. Built with **Vite** and **anime.js v4**.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (the /api routes work locally too)
npm run build      # outputs dist/
```

| Route | What it is |
|---|---|
| `/` | The invitation |
| `/messages` | Private messages from guests: sender, message, IP and location, browser details. Search and CSV export. No password. |
| `/wedding.ics` | Calendar file |
| `/api/message` | `POST {"name","message"}` saves a message |
| `/api/messages` | `GET` all messages · `?diag=1` shows which Blob credentials the deployment can see |

## The experience

1. **Mosaic opener**: a pink-and-green mosaic medallion with the M&E monogram assembles tile by tile. Tapping it shatters the tiles outward.
2. **The portal**: an arched gateway (orchid arch, cream columns, magenta wisteria, pink lilies) builds itself in. Scrolling zooms you *through* the arch.
3. **Invitation card**: sage card with a double border, quatrefoil monogram with rays, the names written in, and the date row.
4. **Countdown**: mosaic-bordered tiles that flip in.
5. **The evening**: a horizontal gallery of arched cards driven by vertical scrolling; each icon draws itself as it arrives.
6. **Venue**: an arched window that opens like a shutter, with directions and calendar buttons.
7. **Message to the couple**: a private note; on send, the form bursts into mosaic tiles.

All scroll animation uses anime.js `onScroll`. All artwork is generated SVG (`src/art.js`).

## Editing content

- **Text, both languages:** `src/i18n.js` (names, invitation wording, evening times, venue).
- **Wedding time:** `WEDDING` in `src/main.js`.
- **Calendar:** `updateLinks()` in `src/main.js` and `public/wedding.ics`.
- **Map link:** `MAPS` in `src/main.js` (currently a Google Maps search for "Tia Vie, Cairo").

## Hosting on Vercel

- Import the repo; Vercel detects Vite (`vercel.json` sets `dist` as output). `/api/*.js` become serverless functions.
- **Messages need Vercel Blob:** project → **Storage** → **Create** → **Blob** → connect it to this project (Production) → redeploy. Either connection type works (read-write token or the newer store ID + OIDC). If sending fails, open `/api/messages?diag=1`.
- **Link preview:** `public/og-invitation.jpg`, referenced with absolute URLs at the top of `index.html`, assuming the domain `monzeremaninvitation.vercel.app`. Change those URLs if your domain differs. WhatsApp caches previews per URL, so use a new file name when the image changes.

## Preview helpers

- `/?open` skips the opener.
- `/?snap=<section id>` shows one section finished (`invitation`, `countdown`, `evening`, `venue`, `message`).
- `/?open&og` is the view captured for the link preview.
