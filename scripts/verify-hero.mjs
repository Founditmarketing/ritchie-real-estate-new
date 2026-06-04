import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.TARGET_URL ?? "http://localhost:3001";
mkdirSync("scripts/shots", { recursive: true });
const browser = await chromium.launch();

async function run(name, vp) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `scripts/shots/hero-${name}.png`, clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) } });

  // Click the hero's primary CTA -> should open the concierge
  await page.getByRole("button", { name: "Ask Ritchie" }).first().click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `scripts/shots/hero-${name}-opened.png` });
  console.log(name, "done");
  await ctx.close();
}

await run("desktop", { width: 1440, height: 900 });
await run("mobile", { width: 390, height: 844 });
await browser.close();
