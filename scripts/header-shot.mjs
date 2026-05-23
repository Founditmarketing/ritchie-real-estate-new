/**
 * Screenshot the header in BOTH states (transparent over hero + scrolled
 * cream) at desktop and mobile so we can see how the canonical RRE
 * wordmark reads in each.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const URL = process.env.TARGET_URL ?? "http://localhost:3001/";
const outDir = "scripts/shots";
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "iphone-13", width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // Capture top 140px of viewport (the header area) at scrollY 0
  const topClip = { x: 0, y: 0, width: vp.width, height: 140 };
  await page.screenshot({
    path: join(outDir, `header-${vp.name}-top.png`),
    clip: topClip,
  });

  // Scroll past hero so the header gets its cream background, then capture
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.2 }));
  await page.waitForTimeout(900);
  await page.screenshot({
    path: join(outDir, `header-${vp.name}-scrolled.png`),
    clip: topClip,
  });
  console.log(`${vp.name}: header-${vp.name}-top.png + header-${vp.name}-scrolled.png`);
  await ctx.close();
}
await browser.close();
