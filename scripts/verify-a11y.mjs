import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.TARGET_URL ?? "http://localhost:3001";
mkdirSync("scripts/shots", { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);

// Open the concierge via keyboard (focus launcher, press Enter)
await page.evaluate(() => {
  const b = document.querySelector('button[aria-label^="Ask Ritchie"]');
  if (b) b.focus();
});
await page.keyboard.press("Enter");
await page.waitForTimeout(600);

const dialogOpen = await page.evaluate(() => !!document.querySelector('[role="dialog"]'));
const focusInDialog = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  return d ? d.contains(document.activeElement) : false;
});
const activeTag = await page.evaluate(() => document.activeElement?.tagName);
const hasLive = await page.evaluate(() => !!document.querySelector('[role="dialog"] [aria-live="polite"]'));

// Focus trap: shift+Tab from the first focusable should stay inside the dialog
await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  const f = d.querySelector('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])');
  f && f.focus();
});
await page.keyboard.down("Shift");
await page.keyboard.press("Tab");
await page.keyboard.up("Shift");
const trappedInside = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  return d ? d.contains(document.activeElement) : false;
});

// Esc should close and restore focus to the launcher
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
const dialogClosed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
const focusBackOnLauncher = await page.evaluate(
  () => document.activeElement?.getAttribute("aria-label")?.startsWith("Ask Ritchie") ?? false,
);

console.log(JSON.stringify({ dialogOpen, focusInDialog, activeTag, hasLive, trappedInside, dialogClosed, focusBackOnLauncher }, null, 2));

// Footer shot
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900);
await page.locator("footer").screenshot({ path: "scripts/shots/footer-fixed.png" });

await browser.close();
