import FadeIn from "./FadeIn";

const df = "var(--font-unbounded), 'Arial Black', sans-serif";
const bf = "var(--font-epilogue), system-ui, sans-serif";

const PROJECTS = [
  {
    index: "01",
    title: "Figma Design Review Agent",
    result: "Design review time: 2–3 hours → under 2 minutes",
    challenge:
      "Every developer team wastes 2–3 hours manually reviewing Figma designs, asking 'what happens if...?', 'who can see this?', 'where does this data come from?' — and they still miss things. Missed questions blow up mid-project as expensive rework.",
    built:
      "An AI agent that reads an entire Figma file, screenshots every screen, analyses the design, and generates two polished HTML reports in under 2 minutes — a Customer Report with plain-English business questions for stakeholders, and a Developer Report with technical implementation questions for the engineering team. Each question is prioritised (High/Medium/Low), tagged by theme, and backed by evidence from the actual design.",
    stack: ["Claude API", "Figma API", "Cursor", "HTML/CSS"],
  },
  {
    index: "02",
    title: "E-Commerce Product Automation",
    result: "15–20 minutes per product → fully automated",
    challenge:
      "A client needed to process product images, generate SEO-optimised titles and descriptions, and upload everything to Shopify — manually doing this for each product took 15–20 minutes.",
    built:
      "An n8n workflow that handles the entire pipeline: image upload to Google Drive, automated image editing (resizing, white background processing), AI-generated product titles and descriptions using Claude, and direct upload to Shopify. The client drops an image and the rest is automatic.",
    stack: ["n8n", "Claude API", "Google Drive API", "Shopify API"],
  },
  {
    index: "03",
    title: "AI Morning Brief Agent",
    result: "30 minutes of research → a 2-minute Telegram read",
    challenge:
      "A personalised daily briefing that combines weather, calendar, tasks, and AI industry news — synthesised by an AI into something that reads like a chief of staff wrote it, not a news aggregator.",
    built:
      "A daily automation that pulls from 6 data sources (weather API, Hacker News, RSS feeds, Notion calendar, Notion tasks), feeds everything through Claude with a carefully engineered system prompt, and delivers a structured morning brief via Telegram at 9am. The prompt is designed to prioritise news relevant to my specific career path and flag skill gaps.",
    stack: [
      "n8n",
      "Claude Sonnet",
      "Telegram Bot API",
      "Notion API",
      "Open-Meteo API",
      "Hacker News API",
      "RSS",
    ],
  },
];

/* ─── Project visuals ──────────────────────────────────────── */

function ReportVisual() {
  const rows = [
    { tag: "HIGH", widths: [88, 62] },
    { tag: "HIGH", widths: [76, 50, 38] },
    { tag: "MED",  widths: [82, 55] },
    { tag: "LOW",  widths: [70] },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "oklch(93% 0.01 22)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.125rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "0.875rem",
          borderBottom: "1px solid oklch(82% 0.01 22)",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ fontFamily: df, fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(42% 0.01 22)" }}>
          Developer Report
        </span>
        <span style={{ fontFamily: bf, fontSize: "0.5rem", color: "oklch(60% 0.008 22)" }}>
          47 questions
        </span>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", paddingBottom: "0.625rem" }}>
          <span
            style={{
              fontFamily: df,
              fontSize: "0.4375rem",
              letterSpacing: "0.1em",
              padding: "0.15rem 0.4rem",
              border: `1px solid ${row.tag === "HIGH" ? "var(--accent)" : "oklch(74% 0.01 22)"}`,
              color: row.tag === "HIGH" ? "var(--accent)" : "oklch(58% 0.008 22)",
              flexShrink: 0,
              lineHeight: 1.6,
            }}
          >
            {row.tag}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1, paddingTop: "0.3rem" }}>
            {row.widths.map((w, j) => (
              <div
                key={j}
                style={{
                  height: "5px",
                  width: `${w}%`,
                  backgroundColor: "oklch(76% 0.008 22)",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkflowVisual() {
  const steps = [
    { label: "IMAGE", sub: "Google Drive" },
    { label: "CLAUDE", sub: "AI generation" },
    { label: "SHOPIFY", sub: "Auto upload" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "oklch(93% 0.01 160)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0", width: "100%" }}>
        {steps.map((step, i) => (
          <div key={step.label} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? "1" : "0 0 auto" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.375rem",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  border: "1px solid oklch(72% 0.012 160)",
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "oklch(97% 0.006 160)",
                }}
              >
                <span style={{ fontFamily: df, fontSize: "0.5rem", letterSpacing: "0.15em", color: "oklch(32% 0.01 160)" }}>
                  {step.label}
                </span>
              </div>
              <span style={{ fontFamily: bf, fontSize: "0.4375rem", color: "oklch(56% 0.008 160)", letterSpacing: "0.05em" }}>
                {step.sub}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "1.125rem" }}>
                <span style={{ fontFamily: df, fontWeight: 900, fontSize: "0.625rem", color: "oklch(62% 0.01 160)" }}>
                  →
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pipeline label */}
      <div
        style={{
          borderTop: "1px solid oklch(82% 0.01 160)",
          paddingTop: "0.75rem",
          width: "100%",
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: df, fontSize: "0.4375rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(58% 0.008 160)" }}>
          n8n automation pipeline
        </span>
      </div>
    </div>
  );
}

function TelegramVisual() {
  const lines = [
    { widths: [90, 72], label: "Weather · Tasks · News" },
    { widths: [85, 60], label: "AI Developments" },
    { widths: [78, 50], label: "Skill gaps flagged" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "oklch(93% 0.008 240)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          backgroundColor: "oklch(98% 0.004 22)",
          border: "1px solid oklch(88% 0.006 22)",
          padding: "1rem 1.125rem",
          width: "100%",
          maxWidth: "88%",
        }}
      >
        {/* Chat header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "0.625rem",
            borderBottom: "1px solid oklch(90% 0.005 22)",
            marginBottom: "0.75rem",
          }}
        >
          <span style={{ fontFamily: df, fontWeight: 700, fontSize: "0.5625rem", letterSpacing: "0.05em", color: "oklch(30% 0.01 22)" }}>
            Morning Brief
          </span>
          <span style={{ fontFamily: bf, fontSize: "0.5rem", color: "oklch(65% 0.006 22)" }}>
            09:00
          </span>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {lines.map((section, i) => (
            <div key={i}>
              <span style={{ fontFamily: bf, fontSize: "0.4375rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(62% 0.008 22)", display: "block", marginBottom: "0.3rem" }}>
                {section.label}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {section.widths.map((w, j) => (
                  <div key={j} style={{ height: "4px", width: `${w}%`, backgroundColor: "oklch(80% 0.007 22)" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenshotVisual({ src, alt, bg = "oklch(14% 0.008 240)", position = "center" }: { src: string; alt: string; bg?: string; position?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: bg, display: "flex", flexDirection: "column" }}>
      {/* Window chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 0.875rem", borderBottom: "1px solid oklch(100% 0 0 / 0.08)", flexShrink: 0 }}>
        {["oklch(65% 0.18 25)", "oklch(72% 0.16 85)", "oklch(68% 0.18 145)"].map((c, i) => (
          <span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: c, display: "block" }} />
        ))}
      </div>
      {/* Screenshot */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: position, display: "block" }}
        />
      </div>
    </div>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  "01": (
    <ScreenshotVisual
      src="/project-figma-agent.png"
      alt="Figma Design Review Agent — project workflow selection screen"
      bg="oklch(12% 0.006 240)"
      position="top center"
    />
  ),
  "02": (
    <ScreenshotVisual
      src="/project-n8n-workflow.png"
      alt="E-Commerce Product Automation — n8n workflow with 4 pipeline stages"
      bg="oklch(10% 0.005 240)"
      position="center"
    />
  ),
  "03": <TelegramVisual />,
};

/* ─── Main component ───────────────────────────────────────── */

export default function Projects() {
  return (
    <section style={{ backgroundColor: "var(--bg)" }}>
      {PROJECTS.map((project, i) => (
        <FadeIn key={project.index} delay={(i % 3) as 0 | 1 | 2 | 3}>
          <div
            style={{ borderTop: "1px solid var(--border)" }}
            className="px-6 md:px-10"
          >
            <div
              className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 md:gap-16 items-start"
              style={{
                paddingTop: "clamp(3rem, 6vw, 5rem)",
                paddingBottom: "clamp(3rem, 6vw, 5rem)",
              }}
            >
              {/* Content */}
              <div>
                {/* Index + title */}
                <div
                  className="flex items-baseline gap-5"
                  style={{ marginBottom: "1.25rem" }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: df,
                      fontWeight: 900,
                      fontSize: "clamp(3rem, 6vw, 6rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      color: "var(--ink-ghost)",
                    }}
                  >
                    {project.index}
                  </span>
                  <h3
                    style={{
                      fontFamily: df,
                      fontWeight: 700,
                      fontSize: "clamp(1.125rem, 2.2vw, 1.75rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.015em",
                      color: "var(--ink)",
                    }}
                  >
                    {project.title}
                  </h3>
                </div>

                {/* Result — moved to top */}
                <div
                  className="flex items-baseline"
                  style={{ gap: "0.75rem", marginBottom: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid var(--border-light)" }}
                >
                  <span
                    style={{
                      fontFamily: df,
                      fontWeight: 900,
                      fontSize: "0.875rem",
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}
                  >
                    →
                  </span>
                  <p
                    style={{
                      fontFamily: df,
                      fontWeight: 700,
                      fontSize: "clamp(0.8125rem, 1.4vw, 1rem)",
                      letterSpacing: "-0.005em",
                      color: "var(--ink)",
                      lineHeight: 1.3,
                    }}
                  >
                    {project.result}
                  </p>
                </div>

                {/* Challenge */}
                <p
                  style={{
                    fontFamily: bf,
                    fontSize: "0.9375rem",
                    lineHeight: 1.75,
                    color: "var(--ink-3)",
                    maxWidth: "58ch",
                    marginBottom: "1.75rem",
                  }}
                >
                  {project.challenge}
                </p>

                {/* What I Built */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <p
                    style={{
                      fontFamily: df,
                      fontWeight: 700,
                      fontSize: "0.625rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    What I Built
                  </p>
                  <p
                    style={{
                      fontFamily: bf,
                      fontSize: "0.9375rem",
                      lineHeight: 1.75,
                      color: "var(--ink-2)",
                      maxWidth: "58ch",
                    }}
                  >
                    {project.built}
                  </p>
                </div>

                {/* Stack */}
                <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                  {project.stack.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: bf,
                        fontSize: "0.625rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        border: "1px solid var(--border)",
                        padding: "0.3rem 0.75rem",
                        color: "var(--ink-3)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual — sticky on desktop */}
              <div className="md:sticky" style={{ top: "5.5rem" }}>
                <div
                  style={{
                    aspectRatio: "4 / 3",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  role="img"
                  aria-label={`Visual representation of ${project.title} output`}
                >
                  {VISUALS[project.index]}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      ))}

      {/* Claude Code footnote */}
      <div
        className="px-6 md:px-10"
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
        }}
      >
        <p
          style={{
            fontFamily: bf,
            fontSize: "0.625rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ink-ghost)",
          }}
        >
          This site was built using Claude Code.
        </p>
      </div>
    </section>
  );
}
