import { chromium } from "playwright";

const BASE = "http://localhost:3001";
const out = "scripts/_shots";
const browser = await chromium.launch();

async function openChat(page) {
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("ask-ritchie:open")),
    );
    try {
      await page.waitForSelector('[role="dialog"]', { timeout: 2500, state: "visible" });
      return true;
    } catch {}
  }
  return false;
}

// Desktop
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await d.newPage();
await dp.goto(BASE, { waitUntil: "domcontentloaded" });
await dp.waitForTimeout(3500);
console.log("desktop open:", await openChat(dp));
await dp.waitForTimeout(900);
await dp.locator('[role="dialog"]').screenshot({ path: `${out}/chat-after-greeting.png` });

await dp.getByLabel("Message").fill("find me a home in Alexandria under 700k");
await dp.keyboard.press("Enter");
// wait for listing images to load
await dp.waitForTimeout(1500);
await dp.waitForFunction(() => {
  const imgs = document.querySelectorAll('[role="dialog"] img');
  return imgs.length > 0 && [...imgs].every((i) => i.complete && i.naturalWidth > 0);
}, { timeout: 8000 }).catch(() => {});
await dp.locator('[role="dialog"]').screenshot({ path: `${out}/chat-after-listings.png` });

await dp.getByLabel("Message").fill("can I talk to Matt");
await dp.keyboard.press("Enter");
await dp.waitForTimeout(1500);
await dp.locator('[role="dialog"]').screenshot({ path: `${out}/chat-after-lead.png` });
await d.close();

// Mobile full sheet
const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await m.newPage();
await mp.goto(BASE, { waitUntil: "domcontentloaded" });
await mp.waitForTimeout(3500);
console.log("mobile open:", await openChat(mp));
await mp.getByLabel("Message").fill("show me land in Tioga");
await mp.keyboard.press("Enter");
await mp.waitForTimeout(1800);
await mp.screenshot({ path: `${out}/chat-after-mobile.png` });
await m.close();

await browser.close();
console.log("done");
