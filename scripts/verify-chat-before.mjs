import { chromium } from "playwright";

const BASE = "http://localhost:3001";
const out = "scripts/_shots";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(3500);

async function openChat() {
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("ask-ritchie:open")),
    );
    try {
      await page.waitForSelector('[role="dialog"]', { timeout: 3000, state: "visible" });
      return true;
    } catch {}
  }
  return false;
}

const ok = await openChat();
console.log("dialog open:", ok);
await page.waitForTimeout(1000);
await page.screenshot({ path: `${out}/chat-before-greeting.png` });

await page.getByLabel("Message").fill("find me a home in Alexandria under 700k");
await page.keyboard.press("Enter");
await page.waitForTimeout(1800);
await page.screenshot({ path: `${out}/chat-before-listings.png` });

await page.getByLabel("Message").fill("can I talk to Matt");
await page.keyboard.press("Enter");
await page.waitForTimeout(1800);
await page.screenshot({ path: `${out}/chat-before-lead.png` });

await browser.close();
console.log("done");
