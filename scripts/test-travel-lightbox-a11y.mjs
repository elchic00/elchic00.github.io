import puppeteer from "puppeteer";

const baseUrl = process.env.TEST_BASE_URL || "http://localhost:5173";
const url = `${baseUrl.replace(/\/$/, "")}/travel`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto(url, { waitUntil: "networkidle0" });

  const photoButtons = await page.$$("button[aria-label^='View ']");
  if (photoButtons.length < 2) {
    throw new Error(`Expected at least 2 photo buttons, found ${photoButtons.length}`);
  }

  const firstPhotoLabel = await photoButtons[0].evaluate((button) => button.getAttribute("aria-label"));
  await photoButtons[0].click();

  await page.waitForSelector('[role="dialog"][aria-modal="true"]', { visible: true });

  const dialogState = await page.$eval('[role="dialog"]', (dialog) => ({
    label: dialog.getAttribute("aria-label"),
    modal: dialog.getAttribute("aria-modal"),
    closeButton: Boolean(dialog.querySelector('button[aria-label="Close lightbox"]')),
    zoomButton: Boolean(dialog.querySelector('button[aria-label="Zoom in"], button[aria-label$="zoom"]')),
    previousButton: Boolean(dialog.querySelector('button[aria-label="Previous photo"]')),
    nextButton: Boolean(dialog.querySelector('button[aria-label="Next photo"]')),
  }));

  if (!dialogState.label?.startsWith("Photo viewer:")) {
    throw new Error(`Lightbox dialog label missing/incorrect: ${dialogState.label}`);
  }
  if (dialogState.modal !== "true") {
    throw new Error("Lightbox dialog must set aria-modal=true");
  }
  for (const control of ["closeButton", "zoomButton", "previousButton", "nextButton"]) {
    if (!dialogState[control]) {
      throw new Error(`Missing expected lightbox control: ${control}`);
    }
  }

  await page.waitForFunction(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
  });

  const initialFocusInsideDialog = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
  });
  if (!initialFocusInsideDialog) {
    throw new Error("Expected focus to move inside the lightbox when it opens");
  }

  for (let i = 0; i < 6; i += 1) {
    await page.keyboard.press("Tab");
    const focusInsideDialog = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
    });
    if (!focusInsideDialog) {
      throw new Error(`Expected Tab focus to remain trapped in the lightbox, escaped after ${i + 1} tab presses`);
    }
  }

  const initialCaption = await page.$eval('[role="dialog"] p', (node) => node.textContent?.trim());
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction((caption) => {
    const current = document.querySelector('[role="dialog"] p')?.textContent?.trim();
    return current && current !== caption;
  }, {}, initialCaption);

  await page.keyboard.press("ArrowLeft");
  await page.waitForFunction((caption) => {
    const current = document.querySelector('[role="dialog"] p')?.textContent?.trim();
    return current === caption;
  }, {}, initialCaption);

  await page.keyboard.press("Escape");
  await page.waitForSelector('[role="dialog"]', { hidden: true });

  const focusedAfterEscape = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  if (focusedAfterEscape !== firstPhotoLabel) {
    throw new Error(
      `Expected focus to return to originating photo button (${firstPhotoLabel}), got ${focusedAfterEscape}`
    );
  }

  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.reload({ waitUntil: "networkidle0" });

  const reducedMotionState = await page.evaluate(() => {
    const htmlScrollBehavior = getComputedStyle(document.documentElement).scrollBehavior;
    const stylesFor = (element) => {
      if (!element) return null;
      const styles = getComputedStyle(element);
      return {
        opacity: styles.opacity,
        transform: styles.transform,
        transitionDuration: styles.transitionDuration,
        animationName: styles.animationName,
      };
    };

    return {
      htmlScrollBehavior,
      revealStates: Array.from(document.querySelectorAll(".scroll-reveal, .scroll-reveal-scale")).map(stylesFor),
    };
  });

  if (reducedMotionState.htmlScrollBehavior !== "auto") {
    throw new Error(`Expected reduced-motion scroll-behavior auto, got ${reducedMotionState.htmlScrollBehavior}`);
  }

  if (reducedMotionState.revealStates.length === 0) {
    throw new Error("Missing scroll-reveal elements for reduced-motion verification");
  }

  for (const [index, state] of reducedMotionState.revealStates.entries()) {
    if (state.opacity !== "1") {
      throw new Error(`Expected reveal element ${index} opacity 1 in reduced motion, got ${state.opacity}`);
    }
    if (state.transform !== "none") {
      throw new Error(`Expected reveal element ${index} transform none in reduced motion, got ${state.transform}`);
    }
  }

  console.log(JSON.stringify({
    ok: true,
    url,
    keyboard: "dialog role/label, controls, ArrowRight/ArrowLeft, Escape close, focus return passed",
    reducedMotion: reducedMotionState,
  }, null, 2));
} finally {
  await browser.close();
}
