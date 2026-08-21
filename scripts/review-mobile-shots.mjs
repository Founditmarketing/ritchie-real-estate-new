import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:3001";
const OUT = process.env.OUT_DIR;
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

const vp = { width: 390, height: 844 };

async function fullShot(name, url, opts = {}) {
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(2500);
  // force lazy content to load
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  if (opts.before) await opts.before(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: !opts.viewportOnly });
  console.log(name, "done");
  await ctx.close();
}

await fullShot("home-mobile", `${BASE}/`);
await fullShot("explore-mobile", `${BASE}/explore`);
await fullShot("listings-mobile", `${BASE}/listings`);
await fullShot("listing-residential-mobile", `${BASE}/listings/bayou-robert-estate`);
await fullShot("listing-commercial-mobile", `${BASE}/listings/macarthur-drive-office`);
await fullShot("team-mobile", `${BASE}/team`);

// drawer open
await fullShot("drawer-open-mobile", `${BASE}/`, {
  viewportOnly: true,
  before: async (page) => {
    const btn = page.locator("header button").first();
    await btn.click().catch(() => {});
    await page.waitForTimeout(900);
  },
});

// hero viewport only (above the fold)
await fullShot("home-fold-mobile", `${BASE}/`, { viewportOnly: true });
await browser.close();
