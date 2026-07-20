import type { Metadata } from "next";
import { CrmBodyFlag } from "./BodyFlag";

export const metadata: Metadata = {
  title: { absolute: "Ritchie CRM" },
  robots: { index: false, follow: false },
};

/**
 * Shell for every /crm route (login included). The marketing site's
 * chrome (Header, Footer, mobile dock, floating Ask Ritchie launcher,
 * scroll-progress hairline) mounts in the ROOT layout above this one —
 * hide it two ways:
 *  1. body:has([data-crm-root]) — pure CSS, no flash, modern browsers.
 *  2. body[data-crm="1"] via CrmBodyFlag — JS fallback for the rest.
 * The two selector lists live in SEPARATE rules on purpose: a browser
 * that doesn't know :has() drops the whole rule it appears in.
 */
export default function CrmLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-crm-root className="min-h-screen bg-navy-ink text-cream">
      <CrmBodyFlag />
      <style>{`
        body[data-crm="1"] > header,
        body[data-crm="1"] > footer,
        body[data-crm="1"] > nav[aria-label="Quick actions"],
        body[data-crm="1"] > button[aria-label^="Ask Ritchie"],
        body[data-crm="1"] > div[class*="h-[2px]"] {
          display: none !important;
        }
        body:has([data-crm-root]) > header,
        body:has([data-crm-root]) > footer,
        body:has([data-crm-root]) > nav[aria-label="Quick actions"],
        body:has([data-crm-root]) > button[aria-label^="Ask Ritchie"],
        body:has([data-crm-root]) > div[class*="h-[2px]"] {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}
