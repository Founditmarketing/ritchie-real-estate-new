"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { api } from "../../../api";

/**
 * The hero action row: Call / Text / Email as native links (tel:, sms:,
 * mailto:) sized for thumbs. Each tap also logs a contact attempt —
 * fire-and-forget, then refresh so the timeline catches up.
 */
export function ContactButtons({
  leadId,
  contact,
  message,
}: {
  leadId: string;
  contact: string;
  message: string;
}) {
  const router = useRouter();

  const trimmed = contact.trim();
  const isPhone = /\d{3}.*\d{4}/.test(trimmed);
  const isEmail = /^\S+@\S+\.\S+$/.test(trimmed);
  const tel = trimmed.replace(/[^\d+]/g, "");
  const body = encodeURIComponent(message);

  function log(how: "call" | "text" | "email") {
    void api(`/api/crm/leads/${leadId}`, { contact: how }, "PATCH").then(() =>
      router.refresh(),
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <Action
          enabled={isPhone}
          primary={isPhone}
          href={`tel:${tel}`}
          label="Call"
          icon={<PhoneIcon />}
          onTap={() => log("call")}
        />
        <Action
          enabled={isPhone}
          href={message ? `sms:${tel}?body=${body}` : `sms:${tel}`}
          label="Text"
          icon={<ChatIcon />}
          onTap={() => log("text")}
        />
        <Action
          enabled={isEmail}
          primary={isEmail && !isPhone}
          href={message ? `mailto:${trimmed}?body=${body}` : `mailto:${trimmed}`}
          label="Email"
          icon={<MailIcon />}
          onTap={() => log("email")}
        />
      </div>
      {!isPhone && !isEmail && (
        <p className="mt-2 font-sans text-[12.5px] text-mute">
          No phone or email we can use — check the contact info:{" "}
          <span className="text-cream-warm">{contact}</span>
        </p>
      )}
    </div>
  );
}

function Action({
  enabled,
  primary = false,
  href,
  label,
  icon,
  onTap,
}: {
  enabled: boolean;
  primary?: boolean;
  href: string;
  label: string;
  icon: React.ReactNode;
  onTap: () => void;
}) {
  const base =
    "flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-[3px] font-sans text-[12px] font-medium uppercase tracking-[0.14em]";
  if (!enabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(base, "border border-line text-mute opacity-60")}
      >
        <span className="grid h-6 w-6 place-items-center">{icon}</span>
        {label}
      </span>
    );
  }
  return (
    <a
      href={href}
      onClick={onTap}
      className={cn(
        base,
        "transition-colors active:scale-[0.97]",
        primary
          ? "bg-crimson text-cream hover:bg-crimson-deep"
          : "border border-line-strong bg-navy text-cream hover:bg-navy-soft",
      )}
    >
      <span className="grid h-6 w-6 place-items-center">{icon}</span>
      {label}
    </a>
  );
}

const ICON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <path d="M6.5 4h3l1.4 4-2 1.4a11 11 0 0 0 5.2 5.2l1.4-2 4 1.4v3a1.8 1.8 0 0 1-2 1.8A15 15 0 0 1 4.7 6 1.8 1.8 0 0 1 6.5 4Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
