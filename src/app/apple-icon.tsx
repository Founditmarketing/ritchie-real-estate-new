import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/*
 * Satori cannot parse oklch() — these are honest sRGB hex equivalents of
 * the DESIGN.md tokens in src/app/globals.css @theme:
 *   navy-ink oklch(0.145 0.030 264) → #050a17
 *   crimson  oklch(0.52 0.19 22)    → #be2132
 *   cream    oklch(0.925 0.013 80)  → #ebe5dd
 *   paper    oklch(0.965 0.008 85)  → #f6f3ed
 */
const NAVY_INK = "#050a17";
const CRIMSON = "#be2132";
const CREAM = "#ebe5dd";
const PAPER = "#f6f3ed";

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
