import { chromium } from "playwright";

const BASE = "http://localhost:3001";
const out = "scripts/_shots";

async function waitMap(page) {
  await page.waitForSelector(".rre-pin", { timeout: 15000 });
  await page.waitForSelector(".leaflet-tile-loaded", { timeout: 15000 });
  await page.waitForTimeout(2500);
}

const browser = await chromium.launch();

// Desktop
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await d.newPage();
await dp.goto(`${BASE}/explore`, { waitUntil: "domcontentloaded" });
await waitMap(dp);
await dp.screenshot({ path: `${out}/explore-desktop.png` });

// AI-driven filter: click a starter chip
await dp.getByRole("button", { name: "Land & acreage" }).click();
await dp.waitForTimeout(2500);
await dp.screenshot({ path: `${out}/explore-ai-land.png` });

// Free-typed query
await dp.getByRole("button", { name: "Reset" }).click();
await dp.waitForTimeout(800);
await dp.getByPlaceholder("Ask Ritchie to find it…").fill("homes in Pineville");
await dp.keyboard.press("Enter");
await dp.waitForTimeout(2800);
await dp.screenshot({ path: `${out}/explore-ai-query.png` });
await d.close();

// Mobile
const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await m.newPage();
await mp.goto(`${BASE}/explore`, { waitUntil: "domcontentloaded" });
await mp.waitForTimeout(1500);
await mp.screenshot({ path: `${out}/explore-mobile-list.png` });
await mp.getByRole("button", { name: "Map" }).click();
await waitMap(mp);
await mp.screenshot({ path: `${out}/explore-mobile-map.png` });
await m.close();

await browser.close();
console.log("done");
