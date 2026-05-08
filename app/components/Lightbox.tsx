"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const df = "var(--font-unbounded), 'Arial Black', sans-serif";
const bf = "var(--font-epilogue), system-ui, sans-serif";

export interface ImageEntry {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/* ─── Lightbox modal (multi-image aware) ───────────────────── */

interface LightboxProps {
  onClose: () => void;
  images: ImageEntry[];
  startIndex?: number;
}

function Lightbox({ onClose, images, startIndex = 0 }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext]);

  const current = images[index];
  const multi = images.length > 1;

  if (!current) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
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
        padding:
          "clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)",
        cursor: "zoom-out",
        overflowY: "auto",
      }}
    >
          {/* Close button */}
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

          {/* Image */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(95vw, 1600px)",
                marginTop: "auto",
                marginBottom: "auto",
                cursor: "default",
                boxShadow: "0 30px 80px -10px oklch(0% 0 0 / 0.5)",
                lineHeight: 0,
              }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="100vw"
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Bottom bar: caption + nav */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: "1.25rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.875rem",
              maxWidth: "100%",
            }}
          >
            {current.caption && (
              <p
                style={{
                  fontFamily: bf,
                  fontSize: "0.75rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "oklch(82% 0.005 22)",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {current.caption}
              </p>
            )}

            {multi && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.875rem",
                }}
              >
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  style={lightboxNavBtn}
                >
                  ‹
                </button>
                <span
                  style={{
                    fontFamily: df,
                    fontWeight: 700,
                    fontSize: "0.625rem",
                    letterSpacing: "0.22em",
                    color: "oklch(82% 0.005 22)",
                    minWidth: "3.5rem",
                    textAlign: "center",
                  }}
                >
                  {index + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  style={lightboxNavBtn}
                >
                  ›
                </button>
              </div>
            )}
          </div>
    </motion.div>
  );
}

const lightboxNavBtn = {
  background: "transparent",
  border: "1px solid oklch(70% 0.005 22 / 0.4)",
  color: "oklch(95% 0.005 22)",
  fontFamily: df,
  fontSize: "1.125rem",
  lineHeight: 1,
  width: "2.25rem",
  height: "2.25rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

/* ─── Frame (shared inner-image styling) ───────────────────── */

const frameStyle = {
  backgroundColor: "var(--bg-tint)",
  border: "1px solid var(--border)",
  overflow: "hidden",
} as const;

/* ─── Single clickable image (figure plate w/ caption) ─────── */

interface ClickableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  figNumber: string;
  caption: string;
  sizes?: string;
}

export default function ClickableImage({
  src,
  alt,
  width,
  height,
  figNumber,
  caption,
  sizes = "(min-width: 768px) 80vw, 100vw",
}: ClickableImageProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const lightboxImages: ImageEntry[] = [
    { src, alt, width, height, caption: `Fig. ${figNumber} — ${caption}` },
  ];

  return (
    <figure style={{ margin: 0 }}>
      <div style={frameStyle}>
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
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </button>
      </div>
      <FigCaption figNumber={figNumber} caption={caption} clickable />
      <AnimatePresence>
        {open && (
          <Lightbox
            onClose={handleClose}
            images={lightboxImages}
            startIndex={0}
          />
        )}
      </AnimatePresence>
    </figure>
  );
}

/* ─── Image carousel (figure plate with prev/next + lightbox) */

interface ImageCarouselProps {
  images: ImageEntry[];
  figNumber: string;
  sizes?: string;
}

export function ImageCarousel({
  images,
  figNumber,
  sizes = "(min-width: 768px) 80vw, 100vw",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const goPrev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const goNext = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const current = images[index];

  // Build image list for lightbox with prefixed Fig. captions
  const lightboxImages: ImageEntry[] = images.map((img) => ({
    ...img,
    caption: img.caption ? `Fig. ${figNumber} — ${img.caption}` : undefined,
  }));

  return (
    <figure style={{ margin: 0 }}>
      <div style={frameStyle}>
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`View ${current.alt} at full size`}
          style={{
            background: "transparent",
            border: 0,
            padding: 0,
            margin: 0,
            cursor: "zoom-in",
            display: "block",
            width: "100%",
            lineHeight: 0,
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ width: "100%", lineHeight: 0 }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes={sizes}
                priority={index === 0}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Caption row with nav */}
      <figcaption
        className="flex flex-col md:flex-row md:items-baseline md:justify-between"
        style={{ marginTop: "0.875rem", gap: "0.6rem 1.5rem" }}
      >
        <span
          style={{
            fontFamily: bf,
            fontSize: "0.75rem",
            color: "var(--ink-3)",
            lineHeight: 1.5,
          }}
        >
          <span
            style={{
              fontFamily: df,
              fontWeight: 700,
              fontSize: "0.625rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginRight: "0.6rem",
              color: "var(--ink-2)",
            }}
          >
            Fig. {figNumber}.{index + 1}
          </span>
          {current.caption}
        </span>

        <div
          className="flex items-center"
          style={{ gap: "1rem", flexShrink: 0 }}
        >
          <CarouselNav
            index={index}
            total={images.length}
            onPrev={goPrev}
            onNext={goNext}
          />
          <span
            aria-hidden="true"
            style={{
              fontFamily: df,
              fontWeight: 700,
              fontSize: "0.625rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent)",
              whiteSpace: "nowrap",
            }}
          >
            Click to expand ↗
          </span>
        </div>
      </figcaption>

      <AnimatePresence>
        {open && (
          <Lightbox
            onClose={handleClose}
            images={lightboxImages}
            startIndex={index}
          />
        )}
      </AnimatePresence>
    </figure>
  );
}

/* ─── Carousel nav (arrows + dots + counter) ───────────────── */

function CarouselNav({
  index,
  total,
  onPrev,
  onNext,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.65rem",
      }}
    >
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous image"
        style={navBtn}
      >
        ‹
      </button>
      <span
        style={{
          fontFamily: df,
          fontWeight: 700,
          fontSize: "0.625rem",
          letterSpacing: "0.22em",
          color: "var(--ink-2)",
          minWidth: "2.75rem",
          textAlign: "center",
        }}
      >
        {index + 1} / {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next image"
        style={navBtn}
      >
        ›
      </button>
    </div>
  );
}

const navBtn = {
  background: "transparent",
  border: "1px solid var(--border)",
  color: "var(--ink-2)",
  fontFamily: df,
  fontSize: "1rem",
  lineHeight: 1,
  width: "1.85rem",
  height: "1.85rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

/* ─── Static figcaption (used by ClickableImage) ───────────── */

function FigCaption({
  figNumber,
  caption,
  clickable,
}: {
  figNumber: string;
  caption: string;
  clickable?: boolean;
}) {
  return (
    <figcaption
      className="flex flex-col md:flex-row md:items-baseline md:justify-between"
      style={{ marginTop: "0.875rem", gap: "0.5rem 1.5rem" }}
    >
      <span
        style={{
          fontFamily: bf,
          fontSize: "0.75rem",
          color: "var(--ink-3)",
          lineHeight: 1.5,
        }}
      >
        <span
          style={{
            fontFamily: df,
            fontWeight: 700,
            fontSize: "0.625rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginRight: "0.6rem",
            color: "var(--ink-2)",
          }}
        >
          Fig. {figNumber}
        </span>
        {caption}
      </span>
      {clickable && (
        <span
          aria-hidden="true"
          style={{
            fontFamily: df,
            fontWeight: 700,
            fontSize: "0.625rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
            whiteSpace: "nowrap",
          }}
        >
          Click to expand ↗
        </span>
      )}
    </figcaption>
  );
}
