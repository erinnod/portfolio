"use client";

import { useCallback, useState } from "react";

export default function CopyEmailLink({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const flash = useCallback(() => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, []);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      flash();
    } catch {
      // Clipboard API unavailable: fall back to a selection copy.
      const el = document.createElement("span");
      el.textContent = email;
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
  }, [email, flash]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? `Email address ${email} copied` : `Copy email address ${email}`}
      className={className}
    >
      {copied ? "Email copied" : "Copy email address"}
    </button>
  );
}
