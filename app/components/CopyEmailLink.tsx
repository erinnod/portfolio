"use client";

import { useCallback, useState } from "react";
import { EMAIL_DISPLAY, emailAddress } from "../data/projects";

/**
 * Shows the scraper-resistant address ("name [at] gmail (dot) com"). The real address is assembled only on
 * click, then copied to the clipboard, so it never sits in the page's HTML.
 */
export default function CopyEmailLink({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const flash = useCallback(() => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, []);

  const handleClick = useCallback(async () => {
    const address = emailAddress();
    try {
      await navigator.clipboard.writeText(address);
      flash();
    } catch {
      // Clipboard API unavailable: fall back to a selection copy.
      const el = document.createElement("span");
      el.textContent = address;
      document.body.appendChild(el);
      const range = document.createRange();
      range.selectNode(el);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      try {
        document.execCommand("copy");
        flash();
      } finally {
        selection?.removeAllRanges();
        document.body.removeChild(el);
      }
    }
  }, [flash]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? "Email address copied to clipboard" : `Copy email address: ${EMAIL_DISPLAY}`}
      className={className}
    >
      <span aria-live="polite">{copied ? "Email copied" : EMAIL_DISPLAY}</span>
    </button>
  );
}
