/**
 * Find any element that visually reads as a "dot/circle floating at the
 * top-center" of the homepage. Walks every element, filters to those
 * roughly square + roughly centered horizontally + near the top.
 */
import { chromium } from "playwright";
const url = process.env.TARGET_URL ?? "https://ritchie-real-estate-new.vercel.app/";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

const suspects = await page.evaluate(() => {
  const W = window.innerWidth;
  const out = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.width > 60) return;
    if (r.height < 4 || r.height > 60) return;
    if (Math.abs(r.width - r.height) > 8) return; // roughly square
    if (r.top < 0 || r.top > 200) return; // near top
    const cx = r.left + r.width / 2;
    if (Math.abs(cx - W / 2) > 200) return; // near horizontal center
    const cs = getComputedStyle(el);
    const isRound = parseFloat(cs.borderRadius) >= r.width / 4 || cs.borderRadius === "50%";
    if (!isRound) return;
    out.push({
      tag: el.tagName,
      cls: el.className?.toString().slice(0, 100),
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      bg: cs.backgroundColor,
      brc: cs.borderColor,
    });
  });
  return out;
});

console.log(`Found ${suspects.length} round-ish elements near top-center:`);
suspects.forEach((s) => console.log(JSON.stringify(s, null, 2)));

// Also screenshot the top 200px so we can see what they see
import { mkdirSync } from "node:fs";
mkdirSync("scripts/shots", { recursive: true });
await page.screenshot({
  path: "scripts/shots/top-band.png",
  clip: { x: 0, y: 0, width: 1440, height: 200 },
});
console.log("\nTop band shot at scripts/shots/top-band.png");

await ctx.close();
await browser.close();
