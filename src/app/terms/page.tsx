/* TODO(launch): have counsel review before the client domain goes live */

import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Plain-English ground rules for using the Ritchie Real Estate site — what the listings and market notes are, and what we can and can’t promise.",
};

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Terms of use"
      current="terms"
      title={
        <>
          The fine print, kept{" "}
          <em className="italic text-crimson-bright">readable.</em>
        </>
      }
      lede={
        <>
          Plain-English ground rules for using this site. Short on legalese,
          honest about what we can and can&rsquo;t promise.
        </>
      }
    >
      <LegalSection num="01" title="Who we are">
        <p>
          This site is published by Ritchie Real Estate, LLC, a real estate
          brokerage at 1268 Dorchester Dr, Alexandria, LA 71303, serving
          Central Louisiana since 2003. Using the site means you&rsquo;re okay
          with the ground rules below.
        </p>
      </LegalSection>

      <LegalSection num="02" title="Listings and market information">
        <p>
          Listings, prices, measurements, market notes, and area descriptions
          are published in good faith and believed reliable &mdash; but they
          aren&rsquo;t guaranteed. Properties sell, prices change, and details
          get corrected. Nothing on this site is an offer or a contract.
        </p>
        <p>
          If a number matters to your decision, verify it with us &mdash; or
          with your own advisors &mdash; before you act on it.
        </p>
      </LegalSection>

      <LegalSection num="03" title="Not professional advice">
        <p>
          This site is marketing and market commentary, not legal, financial,
          tax, or appraisal advice. For decisions that need a professional,
          hire the professional &mdash; we&rsquo;re glad to point you toward
          good ones.
        </p>
      </LegalSection>

      <LegalSection num="04" title="The site, as-is">
        <p>
          We work to keep this site accurate, secure, and online, but
          it&rsquo;s provided as-is, with no warranty that it will be
          uninterrupted or error-free. To the extent the law allows, Ritchie
          Real Estate, LLC isn&rsquo;t liable for losses that come from
          relying on the site alone. When something&rsquo;s important, call
          &mdash; the phone is faster anyway.
        </p>
      </LegalSection>

      <LegalSection num="05" title="Fair housing">
        <p>
          Ritchie Real Estate, LLC provides brokerage services in accordance
          with federal and state fair-housing laws and supports Equal Housing
          Opportunity.
        </p>
      </LegalSection>

      <LegalSection num="06" title="The Ritchie name">
        <p>
          The Ritchie name, the diamond mark, and the writing and photography
          on this site belong to the brokerage or its licensors. Browse and
          share freely; don&rsquo;t scrape it, republish it, or pass it off as
          your own.
        </p>
        <p>
          Questions about any of this:{" "}
          <a
            href="tel:+13184498919"
            className="text-crimson-bright underline underline-offset-4 transition-colors hover:text-crimson"
          >
            318-449-8919
          </a>
          , Mon&ndash;Fri 8&ndash;6.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
