import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Ritchie Real Estate — Central Louisiana since 1997. 318-449-8919";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * Satori cannot parse oklch() — these are honest sRGB hex equivalents of
 * the tokens in src/app/globals.css @theme (logo-anchored palette):
 *   navy-ink       oklch(0.155 0.055 264) → #081231
 *   crimson        oklch(0.48 0.185 14)   → #a81640 (logo diamond #9A0934 family)
 *   crimson-bright oklch(0.63 0.20 16)    → #e73a58
 *   cream          oklch(0.930 0.009 85)  → #ece8e0
 *   cream-warm     oklch(0.850 0.015 75)  → #d6cdc2
 *   paper          oklch(0.970 0.005 90)  → #f7f5f1
 */
const NAVY_INK = "#081231";
const CRIMSON = "#a81640";
const CRIMSON_BRIGHT = "#e73a58";
const CREAM = "#ece8e0";
const CREAM_WARM = "#d6cdc2";
const PAPER = "#f7f5f1";

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
          <span style={{ color: PAPER }}>Since&nbsp;</span>
          <span style={{ fontStyle: "italic", color: CRIMSON_BRIGHT }}>
            1997.
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
