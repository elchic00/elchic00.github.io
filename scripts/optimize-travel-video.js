#!/usr/bin/env node

/**
 * Compresses a raw phone/drone video for the travel gallery and extracts a
 * poster frame, using the same targets as compress-videos.js (720p, ~500kbps,
 * silent) and optimize-images.js (1920px webp @ q85) so gallery output stays
 * consistent no matter which pipeline produced it.
 *
 * Usage:
 *   node scripts/optimize-travel-video.js <input.mov> <trip-folder> <basename> [posterSeconds]
 *   node scripts/optimize-travel-video.js ~/Downloads/IMG_1234.mov japan shibuya-crossing 1.5
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const [, , input, tripFolder, basename, posterSeconds = "1"] = process.argv;

if (!input || !tripFolder || !basename) {
  console.error(
    "Usage: node scripts/optimize-travel-video.js <input> <trip-folder> <basename> [posterSeconds]"
  );
  process.exit(1);
}

const outDir = path.join(__dirname, "../public/images/travel", tripFolder);
fs.mkdirSync(outDir, { recursive: true });

const videoOut = path.join(outDir, `${basename}.mp4`);
const posterOut = path.join(outDir, `${basename}-poster.webp`);

execSync(
  `ffmpeg -y -i "${input}" -c:v libx264 -crf 28 -preset slower ` +
    `-profile:v baseline -pix_fmt yuv420p -movflags +faststart ` +
    `-vf "scale='min(iw,1280)':'min(ih,720)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30" ` +
    `-an "${videoOut}"`,
  { stdio: "inherit" }
);

execSync(
  `ffmpeg -y -ss ${posterSeconds} -i "${input}" -vf "scale=1920:-1" -frames:v 1 -q:v 85 "${posterOut}"`,
  { stdio: "inherit" }
);

const videoKb = (fs.statSync(videoOut).size / 1024).toFixed(1);
const posterKb = (fs.statSync(posterOut).size / 1024).toFixed(1);
console.log(`\n✅ ${videoOut} (${videoKb} KB)`);
console.log(`✅ ${posterOut} (${posterKb} KB, poster/thumbnail)`);
