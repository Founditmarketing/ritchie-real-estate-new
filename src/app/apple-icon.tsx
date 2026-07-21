import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/*
 * Satori cannot parse oklch() — these are honest sRGB hex equivalents of
 * the tokens in src/app/globals.css @theme (logo-anchored palette):
 *   navy-ink oklch(0.155 0.055 264) → #081231
 *   crimson  oklch(0.48 0.185 14)   → #a81640
 *   cream    oklch(0.930 0.009 85)  → #ece8e0
 *   paper    oklch(0.970 0.005 90)  → #f7f5f1
 */
const NAVY_INK = "#081231";
const CRIMSON = "#a81640";
const CREAM = "#ece8e0";
const PAPER = "#f7f5f1";

/**
 * Apple touch icon — the brand diamond + serif R (see LogoMark in
 * src/components/brand/Logo.tsx). Node runtime so the real Cormorant
 * Garamond TTF can be read from disk; satori's built-in fallback font
 * is a sans and would break the serif monogram.
 */
export default async function AppleIcon() {
  const cormorant = await readFile(
    join(process.cwd(), "src/app/_og/CormorantGaramond-Medium.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: NAVY_INK,
        }}
      >
        {/* outer border diamond */}
        <div
          style={{
            width: 98,
            height: 98,
            transform: "rotate(45deg)",
            border: `4px solid ${CREAM}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* inner crimson diamond */}
          <div
            style={{
              width: 82,
              height: 82,
              backgroundColor: CRIMSON,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                transform: "rotate(-45deg)",
                display: "flex",
                fontFamily: "Cormorant Garamond",
                fontSize: 66,
                fontWeight: 500,
                color: PAPER,
                // optical centering: serif caps sit a touch high
                paddingBottom: 6,
              }}
            >
              R
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: cormorant,
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}
