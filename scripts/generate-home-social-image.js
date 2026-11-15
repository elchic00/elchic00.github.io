// Renders the site-wide link-preview card (public/images/social/home.jpg,
// 1200x630) used as og:image / twitter:image for every page that doesn't have
// its own case-study card: the homepage, /projects, /travel, and so on.
//
// Why: the previous preview was the square WebP headshot, which crawlers crop
// unpredictably (and some don't render WebP at all). This card puts the name
// and the hero line on the image so it still reads at thumbnail size.
//
// Re-run after changing the hero copy or the profile photo, then commit the output:
//   npm run generate-home-social-image
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const PUBLIC_DIR = path.join(__dirname, "../public");
const OUT = path.join(PUBLIC_DIR, "images/social/home.jpg");
const WIDTH = 1200;
const HEIGHT = 630;

const asDataUrl = (file, type) =>
  `data:${type};base64,${fs.readFileSync(path.join(PUBLIC_DIR, file)).toString("base64")}`;

const html = `<!doctype html>
<html><head><style>
  @font-face {
    font-family: "Poppins";
    font-weight: 700;
    src: url(${asDataUrl("fonts/poppins-700-latin.woff2", "font/woff2")}) format("woff2");
  }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden;
    display: flex; align-items: center; gap: 64px; padding: 0 80px;
    background:
      radial-gradient(circle at 85% 20%, rgba(34, 211, 238, 0.14), transparent 45%),
      radial-gradient(circle at 10% 100%, rgba(99, 102, 241, 0.14), transparent 50%),
      #020617;
    font-family: Inter, system-ui, sans-serif; color: #fff;
  }
  .text { flex: 1; }
  .kicker {
    font-size: 20px; font-weight: 600; letter-spacing: 0.24em;
    text-transform: uppercase; color: #fde68a; margin-bottom: 28px;
  }
  h1 { font-family: Poppins, sans-serif; font-size: 54px; line-height: 1.08; letter-spacing: -0.01em; }
  .footer { margin-top: 36px; font-size: 24px; color: #94a3b8; }
  .footer b { color: #67e8f9; font-weight: 600; }
  img {
    width: 340px; height: 340px; object-fit: cover; border-radius: 28px;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15);
  }
</style></head><body>
  <div class="text">
    <p class="kicker">Andrew Alagna · Software engineer</p>
    <h1>Accessible web interfaces used by millions. Self&#8209;hosted AI, built at home.</h1>
    <p class="footer">American Express · NYC · <b>elchic00.github.io</b></p>
  </div>
  <img src="${asDataUrl("images/profile-640.webp", "image/webp")}" alt="" />
</body></html>`;

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    await page.screenshot({ path: OUT, type: "jpeg", quality: 88 });
    console.log(`✅ ${path.relative(process.cwd(), OUT)} (${WIDTH}x${HEIGHT})`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
