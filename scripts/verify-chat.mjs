import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.TARGET_URL ?? "http://localhost:3001";
mkdirSync("scripts/shots", { recursive: true });
const browser = await chromium.launch();

async function run(name, vp) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Open launcher
  await page.getByRole("button", { name: /Ask Ritchie/i }).first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `scripts/shots/chat-${name}-open.png` });

  // Click a starter chip -> listings
  await page.getByRole("button", { name: "Find me a home" }).click();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `scripts/shots/chat-${name}-listings.png` });

  // Ask to book a showing -> lead form
  const ta = page.getByLabel("Message");
  await ta.click();
  await ta.fill("can you set up a showing for me");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `scripts/shots/chat-${name}-lead.png` });

  console.log(name, "done");
  await ctx.close();
}

await run("desktop", { width: 1440, height: 900 });
await run("mobile", { width: 390, height: 844 });
await browser.close();
