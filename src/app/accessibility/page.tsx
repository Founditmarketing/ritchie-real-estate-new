/* TODO(launch): have counsel review before the client domain goes live */

import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Ritchie Real Estate’s accessibility commitment — the WCAG 2.2 AA target, where the site stands today, and how to reach us if anything is hard to use.",
};

export default function AccessibilityPage() {
  return (
    <LegalShell
      eyebrow="Accessibility"
      current="accessibility"
      title={
        <>
          This site should work for{" "}
          <em className="italic text-crimson-bright">everyone.</em>
        </>
      }
      lede={
        <>
          Everyone should be able to browse, read, and reach us here.
          Here&rsquo;s where the site stands &mdash; and how to tell us when
          it falls short.
        </>
      }
    >
      <LegalSection num="01" title="The target">
        <p>
          This site is built toward WCAG 2.2 AA. In practice that means a
          contrast-checked palette on the dark canvas, a visible focus
          outline on every link, button, and form field, full keyboard
          navigation, and motion that switches off when your device asks for
          reduced motion.
        </p>
      </LegalSection>

      <LegalSection num="02" title="Where it stands today">
        <p>
          Two honest caveats while the site is young. Some listing and area
          photography is placeholder imagery until the brokerage&rsquo;s own
          photographs are shot, so image descriptions will keep improving as
          the real photos land.
        </p>
        <p>
          And the interactive Explore map is the one surface that leans
          visual &mdash; every property on it is also available as a fully
          readable list on the{" "}
          <Link
            href="/listings"
            className="text-crimson-bright underline underline-offset-4 transition-colors hover:text-crimson"
          >
            listings page
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection num="03" title="If something’s in your way">
        <p>
          If any part of this site is hard to use &mdash; with a screen
          reader, a keyboard, low vision, or anything else &mdash; tell us
          and we&rsquo;ll fix it. Call{" "}
          <a
            href="tel:+13184498919"
            className="text-crimson-bright underline underline-offset-4 transition-colors hover:text-crimson"
          >
            318-449-8919
          </a>{" "}
          (Mon&ndash;Fri 8&ndash;6, Sat by appointment) or send a note
          through the{" "}
          <Link
            href="/contact"
            className="text-crimson-bright underline underline-offset-4 transition-colors hover:text-crimson"
          >
            contact page
          </Link>
          .
        </p>
        <p>
          In the meantime, anything on this site we can read to you or send
          another way over the phone, we will.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
