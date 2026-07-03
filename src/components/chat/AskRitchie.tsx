"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";
import type { ConciergeReply, ListingCard } from "@/lib/concierge";

type Role = "user" | "assistant";

interface UIMessage {
  id: string;
  role: Role;
  content: string;
  listings?: ListingCard[];
  chips?: string[];
  cta?: "lead" | null;
}

// Inventory claim is scoped to Ritchie's own listings while the seed data is
// live; the stronger "every active listing in Cenla" copy can return once the
// live IDX feed is wired (see src/lib/listings.ts).
const GREETING: UIMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "I’m Matt’s desk on the web. I know the Cenla market cold and every listing Ritchie represents. What are you after?",
  chips: [
    "Find me a home",
    "Commercial space",
    "Land & acreage",
    "How’s the market?",
    "Sell my house",
  ],
};

let idSeq = 0;
const nextId = () => `m${++idSeq}-${Date.now()}`;

const OPEN_EVENT = "ask-ritchie:open";

/** Open the concierge from anywhere on the page (e.g. the hero CTA). */
export function openAskRitchie() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  }
}

export function AskRitchie() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadState, setLeadState] = useState<"idle" | "submitting" | "done">(
    "idle",
  );
  const [unread, setUnread] = useState(false);

  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const restoreFocus = useRef(false);
  const close = useCallback(() => {
    // The launcher is unmounted while the dialog is open, so we can't focus it
    // synchronously here — defer until it re-mounts (see effect below).
    restoreFocus.current = true;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      requestAnimationFrame(() => launcherRef.current?.focus());
    }
  }, [open]);

  // Keep focus inside the dialog while it's open (modal trap).
  const onTrapKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeEl = document.activeElement as HTMLElement | null;
    if (e.shiftKey && activeEl === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeEl === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // The most recent assistant line, announced politely to screen readers.
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.content;

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    if (open) {
      setUnread(false);
      scrollToEnd();
      // On phones the panel is a full sheet and auto-focusing the composer
      // pops the on-screen keyboard instantly — hiding the UI before anyone
      // can take it in. So only auto-focus the input on desktop; on mobile we
      // move focus to the dialog itself (keeps the a11y trap/Esc working) and
      // let the visitor tap the field when they're ready to type.
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches;
      const t = setTimeout(() => {
        if (isDesktop) inputRef.current?.focus();
        else dialogRef.current?.focus();
      }, 280);
      return () => clearTimeout(t);
    }
  }, [open, scrollToEnd]);

  useEffect(() => {
    if (open) scrollToEnd();
  }, [messages, loading, open, scrollToEnd]);

  // Open on demand from elsewhere (hero CTA, etc.).
  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setUnread(false);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // On phones the panel is a full sheet over the page — lock body scroll
  // while it's open so the homepage doesn't scroll (and lose its position)
  // behind the scrim. Desktop is a docked card; the page stays scrollable.
  // Mirrors the Header/Drawer body-overflow pattern.
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const send = useCallback(
    async (raw: string) => {
      const content = raw.trim();
      if (!content || loading) return;

      const userMsg: UIMessage = { id: nextId(), role: "user", content };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setLeadState("idle");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const data: ConciergeReply = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content: data.reply,
            listings: data.listings,
            chips: data.chips,
            cta: data.cta ?? null,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content:
              "I lost my connection for a second. Try again, or call Matt directly at 318-449-8919.",
          },
        ]);
      } finally {
        setLoading(false);
        if (!open) setUnread(true);
      }
    },
    [loading, messages, open],
  );

  const submitLead = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (leadState === "submitting") return;
      const form = e.currentTarget;
      const fd = new FormData(form);
      const name = String(fd.get("name") ?? "").trim();
      const contact = String(fd.get("contact") ?? "").trim();
      const note = String(fd.get("note") ?? "").trim();
      if (!name || !contact) return;

      setLeadState("submitting");
      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            contact,
            message: note,
            source: "ask-ritchie",
            intent: messages.filter((m) => m.role === "user").slice(-1)[0]?.content,
          }),
        });
        const data = await res.json();
        setLeadState("done");
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content:
              data?.message ??
              `Got it, ${name.split(" ")[0]}. Matt will reach out personally.`,
          },
        ]);
      } catch {
        setLeadState("idle");
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content:
              "Couldn’t file that just now — call or text Matt at 318-449-8919 and he’ll take care of you.",
          },
        ]);
      }
    },
    [leadState, messages],
  );

  const dur = reduce ? 0 : 0.42;

  // The /explore page is itself a full concierge experience — don't stack a
  // second floating launcher on top of it.
  if (pathname === "/explore") return null;

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask Ritchie, the Cenla concierge"
            initial={reduce ? false : { opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            data-cursor="grow"
            className="group fixed bottom-5 right-5 z-[80] hidden items-center gap-3 rounded-full border border-cream/15 bg-navy-deep/90 py-2.5 pl-2.5 pr-5 shadow-[0_18px_48px_-12px_oklch(0.08_0.03_264/0.7)] backdrop-blur-md transition-colors hover:border-crimson/50 md:bottom-7 md:right-7 md:flex"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-navy">
              <LogoMark tone="light" size={26} />
              {unread && (
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-navy-deep bg-crimson-bright" />
              )}
            </span>
            <span className="text-left leading-tight">
              <span className="block font-serif text-[15px] text-cream">
                Ask Ritchie
              </span>
              <span className="block font-sans text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
                Cenla concierge
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile scrim */}
            <motion.div
              className="fixed inset-0 z-[79] bg-navy-ink/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              onClick={close}
              aria-hidden
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              onKeyDown={onTrapKeyDown}
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "fixed z-[80] flex flex-col overflow-hidden border border-cream/12 bg-navy-deep shadow-[0_40px_120px_-20px_oklch(0.08_0.03_264/0.85)] outline-none",
                // Mobile: full sheet. Desktop: docked card.
                "inset-0 rounded-none",
                "md:inset-auto md:bottom-7 md:right-7 md:h-[640px] md:max-h-[calc(100vh-3.5rem)] md:w-[412px] md:rounded-[4px]",
              )}
            >
              {/* Header */}
              <header className="relative flex items-center gap-3 overflow-hidden border-b border-cream/10 bg-navy-ink/60 px-5 py-4">
                {/* Brand ember: a warm crimson glow that grounds the crest. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,oklch(0.50_0.18_22/0.28),transparent_70%)]"
                />
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-navy ring-1 ring-cream/10">
                  <LogoMark tone="light" size={26} />
                </span>
                <span className="relative leading-tight">
                  <span
                    id={titleId}
                    className="block font-serif text-[18px] text-cream"
                  >
                    Ask Ritchie
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.22em] text-cream-warm/60">
                    <PulseDot />
                    Replies instantly
                  </span>
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close chat"
                  data-cursor="grow"
                  className="relative ml-auto grid h-10 w-10 place-items-center rounded-full text-cream-warm/70 transition-colors hover:bg-cream/10 hover:text-cream"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                    <path
                      d="M3 3l10 10M13 3L3 13"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </header>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="chat-scroll flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5"
              >
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <MessageBlock
                      message={m}
                      onChip={send}
                      leadState={leadState}
                      onLeadSubmit={submitLead}
                      onCloseAfterNav={close}
                    />
                  </motion.div>
                ))}
                {loading && <TypingDots />}
              </div>

              {/* Polite screen-reader announcer for incoming replies */}
              <div aria-live="polite" role="status" className="sr-only">
                {loading ? "Ritchie is typing…" : lastAssistant}
              </div>

              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="border-t border-cream/10 bg-navy-ink/40 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              >
                <div className="flex items-end gap-2 rounded-[3px] border border-cream/12 bg-navy px-3 py-2 focus-within:border-crimson/50">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    rows={1}
                    placeholder="Ask about listings, the market, or Matt…"
                    aria-label="Message"
                    className="max-h-28 min-h-[22px] flex-1 resize-none bg-transparent text-[14px] text-cream placeholder:text-cream-warm/70"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    aria-label="Send"
                    data-cursor="grow"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-[3px] bg-crimson text-cream transition-colors hover:bg-crimson-bright disabled:opacity-35"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                      <path
                        d="M2 8h11M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-1.5 px-1 text-center font-sans text-[9.5px] uppercase tracking-[0.18em] text-cream-warm/60">
                  Ritchie Real Estate · 318-449-8919
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */

function MessageBlock({
  message,
  onChip,
  leadState,
  onLeadSubmit,
  onCloseAfterNav,
}: {
  message: UIMessage;
  onChip: (text: string) => void;
  leadState: "idle" | "submitting" | "done";
  onLeadSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCloseAfterNav: () => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[82%] whitespace-pre-wrap rounded-[10px] rounded-br-[2px] bg-navy-soft/70 px-3.5 py-2.5 text-[14px] leading-relaxed text-cream">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="max-w-[92%] whitespace-pre-wrap font-serif text-[15.5px] leading-[1.55] text-cream-warm">
        {message.content}
      </p>

      {message.listings && message.listings.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {message.listings.map((l) => (
            <ListingChip key={l.id} listing={l} onNavigate={onCloseAfterNav} />
          ))}
        </div>
      )}

      {message.cta === "lead" && (
        <LeadForm state={leadState} onSubmit={onLeadSubmit} />
      )}

      {message.chips && message.chips.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-0.5">
          {message.chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChip(chip)}
              data-cursor="grow"
              className="rounded-full border border-crimson/40 px-3 py-1.5 font-sans text-[11.5px] tracking-wide text-crimson-bright transition-colors hover:bg-crimson/15 hover:text-cream"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingChip({
  listing,
  onNavigate,
}: {
  listing: ListingCard;
  onNavigate: () => void;
}) {
  const meta =
    listing.type === "land"
      ? "Land"
      : listing.type === "commercial"
        ? `${listing.sqft.toLocaleString()} sq ft · Commercial`
        : `${listing.beds} bd · ${listing.baths} ba · ${listing.sqft.toLocaleString()} sq ft`;

  return (
    <Link
      href={listing.href}
      onClick={onNavigate}
      data-cursor-label="View"
      className="group flex gap-3 overflow-hidden rounded-[4px] border border-cream/12 bg-navy/60 p-2 transition-colors hover:border-crimson/45"
    >
      <span className="relative h-[72px] w-[104px] shrink-0 overflow-hidden rounded-[2px] bg-navy">
        {listing.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        {listing.badge ? (
          <span className="absolute left-1 top-1 bg-crimson px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.1em] text-cream">
            {listing.badge}
          </span>
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="font-serif text-[17px] leading-none text-crimson-bright">
          {listing.price}
        </span>
        <span className="mt-1 truncate font-serif text-[15px] text-cream">
          {listing.title}
        </span>
        <span className="truncate font-sans text-[11px] text-cream-warm/60">
          {listing.neighborhood
            ? `${listing.neighborhood}, ${listing.city}`
            : listing.city}
        </span>
        <span className="mt-0.5 truncate font-sans text-[10px] uppercase tracking-[0.12em] text-cream-warm/45">
          {meta}
        </span>
      </span>
    </Link>
  );
}

function LeadForm({
  state,
  onSubmit,
}: {
  state: "idle" | "submitting" | "done";
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  // LeadForm can mount once per lead-CTA message in the thread, so ids
  // must be generated — hardcoded htmlFor/id pairs would collide.
  const uid = useId();
  if (state === "done") return null;

  const labelClass =
    "font-sans text-[10px] uppercase tracking-[0.16em] text-crimson-bright";
  const fieldClass =
    "rounded-[2px] border border-cream/12 bg-navy px-3 py-2 text-[14px] text-cream placeholder:text-cream-warm/70 focus:border-crimson/50";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-[4px] border border-crimson/30 bg-navy/50 p-3.5"
    >
      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-crimson-bright">
        Connect with Matt
      </p>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${uid}-name`} className={labelClass}>
          Name
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          required
          autoComplete="name"
          placeholder="Sarah Landry"
          className={fieldClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${uid}-contact`} className={labelClass}>
          Phone or email
        </label>
        <input
          id={`${uid}-contact`}
          name="contact"
          required
          autoComplete="tel"
          placeholder="318-555-0147"
          className={fieldClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${uid}-note`} className={labelClass}>
          What you’re after{" "}
          <span className="text-cream-warm/70">(optional)</span>
        </label>
        <textarea
          id={`${uid}-note`}
          name="note"
          rows={2}
          placeholder="3 bed under $300k in Pineville"
          className={cn(fieldClass, "resize-none")}
        />
      </div>
      <button
        type="submit"
        disabled={state === "submitting"}
        data-cursor="grow"
        className="rounded-[2px] bg-crimson px-4 py-2.5 font-sans text-[12px] uppercase tracking-[0.16em] text-cream transition-colors hover:bg-crimson-bright disabled:opacity-50"
      >
        {state === "submitting" ? "Sending…" : "Send to Matt"}
      </button>
    </form>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 pl-0.5" aria-label="Ritchie is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-crimson-bright"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** On-brand "live" indicator: a crimson dot with a slow expanding halo.
 *  Replaces the generic green status dot. Respects reduced motion. */
function PulseDot() {
  const reduce = useReducedMotion();
  return (
    <span className="relative grid h-1.5 w-1.5 place-items-center">
      {!reduce && (
        <motion.span
          className="absolute inset-0 rounded-full bg-crimson-bright"
          animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className="relative h-1.5 w-1.5 rounded-full bg-crimson-bright" />
    </span>
  );
}
