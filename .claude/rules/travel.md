---
paths:
  - "src/components/Travel/**"
  - "src/data/structured/trips.json"
  - "public/images/travel/**"
  - "scripts/gallery-layout.test.mjs"
  - "scripts/test-travel-*.mjs"
---

# Travel Rules

- Put optimized WebP photos under `public/images/travel/<trip-folder>/`.
- Keep every photo URL, alt text, and caption in `src/data/structured/trips.json`.
- Keep trip IDs stable because URL hashes and AI chat links depend on them.
- Reuse the existing gallery, lightbox, image-loading, keyboard, and reduced-motion patterns.
- If chat should mention a new destination, update `src/data/context/biography.ts` and run `npm run sync-context`.

For gallery, layout, hash, or lightbox changes, run:

```bash
node scripts/gallery-layout.test.mjs
node scripts/test-travel-hash-sync.mjs
node scripts/test-travel-lightbox-a11y.mjs
npm run build
```
