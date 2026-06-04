"use client";

import Link from "next/link";
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

const GREETING: UIMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "I'm Matt's desk on the web — I know every active listing in Central Louisiana. What are you after?",
  chips: [
    "Find me a home",
    "Commercial space",
    "Land & acreage",
    "How's the market?",
    "Sell my house",
  ],
};

let idSeq = 0;
const nextId = () => `m${++idSeq}-${Date.now()}`;

export function AskRitchie() {
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
  const titleId = useId();

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
      const t = setTimeout(() => inputRef.current?.focus(), 280);
      return () => clearTimeout(t);
    }
  }, [open, scrollToEnd]);

  useEffect(() => {
    if (open) scrollToEnd();
  }, [messages, loading, open, scrollToEnd]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
              "Couldn't file that just now — call or text Matt at 318-449-8919 and he'll take care of you.",
          },
        ]);
      }
    },
    [leadState, messages],
  );

  const dur = reduce ? 0 : 0.42;

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask Ritchie — chat with the Cenla concierge"
            initial={reduce ? false : { opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            data-cursor="grow"
            className="group fixed bottom-5 right-5 z-[80] flex items-center gap-3 rounded-full border border-cream/15 bg-navy-deep/90 py-2.5 pl-2.5 pr-5 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md transition-colors hover:border-crimson/50 md:bottom-7 md:right-7"
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
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "fixed z-[80] flex flex-col overflow-hidden border border-cream/12 bg-navy-deep shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]",
                // Mobile: full sheet. Desktop: docked card.
                "inset-0 rounded-none",
                "md:inset-auto md:bottom-7 md:right-7 md:h-[640px] md:max-h-[calc(100vh-3.5rem)] md:w-[412px] md:rounded-[4px]",
              )}
            >
              {/* Header */}
              <header className="relative flex items-center gap-3 border-b border-cream/10 bg-navy-ink/60 px-5 py-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-navy">
                  <LogoMark tone="light" size={26} />
                </span>
                <span className="leading-tight">
                  <span
                    id={titleId}
                    className="block font-serif text-[18px] text-cream"
                  >
                    Ask Ritchie
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.22em] text-cream-warm/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online · answers in seconds
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  data-cursor="grow"
                  className="ml-auto grid h-9 w-9 place-items-center rounded-full text-cream-warm/70 transition-colors hover:bg-cream/10 hover:text-cream"
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
                className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
              >
                {messages.map((m) => (
                  <MessageBlock
                    key={m.id}
                    message={m}
                    onChip={send}
                    leadState={leadState}
                    onLeadSubmit={submitLead}
                    onCloseAfterNav={() => setOpen(false)}
                  />
                ))}
                {loading && <TypingDots />}
              </div>

              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="border-t border-cream/10 bg-navy-ink/40 px-3 py-3"
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
                    className="max-h-28 min-h-[22px] flex-1 resize-none bg-transparent text-[14px] text-cream placeholder:text-cream-warm/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    aria-label="Send"
                    data-cursor="grow"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] bg-crimson text-cream transition-colors hover:bg-crimson-bright disabled:opacity-35"
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
                <p className="mt-1.5 px-1 text-center font-sans text-[9.5px] uppercase tracking-[0.18em] text-cream-warm/35">
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
      ? `${listing.sqft ? "" : ""}Land`
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
      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-[2px] bg-navy">
        {listing.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="truncate font-serif text-[14px] text-cream">
          {listing.title}
        </span>
        <span className="truncate font-sans text-[11px] text-cream-warm/60">
          {listing.neighborhood
            ? `${listing.neighborhood}, ${listing.city}`
            : listing.city}
        </span>
        <span className="mt-0.5 flex items-baseline gap-2">
          <span className="font-serif text-[14px] text-crimson-bright">
            {listing.price}
          </span>
          <span className="truncate font-sans text-[10px] uppercase tracking-[0.12em] text-cream-warm/45">
            {meta}
          </span>
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
  if (state === "done") return null;
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2.5 rounded-[4px] border border-crimson/30 bg-navy/50 p-3.5"
    >
      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-crimson-bright">
        Connect with Matt
      </p>
      <input
        name="name"
        required
        autoComplete="name"
        placeholder="Your name"
        className="rounded-[2px] border border-cream/12 bg-navy px-3 py-2 text-[14px] text-cream placeholder:text-cream-warm/40 focus:border-crimson/50 focus:outline-none"
      />
      <input
        name="contact"
        required
        autoComplete="email tel"
        placeholder="Phone or email"
        className="rounded-[2px] border border-cream/12 bg-navy px-3 py-2 text-[14px] text-cream placeholder:text-cream-warm/40 focus:border-crimson/50 focus:outline-none"
      />
      <textarea
        name="note"
        rows={2}
        placeholder="What are you after? (optional)"
        className="resize-none rounded-[2px] border border-cream/12 bg-navy px-3 py-2 text-[14px] text-cream placeholder:text-cream-warm/40 focus:border-crimson/50 focus:outline-none"
      />
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
