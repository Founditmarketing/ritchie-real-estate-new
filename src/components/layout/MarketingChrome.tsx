"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The CRM is an app with its own chrome (header + bottom dock). Without
 * this gate the marketing shell rendered on top of it — most visibly the
 * MobileDock, which sits at the same z-index as the CRM dock and painted
 * over it on phones, raised Ask bubble and all.
 */
export function MarketingChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/crm")) return null;
  return <>{children}</>;
}
