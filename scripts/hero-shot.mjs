/**
 * Screenshot the live hero at multiple viewports + a quick measurement
 * of the headline bounding boxes vs viewport, so we can SEE whether any
 * text is actually clipped.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const URL = process.env.TARGET_URL ?? "https://ritchie-real-estate-new.vercel.app/";
const VIEWPORTS = [
  { name: "iphone-se", width: 320, height: 568 },
  { name: "iphone-13", width: 390, height: 844 },
  { name: "ipad", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
];

const outDir = "scripts/shots";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "reduce", // freeze any animation so we see static end state
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  // Wait for any pending Motion init to settle.
  await page.waitForTimeout(800);

  // Measure: headline element vs viewport bounds
  const measurements = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const r = h1?.getBoundingClientRect();
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    // Walk each line span and report its inner text width and whether
    // the rendered glyphs extend beyond the parent's clip area.
    const lines = Array.from(h1?.querySelectorAll(":scope > span") ?? []).map(
      (line, i) => {
        const lr = line.getBoundingClientRect();
        const inner = line.querySelector("span:last-child");
        const ir = inner?.getBoundingClientRect();
        return {
          i,
          lineWidth: Math.round(lr.width),
          lineHeight: Math.round(lr.height),
          innerWidth: ir ? Math.round(ir.width) : null,
          innerHeight: ir ? Math.round(ir.height) : null,
          text: inner?.textContent?.trim().slice(0, 40),
        };
      },
    );
    return {
      docWidth: docW,
      viewportWidth: winW,
      horizontalOverflow: Math.max(0, docW - winW),
      headline: r
        ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
        : null,
      lines,
    };
  });

  const png = join(outDir, `${vp.name}.png`);
  await page.screenshot({ path: png, fullPage: false });
  console.log(`${vp.name.padEnd(12)} ${vp.width}x${vp.height}  shot=${png}`);
  console.log(`             ${JSON.stringify(measurements)}`);
  await ctx.close();
}
await browser.close();
