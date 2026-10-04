# Image Optimization

Images are compressed ahead of time with [sharp](https://sharp.pixelplumbing.com/) and committed as WebP. Nothing is resized at runtime.

## `npm run optimize-images`

Runs `scripts/optimize-images.js`, which processes three folders. The script's `config` object is the source of truth if this table drifts.

| Folder | Reads | Writes | Max width | Notes |
| --- | --- | --- | --- | --- |
| `public/images/travel/` and its trip subfolders | jpg, jpeg, png, heic | `.webp` next to each source | 1920 px | Full-size gallery photos |
| `public/images/projects/` | jpg, jpeg, png | `.webp` into `public/images/projects/optimized/` | 800 px | Card thumbnails |
| `public/images/case-studies/` | png only | `.webp` and `.jpg` next to each source | 1600 px | Text-heavy screenshots. The jpg exists because LinkedIn's link previews don't reliably render a WebP `og:image`. |

For every image the script:

- applies the EXIF orientation, so phone photos aren't sideways;
- shrinks anything wider than the folder's max width and never enlarges smaller images;
- skips files whose names contain `optimized`;
- leaves the original in place. Delete or keep the source yourself before committing.

HEIC photos are converted to a temporary PNG with macOS's `sips` first, because sharp's bundled HEIF support can't decode HEVC, which is how iPhones encode them. That step only works on macOS.

## Adding travel photos

1. Put the photos in `public/images/travel/<trip-folder>/` and run `npm run optimize-images`.
2. Add each photo to `src/data/structured/trips.json` with its URL, `width`, `height`, alt text, and caption. The gallery sizes tiles from width and height, and `node scripts/gallery-layout.test.mjs` fails when either is missing. To read them:

   ```bash
   ffprobe -v error -show_entries stream=width,height -of csv=p=0 <file>
   ```

3. Run the travel checks listed in `AGENTS.md`.

## Other generated images

- `npm run generate-profile-image -- <source-photo>` rebuilds the hero portrait's srcset (`public/images/profile-{320,460,640,920}.webp` plus a full-size fallback), cropping to a square centered on the subject.
- `npm run generate-logos` rebuilds `logo192.png`, `logo512.png`, `apple-touch-icon.png`, and `favicon-32.png` in `public/` from `public/images/logo-source.png`.

## In components

Give every image explicit `width` and `height` (or an aspect-ratio class) to avoid layout shift, use `loading="lazy"` below the fold, and keep meaningful alt text. The hero is the exception: it loads eagerly with `fetchpriority="high"` and a `srcSet`, since it's the largest contentful paint. `ImageWithLoader` adds a loading skeleton where a gallery needs one.
