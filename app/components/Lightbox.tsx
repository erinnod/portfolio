"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const df = "var(--font-unbounded), 'Arial Black', sans-serif";
const bf = "var(--font-epilogue), system-ui, sans-serif";

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

function Lightbox({
  open,
  onClose,
  src,
  alt,
  width,
  height,
  caption,
}: LightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "oklch(8% 0.008 22 / 0.94)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding:
              "clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)",
            cursor: "zoom-out",
          }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "transparent",
              border: "1px solid oklch(70% 0.005 22 / 0.4)",
              color: "oklch(95% 0.005 22)",
              fontFamily: df,
              fontWeight: 700,
              fontSize: "0.625rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "0.55rem 0.9rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span aria-hidden="true" style={{ fontSize: "0.875rem", lineHeight: 1 }}>
              ×
            </span>
            Close · Esc
          </button>

          <motion.div
            initial={{ scale: 0.985 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.985 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: caption ? "calc(100vh - 9rem)" : "calc(100vh - 7rem)",
              display: "flex",
              cursor: "default",
              boxShadow: "0 30px 80px -10px oklch(0% 0 0 / 0.5)",
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="100vw"
              priority
              style={{
                maxWidth: "100%",
                maxHeight: caption ? "calc(100vh - 9rem)" : "calc(100vh - 7rem)",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </motion.div>

          {caption && (
            <p
              style={{
                fontFamily: bf,
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "oklch(80% 0.005 22)",
                marginTop: "1.25rem",
                textAlign: "center",
              }}
            >
              {caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ClickableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  sizes?: string;
}

export default function ClickableImage({
  src,
  alt,
  width,
  height,
  caption,
  sizes = "(min-width: 768px) 80vw, 100vw",
}: ClickableImageProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`View ${alt} at full size`}
        style={{
          background: "transparent",
          border: 0,
          padding: 0,
          margin: 0,
          cursor: "zoom-in",
          display: "block",
          width: "100%",
          lineHeight: 0,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={false}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </button>
      <Lightbox
        open={open}
        onClose={handleClose}
        src={src}
        alt={alt}
        width={width}
        height={height}
        caption={caption}
      />
    </>
  );
}
