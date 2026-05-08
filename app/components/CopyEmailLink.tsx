"use client";

import { useCallback, useState } from "react";

const displayFont = "var(--font-unbounded), 'Arial Black', sans-serif";

interface CopyEmailLinkProps {
  email: string;
}

export default function CopyEmailLink({ email }: CopyEmailLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — fall back to selecting the address.
      const range = document.createRange();
      const selection = window.getSelection();
      const fallbackEl = document.createElement("span");
      fallbackEl.textContent = email;
      document.body.appendChild(fallbackEl);
      range.selectNode(fallbackEl);
      selection?.removeAllRanges();
      selection?.addRange(range);
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } finally {
        selection?.removeAllRanges();
        document.body.removeChild(fallbackEl);
      }
    }
  }, [email]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        copied
          ? `Email address ${email} copied to clipboard`
          : `Copy email address ${email} to clipboard`
      }
      className="group flex items-center"
      style={{
        gap: "0.875rem",
        textDecoration: "none",
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
      }}
    >
      <span
        className="group-hover:translate-x-1 transition-transform duration-200"
        style={{
          fontFamily: displayFont,
          fontWeight: 900,
          fontSize: "0.875rem",
          color: "var(--accent)",
        }}
      >
        →
      </span>
      <span
        className="group-hover:opacity-60 transition-opacity duration-200"
        style={{
          fontFamily: displayFont,
          fontWeight: 700,
          fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          textTransform: "uppercase",
        }}
      >
        {copied ? "Copied" : "Email"}
      </span>
    </button>
  );
}
