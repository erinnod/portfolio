"use client";

const FIRST = ["E", "R", "I", "N"];
const LAST = ["N", "O", "D", "L", "A", "N", "D"];

const displayFont = "var(--font-unbounded), 'Arial Black', sans-serif";

export default function Hero() {
  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "var(--bg)" }}
    >
      {/* Top metadata strip */}
      <div
        className="flex items-center justify-between px-6 md:px-10 hero-meta-animate"
        style={{ paddingTop: "5.5rem" }}
      >
        <span
          style={{
            fontFamily: displayFont,
            fontWeight: 400,
            fontSize: "0.625rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--ink-ghost)",
          }}
        >
          Portfolio · 2026
        </span>
        <span
          style={{
            fontFamily: displayFont,
            fontWeight: 400,
            fontSize: "0.625rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--ink-ghost)",
          }}
        >
          Shoothill
        </span>
      </div>

      {/* Name block — pushes down, anchors at bottom */}
      <div
        className="flex-1 flex flex-col justify-end px-4 md:px-7"
        style={{ paddingBottom: 0 }}
      >
        {/* Accessible heading — visually hidden, replaced by animated letters */}
        <h1 className="sr-only">Erin Nodland</h1>

        {/* ERIN */}
        <div
          className="overflow-hidden"
          aria-hidden="true"
          style={{ lineHeight: 0.88 }}
        >
          {FIRST.map((letter, i) => (
            <span
              key={i}
              className="letter-animate"
              style={{
                fontFamily: displayFont,
                fontWeight: 900,
                fontSize: "clamp(3rem, 12vw, 16rem)",
                letterSpacing: "-0.025em",
                color: "var(--ink)",
                animationDelay: `${0.12 + i * 0.07}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* NODLAND */}
        <div
          className="overflow-hidden"
          aria-hidden="true"
          style={{ lineHeight: 0.88 }}
        >
          {LAST.map((letter, i) => (
            <span
              key={i}
              className="letter-animate"
              style={{
                fontFamily: displayFont,
                fontWeight: 900,
                fontSize: "clamp(3rem, 12vw, 16rem)",
                letterSpacing: "-0.025em",
                color: "var(--ink)",
                animationDelay: `${0.12 + (FIRST.length + i) * 0.07}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-6 md:px-10 hero-subtitle-animate"
        style={{
          paddingTop: "1.75rem",
          paddingBottom: "1.75rem",
          marginTop: "1.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <p
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            Software Developer specialising in AI
          </p>
          <p
            className="hero-tagline-animate"
            style={{
              fontFamily: "var(--font-epilogue), system-ui, sans-serif",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              maxWidth: "36ch",
              color: "var(--ink-3)",
            }}
          >
            I design and build AI agents and automation workflows that solve
            real business problems.
          </p>
        </div>
      </div>
    </section>
  );
}
