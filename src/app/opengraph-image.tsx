import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Ritchie Real Estate — Central Louisiana knows Ritchie. 318-449-8919";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * Satori cannot parse oklch() — these are honest sRGB hex equivalents of
 * the DESIGN.md tokens in src/app/globals.css @theme:
 *   navy-ink       oklch(0.145 0.030 264) → #050a17
 *   crimson        oklch(0.52 0.19 22)    → #be2132
 *   crimson-bright oklch(0.64 0.21 24)    → #f14348
 *   cream          oklch(0.925 0.013 80)  → #ebe5dd
 *   cream-warm     oklch(0.840 0.022 68)  → #d4c8bc
 *   paper          oklch(0.965 0.008 85)  → #f6f3ed
 */
const NAVY_INK = "#050a17";
const CRIMSON = "#be2132";
const CRIMSON_BRIGHT = "#f14348";
const CREAM = "#ebe5dd";
const CREAM_WARM = "#d4c8bc";
const PAPER = "#f6f3ed";

/**
 * Social share card. Node runtime so the Cormorant Garamond TTFs
 * (static instances in src/app/_og/) can be read from disk — satori
 * needs a bundled font for the serif italics.
 */
export default async function OgImage() {
  const dir = join(process.cwd(), "src/app/_og");
  const [serifUpright, serifItalic] = await Promise.all([
    readFile(join(dir, "CormorantGaramond-Medium.ttf")),
    readFile(join(dir, "CormorantGaramond-MediumItalic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: NAVY_INK,
          fontFamily: "Cormorant Garamond",
        }}
      >
        {/* Diamond mark — geometry echoes LogoMark */}
        <div
          style={{
            width: 74,
            height: 74,
            transform: "rotate(45deg)",
            border: `3px solid ${CREAM}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
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
                fontSize: 46,
                fontWeight: 500,
                color: PAPER,
                paddingBottom: 4,
              }}
            >
              R
            </div>
          </div>
        </div>

        {/* Tracked-out wordmark (the canonical wordmark is serif caps) */}
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 34,
            letterSpacing: 14, // ~0.42em at 34px (satori prefers px)
            // compensate for the trailing letter-space so it sits centered
            paddingLeft: 14,
            color: CREAM,
          }}
        >
          RITCHIE
        </div>

        {/* The statement */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 12,
            fontSize: 148,
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: PAPER }}>Ritchie&nbsp;</span>
          <span style={{ fontStyle: "italic", color: CRIMSON_BRIGHT }}>
            knows.
          </span>
        </div>

        {/* Footer line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 40,
            fontSize: 25,
            letterSpacing: 6, // ~0.24em at 25px (satori prefers px)
            color: CREAM_WARM,
          }}
        >
          <div style={{ width: 44, height: 1, backgroundColor: CRIMSON, marginRight: 26 }} />
          CENTRAL LOUISIANA · 318-449-8919
          <div style={{ width: 44, height: 1, backgroundColor: CRIMSON, marginLeft: 26 }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: serifUpright,
          style: "normal",
          weight: 500,
        },
        {
          name: "Cormorant Garamond",
          data: serifItalic,
          style: "italic",
          weight: 500,
        },
      ],
    },
  );
}
