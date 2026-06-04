import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.TARGET_URL ?? "http://localhost:3001";
mkdirSync("scripts/shots", { recursive: true });
const browser = await chromium.launch();

async function shot(name, url, vp) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1.5, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `scripts/shots/${name}.png`, clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 760) } });
  console.log(name, "done");
  await ctx.close();
}

await shot("commercial-desktop", `${BASE}/listings?type=commercial`, { width: 1440, height: 900 });
await shot("land-desktop", `${BASE}/listings?type=land`, { width: 1440, height: 900 });
await shot("buy-desktop", `${BASE}/listings`, { width: 1440, height: 900 });
await browser.close();
