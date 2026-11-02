// Rasterizes each project card SVG (public/images/projects/*.svg) into a
// 1200x630 JPEG in public/images/social/, used as the og:image / twitter:image
// for that project's case-study page (see scripts/inline-critical-css.js).
//
// Why: Discord, LinkedIn, X and Slack don't render SVG (or reliably WebP) as a
// link-preview image, so the SVG has to be shipped as a JPEG.
//
// Re-run after editing any project SVG, then commit the output:
//   npm run generate-social-images
//
// Note: text renders with whatever fonts the machine has for the SVG's
// system-ui / ui-monospace stacks, so run it on the machine you design on.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const projects = require("../src/data/structured/projects.json");

const SRC_DIR = path.join(__dirname, "../public/images/projects");
const OUT_DIR = path.join(__dirname, "../public/images/social");
const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 88;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Only internal case-study pages get a static route (and so a preview).
  const caseStudies = projects.filter(
    (p) => p.link.startsWith("/projects/") && p.image.endsWith(".svg")
  );

  for (const project of caseStudies) {
    const src = path.join(__dirname, "../public", project.image);
    const out = path.join(OUT_DIR, `${project.id}.jpg`);

    // Render at full card height, then grow the sides by copying the SVG's
    // edge pixels so its dark gradient background fills the 1.9:1 frame.
    const card = await sharp(src, { density: 300 })
      .resize({ height: HEIGHT })
      .png()
      .toBuffer({ resolveWithObject: true });

    const padTotal = WIDTH - card.info.width;
    const padLeft = Math.floor(padTotal / 2);

    await sharp(card.data)
      .extend({
        left: padLeft,
        right: padTotal - padLeft,
        extendWith: "copy",
      })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(out);

    console.log(`✅ ${path.relative(process.cwd(), out)} (${WIDTH}x${HEIGHT})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
