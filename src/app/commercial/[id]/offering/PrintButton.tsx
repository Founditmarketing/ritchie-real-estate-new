"use client";

/**
 * Print / save-as-PDF. Deliberately the browser's own print pipeline:
 * every desktop OS and iOS Share sheet turns it into a PDF, so there's
 * no export service to pay for, break, or wait on.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-[44px] items-center gap-2.5 bg-crimson px-6 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-crimson-deep"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 9V3h12v6" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v7H6z" />
      </svg>
      Print / Save PDF
    </button>
  );
}
