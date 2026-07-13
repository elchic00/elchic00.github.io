// Regenerates the hero profile image srcset (320/460/640/920 + full-size
// fallback) from a single source photo. Crops to a square, centered on the
// subject via sharp's attention strategy.
//
// Usage: node scripts/generate-profile-image.js <path-to-source-image>
const sharp = require("sharp");
const path = require("path");

const SIZES = [320, 460, 640, 920];
const OUT_DIR = path.join(__dirname, "../public/images");
const QUALITY = 85;

async function main() {
  const src = process.argv[2];
  if (!src) {
    console.error("Usage: node scripts/generate-profile-image.js <source-image>");
    process.exit(1);
  }

  const image = sharp(src).rotate();

  for (const size of SIZES) {
    const outPath = path.join(OUT_DIR, `profile-${size}.webp`);
    await image
      .clone()
      .resize(size, size, { fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: QUALITY })
      .toFile(outPath);
    console.log(`✅ ${outPath}`);
  }

  const fallbackPath = path.join(OUT_DIR, "profile.webp");
  await image
    .clone()
    .resize(1200, 1200, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: QUALITY })
    .toFile(fallbackPath);
  console.log(`✅ ${fallbackPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
