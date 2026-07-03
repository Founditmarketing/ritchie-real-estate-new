/* TODO(launch): have counsel review before the client domain goes live */

import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site collects — only what you type into a form — what happens to it, and what Ritchie Real Estate will never do with it.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Privacy"
      current="privacy"
      title={
        <>
          Privacy, in{" "}
          <em className="italic text-crimson-bright">plain English.</em>
        </>
      }
      lede={
        <>
          Ritchie Real Estate is a small Cenla brokerage, not a data company.
          Here&rsquo;s exactly what this site collects and what happens to it.
        </>
      }
    >
      <LegalSection num="01" title="What this site collects">
        <p>
          The only personal information this site collects is what you choose
          to type into a form: your name, a phone number or email address, and
          whatever you write in a message. That covers the contact form, the
          home-valuation form, the Market Letter signup, and any contact
          details you share in the Ask Ritchie window. No accounts, no
          profiles, nothing gathered behind your back.
        </p>
      </LegalSection>

      <LegalSection num="02" title="What happens to it">
        <p>
          Form submissions are sent by email to the brokerage so a person can
          follow up, and kept as a simple record so nothing you send us gets
          lost. We use your information for exactly one thing: responding to
          you.
        </p>
        <p>
          If you join the Cenla Market Letter, your email address is used only
          to send it &mdash; and you can come off the list any time by asking.
        </p>
      </LegalSection>

      <LegalSection num="03" title="What we don’t do">
        <p>
          No advertising trackers. No analytics pixels. No cookies that follow
          you around the internet. And we don&rsquo;t sell, rent, or trade
          your information &mdash; to anyone.
        </p>
        <p>
          Like nearly every website, our hosting provider keeps routine
          technical logs &mdash; things like IP addresses and page requests
          &mdash; to keep the site running and secure.
        </p>
      </LegalSection>

      <LegalSection num="04" title="Outside services">
        <p>
          A few parts of the site load from third-party hosts: the map tiles
          on the Explore page and some of the photography. When those load,
          the provider sees a standard web request from your browser &mdash;
          the same as visiting any page with a map or a photo on it. Nothing
          you type into our forms is shared with them.
        </p>
      </LegalSection>

      <LegalSection num="05" title="Your choices">
        <p>
          Want to know what we have, correct it, or have it deleted? Call{" "}
          <a
            href="tel:+13184498919"
            className="text-crimson-bright underline underline-offset-4 transition-colors hover:text-crimson"
          >
            318-449-8919
          </a>{" "}
          or send a note through the{" "}
          <Link
            href="/contact"
            className="text-crimson-bright underline underline-offset-4 transition-colors hover:text-crimson"
          >
            contact page
          </Link>{" "}
          and we&rsquo;ll take care of it.
        </p>
        <p>
          Ritchie Real Estate, LLC &middot; 1268 Dorchester Dr, Alexandria, LA
          71303 &middot; Mon&ndash;Fri 8&ndash;6, Sat by appointment.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
