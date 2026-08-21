import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import path from "node:path";

const DIR = "C:/Users/trevo/AppData/Local/Temp/claude/C--Users-trevo-OneDrive-Desktop-AI-Websites-status/3adba22d-665c-407f-a574-d8491ec780f3/scratchpad/shots";
const OUT = path.join(DIR, "slices");
mkdirSync(OUT, { recursive: true });

const SEG = 1600; // px at 2x

for (const f of readdirSync(DIR).filter((f) => f.endsWith(".png"))) {
  const img = sharp(path.join(DIR, f));
  const { width, height } = await img.metadata();
  if (height <= 1800) continue;
  const n = Math.ceil(height / SEG);
  for (let i = 0; i < n; i++) {
    const top = i * SEG;
    const h = Math.min(SEG, height - top);
    await sharp(path.join(DIR, f))
      .extract({ left: 0, top, width, height: h })
      .resize({ width: 390 })
      .toFile(path.join(OUT, f.replace(".png", `-s${String(i).padStart(2, "0")}.png`)));
  }
  console.log(f, n, "slices", height);
}
