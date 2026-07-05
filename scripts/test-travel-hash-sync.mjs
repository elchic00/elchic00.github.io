import puppeteer from "puppeteer";

const targetTrip = "ecuador-2024";
const firstTrip = "japan-2024";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForHash(page, expectedHash, timeout = 3000) {
  await page.waitForFunction(
    (hash) => window.location.hash === hash,
    { timeout },
    expectedHash
  );
}

async function main() {
  let viteServer;
  let baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    const { createServer } = await import("vite");
    viteServer = await createServer({
      logLevel: "error",
      server: {
        host: "127.0.0.1",
        port: 4173,
        strictPort: false,
        open: false,
      },
    });
    await viteServer.listen();
    baseUrl = viteServer.resolvedUrls?.local[0]?.replace(/\/$/, "") ?? "http://127.0.0.1:4173";
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(8000);
    await page.setViewport({ width: 1280, height: 900 });

    const consoleMessages = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        consoleMessages.push(`${message.type()}: ${message.text()}`);
      }
    });

    await page.goto(`${baseUrl}/travel`, { waitUntil: "networkidle0" });
    await page.waitForSelector(`#${firstTrip}`);
    await waitForHash(page, `#${firstTrip}`).catch(() => {});

    // Match the reported mid-session flow: the app is already alive on /travel,
    // its observer has seen the top trip, and a same-page hash navigation targets
    // a later trip without a full cold page load.
    await page.evaluate(() => {
      window.history.replaceState(window.history.state, "", "/travel");
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    await page.evaluate((id) => {
      window.location.hash = id;
    }, targetTrip);

    let hashAfterSamePageNavigation = await page.evaluate(() => window.location.hash);
    const observedHashes = [hashAfterSamePageNavigation];

    for (let elapsed = 0; elapsed < 1500; elapsed += 50) {
      await sleep(50);
      hashAfterSamePageNavigation = await page.evaluate(() => window.location.hash);
      observedHashes.push(hashAfterSamePageNavigation);
    }

    const unexpectedHash = observedHashes.find(
      (hash) => hash !== `#${targetTrip}`
    );
    if (unexpectedHash) {
      throw new Error(
        `Expected same-page hash navigation to stay on #${targetTrip}, got ${unexpectedHash}. Observed: ${observedHashes.join(", ")}`
      );
    }

    // Legitimate scroll-driven syncing must still work after the guard window.
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, firstTrip);
    await waitForHash(page, `#${firstTrip}`);

    if (consoleMessages.length > 0) {
      console.warn(`Browser warnings/errors:\n${consoleMessages.join("\n")}`);
    }

    console.log("travel hash sync regression passed");
  } finally {
    await browser.close();
    await viteServer?.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
