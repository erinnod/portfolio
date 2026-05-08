import FadeIn from "./FadeIn";

const displayFont = "var(--font-unbounded), 'Arial Black', sans-serif";
const bodyFont = "var(--font-epilogue), system-ui, sans-serif";

export default function About() {
  return (
    <section
      id="about"
      style={{
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
        paddingTop: "clamp(4rem, 8vw, 7rem)",
        paddingBottom: "clamp(4rem, 8vw, 7rem)",
      }}
    >
      {/* Section label */}
      <FadeIn>
        <div
          className="flex items-baseline gap-4 px-6 md:px-10"
          style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <span
            style={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: "0.6875rem",
              letterSpacing: "0.2em",
              color: "var(--ink-3)",
            }}
          >
            [01]
          </span>
          <span
            style={{
              fontFamily: bodyFont,
              fontSize: "0.6875rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--ink-ghost)",
            }}
          >
            About
          </span>
        </div>
      </FadeIn>

      {/* Two-column: headline left, body right */}
      <div className="px-6 md:px-10 grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-12 md:gap-20 items-start">
        <FadeIn delay={1}>
          <h2
            style={{
              fontFamily: displayFont,
              fontWeight: 900,
              fontSize: "clamp(2.75rem, 5.5vw, 6rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              color: "var(--ink)",
            }}
          >
            Building
            <br />
            AI that{" "}
            <span style={{ color: "var(--accent)" }}>works</span>
            <br />
            in the
            <br />
            real world.
          </h2>
        </FadeIn>

        <FadeIn delay={2}>
          <div
            className="flex flex-col"
            style={{ gap: "1.5rem", paddingTop: "0.25rem" }}
          >
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "var(--ink-2)",
                maxWidth: "58ch",
              }}
            >
              I&apos;m a Software Developer specialising in AI at Shoothill,
              where I design AI agents, build automation workflows, and help
              businesses figure out where AI actually fits. I work across the
              full stack of AI tooling — from prompt engineering and LLM
              integration to no-code platforms like n8n and API orchestration.
            </p>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "var(--ink-2)",
                maxWidth: "58ch",
              }}
            >
              My focus is on applied AI: building things that work in
              production, not just in demos. I&apos;m working toward AI strategy
              and leadership, with a clear path from hands-on building to
              advising businesses on how to adopt AI effectively.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
