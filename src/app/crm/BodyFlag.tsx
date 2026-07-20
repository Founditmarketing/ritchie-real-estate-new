"use client";

import { useEffect } from "react";

/**
 * Marks <body data-crm="1"> while any /crm route is mounted so the CRM
 * layout's <style> can hide the marketing chrome (header, footer, mobile
 * dock, floating concierge launcher) that the root layout mounts.
 */
export function CrmBodyFlag() {
  useEffect(() => {
    document.body.dataset.crm = "1";
    return () => {
      delete document.body.dataset.crm;
    };
  }, []);
  return null;
}
