import puppeteer from "puppeteer";

// End-to-end check of the AI chat action buttons: the Worker reply is stubbed,
// so this tests parsing, rendering, and where each button actually takes you.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Keyed by the question typed into the chat
const REPLIES = {
  "tag in backticks": "Here you go. `[ACTIONS: view_resume, play_snake]`",
  "show me his projects": "Some answer. [ACTIONS: view_case_studies]",
  "dangling tag": "An answer that got cut off [ACTIONS:",
  "experience please": "Here is his experience. [ACTIONS: view_experience, contact_form]",
  "links please": "Find him here. [ACTIONS: view_linkedin, view_github, send_email]",
  "a very specific question for drew": "Best asked directly. [ACTIONS: ask_directly]",
  "how fast is his local model": "About 33 tokens/sec on structured output.\n[SHOW: inference-engine]\n[ACTIONS: view_projects]",
  "tell me about his mentoring": "He teaches at CodePath. [ACTIONS: contact_form]",
  "bogus spotlight": "Hello there. [SHOW: not-a-target]\n[ACTIONS: view_projects]",
};

async function main() {
  let viteServer;
  let baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    const { createServer } = await import("vite");
    viteServer = await createServer({
      logLevel: "error",
      server: { host: "127.0.0.1", port: 4174, strictPort: false, open: false },
    });
    await viteServer.listen();
    baseUrl = viteServer.resolvedUrls?.local[0]?.replace(/\/$/, "") ?? "http://127.0.0.1:4174";
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const failures = [];
  const check = (ok, label) => {
    console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
    if (!ok) failures.push(label);
  };

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(8000);
    await page.setViewport({ width: 1280, height: 900 });
    await page.evaluateOnNewDocument(() => {
      window.__opened = [];
      window.open = (url) => {
        window.__opened.push(url);
        return null;
      };
    });
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.url().includes("/api/chat") && req.method() === "OPTIONS") {
        return req.respond({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST" } });
      }
      if (req.url().includes("/api/chat")) {
        const { message } = JSON.parse(req.postData() || "{}");
        return req.respond({
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
          contentType: "application/json",
          body: JSON.stringify({ response: REPLIES[message] ?? "No stub for this question." }),
        });
      }
      return req.continue();
    });

    const load = async (path) => {
      await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle0" });
    };

    // Ask a question and return the last assistant message element's text and button labels
    const ask = async (question) => {
      if (!(await page.$('[aria-label="AI chat assistant"]'))) {
        await page.click('[aria-label="Open AI chat assistant"]');
      }
      await page.waitForSelector('input[placeholder="Ask me anything..."]');
      await page.type('input[placeholder="Ask me anything..."]', question);
      await page.keyboard.press("Enter");
      // Wait for streaming to finish: the reply renders as markdown once done
      await page.waitForFunction(
        (q) => {
          const log = document.querySelector('[aria-label="Chat messages"]');
          return log && log.textContent.includes(q) && log.querySelectorAll(".assistant-message-content").length > 0 &&
            !log.textContent.trim().endsWith(q);
        },
        {},
        question
      );
      await sleep(1200);
      return page.evaluate(() => {
        const bubbles = [...document.querySelectorAll(".assistant-message-content")];
        const last = bubbles[bubbles.length - 1];
        const wrap = last.parentElement;
        return {
          text: last.textContent,
          buttons: [...wrap.querySelectorAll("button")].map((b) => b.textContent.trim()).filter((t) => t && t !== "Retry"),
        };
      });
    };

    const clickAction = async (label) => {
      const handle = await page.evaluateHandle((l) => {
        const bubbles = [...document.querySelectorAll(".assistant-message-content")];
        const wrap = bubbles[bubbles.length - 1].parentElement;
        return [...wrap.querySelectorAll("button")].find((b) => b.textContent.trim() === l);
      }, label);
      const el = handle.asElement();
      if (!el) {
        check(false, `button "${label}" exists`);
        return false;
      }
      await el.click();
      return true;
    };

    // --- Parsing and rendering ---
    await load("/");
    let r = await ask("tag in backticks");
    check(!r.text.includes("ACTIONS") && !r.text.includes("``"), `backtick-wrapped tag is stripped (text: ${JSON.stringify(r.text)})`);
    check(r.buttons.includes("View Resume") && r.buttons.includes("Play Snake"), `play_snake renders a button (buttons: ${r.buttons})`);

    r = await ask("show me his projects");
    check(r.buttons.includes("View Projects"), `unknown-only actions fall back to question keywords (buttons: ${r.buttons})`);

    r = await ask("dangling tag");
    check(!r.text.includes("[ACTIONS"), `dangling tag is not shown (text: ${JSON.stringify(r.text)})`);

    // --- Click behavior ---
    r = await ask("links please");
    for (const label of ["LinkedIn Profile", "GitHub Profile"]) await clickAction(label);
    const opened = await page.evaluate(() => window.__opened);
    check(opened.some((u) => u.includes("linkedin.com")) && opened.some((u) => u.includes("github.com/elchic00")), `LinkedIn/GitHub open new tabs (${opened})`);
    check(r.buttons.includes("Send Email"), "Send Email button renders");

    await load("/");
    r = await ask("tag in backticks");
    await clickAction("View Resume");
    check((await page.evaluate(() => window.__opened)).some((u) => u.endsWith("/andrew-alagna-resume.pdf")), "View Resume opens the PDF");

    await clickAction("Play Snake");
    await page.waitForFunction(() => location.pathname === "/snake").catch(() => {});
    check(page.url().endsWith("/snake"), `Play Snake goes to /snake (at ${page.url()})`);

    await load("/");
    await ask("experience please");
    await clickAction("View Experience");
    await sleep(1500);
    const expTop = await page.evaluate(() => document.getElementById("experience").getBoundingClientRect().top);
    const chatClosed = await page.evaluate(() => !document.querySelector('[aria-label="AI chat assistant"]'));
    check(Math.abs(expTop) < 200 && chatClosed, `View Experience scrolls home page to #experience and closes chat (top ${Math.round(expTop)})`);

    await load("/projects");
    await ask("experience please");
    await clickAction("Contact Form");
    await page.waitForFunction(() => location.pathname === "/" && location.hash === "#contact").catch(() => {});
    check(page.url().endsWith("/#contact"), `Contact Form from /projects goes to /#contact (at ${page.url()})`);

    // ask_directly must prefill React state, not just the DOM: blur+type elsewhere forces a re-render
    for (const start of ["/", "/projects"]) {
      await load(start);
      await ask("a very specific question for drew");
      await clickAction("Ask Andrew Directly");
      await page.waitForFunction(() => location.pathname === "/" && document.getElementById("message")).catch(() => {});
      await sleep(1200);
      await page.type("#name", "Test").catch(() => {});
      await sleep(300);
      const prefilled = await page.evaluate(() => document.getElementById("message")?.value ?? "");
      check(prefilled === "a very specific question for drew", `Ask Andrew Directly from ${start} prefills the contact message (got ${JSON.stringify(prefilled)})`);
      await page.evaluate(() => localStorage.clear());
    }

    // --- Page spotlight ([SHOW: target]) ---
    const shots = process.env.SPOTLIGHT_SHOTS;
    const spotlight = () =>
      page.evaluate(() => {
        const box = document.querySelector(".page-spotlight-box");
        const target = document.querySelector('[data-chat-target="inference-engine"]');
        const r = target?.getBoundingClientRect();
        const win = document.querySelector("[data-chat-window]");
        return {
          shown: !!box && getComputedStyle(box).opacity === "1",
          targetInView: !!r && r.top >= 0 && r.bottom <= innerHeight,
          chatOpacity: win ? getComputedStyle(win).opacity : null,
          focused: document.activeElement === target,
          search: location.search,
        };
      });

    await load("/");
    r = await ask("how fast is his local model");
    check(!r.text.includes("[SHOW") && r.buttons.includes("Show me on the page"), `SHOW tag is stripped and renders a button (buttons: ${r.buttons})`);
    await sleep(900);
    let s = await spotlight();
    check(s.shown && s.targetInView, `model-tagged SHOW auto-spotlights the card on desktop (${JSON.stringify(s)})`);
    check(s.chatOpacity === "0", `chat window steps aside during the spotlight (opacity ${s.chatOpacity})`);
    if (shots) await page.screenshot({ path: `${shots}/spotlight-desktop.png` });
    await page.mouse.click(5, 300);
    await sleep(400);
    check(!(await page.$(".page-spotlight")), "a click anywhere clears the spotlight");
    await sleep(400);
    const back = await page.evaluate(() => {
      const win = document.querySelector("[data-chat-window]");
      return win ? getComputedStyle(win).opacity : "closed";
    });
    check(back === "1", `the click that clears the spotlight brings the chat back instead of closing it (${back})`);

    r = await ask("tell me about his mentoring");
    await sleep(900);
    check(r.buttons.includes("Show me on the page") && !(await page.$(".page-spotlight")), "keyword fallback offers the button without auto-spotlighting");

    r = await ask("bogus spotlight");
    check(!r.text.includes("[SHOW") && !r.buttons.includes("Show me on the page"), `unknown SHOW target is stripped with no button (buttons: ${r.buttons})`);
    await page.evaluate(() => localStorage.clear());

    await load("/projects");
    r = await ask("how fast is his local model");
    await sleep(900);
    check(!(await page.$(".page-spotlight")), "no auto-spotlight when the target isn't on the current page");
    await clickAction("Show me on the page");
    await page.waitForFunction(() => location.pathname === "/" && document.querySelector(".page-spotlight")).catch(() => {});
    await sleep(1200);
    s = await spotlight();
    check(s.shown && s.targetInView && s.focused && s.search === "", `Show from /projects lands on the homepage spotlight with focus and a clean URL (${JSON.stringify(s)})`);
    await page.evaluate(() => localStorage.clear());

    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await load("/");
    // The chat button hides over the mobile hero
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForSelector('[aria-label="Open AI chat assistant"]', { visible: true });
    r = await ask("how fast is his local model");
    await sleep(900);
    check(!(await page.$(".page-spotlight")), "no auto-spotlight on mobile, where the chat covers the page");
    await clickAction("Show me on the page");
    await sleep(1500);
    s = await spotlight();
    const closed = await page.evaluate(() => !document.querySelector('[aria-label="AI chat assistant"]'));
    check(closed && s.shown && s.targetInView, `mobile Show closes the chat and spotlights the card (${JSON.stringify(s)})`);
    if (shots) await page.screenshot({ path: `${shots}/spotlight-mobile.png` });
    await page.evaluate(() => localStorage.clear());
  } finally {
    await browser.close();
    await viteServer?.close();
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} chat action check(s) failed`);
    process.exit(1);
  }
  console.log("\nchat action checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
