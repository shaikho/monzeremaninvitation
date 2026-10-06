# Painted panels

The three "photographs" in the site (`public/images/lilies-side`, `lilies-top`, `lilies-low` and
the phone version `lilies-low-tall`) are generated artwork, drawn in `src/art/paintings.js` from
the same lilies, wisteria and leaves as the rest of the florals, on a paneled sage wall.

They are rendered once to `.webp` + `.jpg` so the blur, shadows and grain cost nothing while
the page scrolls. To change one and render it again:

1. `npm run dev`
2. Preview a panel at `http://localhost:5173/tools/paint.html?p=paneled` (or `trail`, `alcove`, `alcoveTall`).
3. Screenshot the page at the panel's size, at 1.3–2× device scale, into `public/images/`:

| panel        | file              | size (CSS px) | scale |
|--------------|-------------------|---------------|-------|
| `paneled`    | `lilies-side`     | 600 × 880     | 1.6×  |
| `trail`      | `lilies-top`      | 600 × 920     | 1.3×  |
| `alcove`     | `lilies-low`      | 1000 × 1000   | 2×    |
| `alcoveTall` | `lilies-low-tall` | 700 × 1300    | 1.8×  |

Change a composition's `seed` for a different arrangement of the same elements.
