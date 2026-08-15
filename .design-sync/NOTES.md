# PetResona design-sync — notes

## Repo shape

This is a Next.js **app**, not a publishable component library — `package.json` has no `main`/`module`/`exports`. The converter runs in **synth-from-src** mode (`--entry ./src/index.ts`, a path that doesn't exist — only used so `PKG_DIR` resolves correctly to the repo root via the directory-walk; the real component discovery comes from scanning `src/components/`).

## Scope: `src/components/` only, not `src/sections/`

`src/sections/` (formerly `src/components/site/`) holds page-specific compositions for the one PetResona landing page (Header, HeroSection, ModelSection, GiorgiaSection, etc.) — these import `next/image`/`next/link`, which pull in Next.js's internal runtime (`process.env.__NEXT_*` reads) that crashes with `ReferenceError: process is not defined` when bundled standalone via esbuild outside a real Next.js app. They were moved out of `src/components/` specifically so the design-sync converter's directory walk (`cfg.srcDir: "src/components"`) doesn't pull them into the synthesized bundle entry — `componentSrcMap: null` per-component does NOT prevent this, because the synth entry is `export * from every src file under srcDir`, independent of which names get exposed. If new page sections are added, put them in `src/sections/`, not `src/components/`.

## CSS: compiled, not source

`cfg.cssEntry` points at `design-assets/static/chunks/compiled.css` — a **copy of Next's own compiled Tailwind output** (`.next/static/chunks/*.css` after `npm run build`), not `src/app/globals.css` (which is raw `@import "tailwindcss"` — unprocessed, ships zero utility CSS to designs). Font files similarly copied from `.next/static/media/*.woff2` into `design-assets/static/media/`.

**Re-sync risk**: `design-assets/static/chunks/compiled.css` and its font files go stale the moment site styles change and nobody re-runs `npm run build` + re-copies. Before any re-sync: `npm run build`, then `cp .next/static/chunks/*.css design-assets/static/chunks/compiled.css` and `cp .next/static/media/*.woff2 design-assets/static/media/` (media files may also need pruning of ones no longer referenced — harmless if stale ones linger, just unused bytes).

## Default exports break `export *`

`HowItWorks` and `ScrollExpandMedia` were `export default` — `export * from "path"` (used by the synth entry) does not re-export default exports, so they were invisible on `window.PetResona`. Converted both to named exports at the source. **Any new component in `src/components/` must use a named export**, not `export default`, or it silently won't appear in the DS bundle.

## Playwright version pin

The render check needs a Chromium binary matching the installed `playwright-core` version. This environment's cached Chromium is revision `1194`, which corresponds to `playwright-core@1.56.1` — NOT the latest. If a re-sync's render check fails with "Executable doesn't exist", either match this pin (`npm i playwright-core@1.56.1 playwright@1.56.1` inside `.ds-sync/`) or check `~/.cache` / `$PLAYWRIGHT_BROWSERS_PATH` for what's actually cached and match that.

## Known render warns

None outstanding — `bad: 0, thin: 0, variantsIdentical: 0` on the shipped build.

## Scope of authored previews

Only `Badge` got an authored preview (`.design-sync/previews/Badge.tsx`) — it rendered too small/blank on the floor card. The other 9 unauthored components ship the honest floor card (`Preview not yet authored`) — real usage docs are in each `.prompt.md`, fully importable regardless. Authoring more previews (Accordion composition, Calendar with a selected date, Pricing with real copy, etc.) is a good next increment on any future sync — nothing here blocks it.

## Re-sync risks

- **compiled.css / fonts go stale** — see above, most likely thing to silently drift.
- **New page sections must go in `src/sections/`, not `src/components/`** — the boundary is enforced by convention/`cfg.srcDir`, not by tooling; a new file dropped into `src/components/` that imports `next/image`/`next/link` will reproduce the `process is not defined` crash for the WHOLE bundle (shared entry), not just itself.
- **Default exports** — same risk in reverse: a new `src/components/*.tsx` file using `export default` silently won't appear in the synced DS, no error surfaced by the converter (it just won't be in the `window.PetResona` export list — check `[BUNDLE_EXPORT]` before trusting a clean validate).
