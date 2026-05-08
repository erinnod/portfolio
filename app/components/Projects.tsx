import FadeIn from "./FadeIn";
import {
  FEATURED_PROJECTS,
  SECONDARY_PROJECTS,
  type Project,
  type ProjectStatus,
  type ProjectVisualKey,
} from "../data/projects";

const df = "var(--font-unbounded), 'Arial Black', sans-serif";
const bf = "var(--font-epilogue), system-ui, sans-serif";

/* ─── Status pill ──────────────────────────────────────────── */

const STATUS_STYLES: Record<
  ProjectStatus,
  { backgroundColor: string; color: string; borderColor: string }
> = {
  shipped: {
    backgroundColor: "var(--accent)",
    color: "var(--panel-text)",
    borderColor: "var(--accent)",
  },
  building: {
    backgroundColor: "transparent",
    color: "var(--accent)",
    borderColor: "var(--accent)",
  },
  planned: {
    backgroundColor: "transparent",
    color: "var(--ink-3)",
    borderColor: "var(--ink-3)",
  },
};

function StatusPill({
  status,
  label,
}: {
  status: ProjectStatus;
  label: string;
}) {
  const s = STATUS_STYLES[status];
  return (
    <span
      style={{
        fontFamily: df,
        fontWeight: 700,
        fontSize: "0.5625rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        padding: "0.35rem 0.7rem",
        backgroundColor: s.backgroundColor,
        color: s.color,
        border: `1px solid ${s.borderColor}`,
        whiteSpace: "nowrap",
        display: "inline-block",
        lineHeight: 1.2,
      }}
    >
      {label}
    </span>
  );
}

/* ─── Project visuals ──────────────────────────────────────── */

function ScreenshotVisual({
  src,
  alt,
  bg = "oklch(14% 0.008 240)",
  position = "center",
}: {
  src: string;
  alt: string;
  bg?: string;
  position?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.625rem 0.875rem",
          borderBottom: "1px solid oklch(100% 0 0 / 0.08)",
          flexShrink: 0,
        }}
      >
        {[
          "oklch(65% 0.18 25)",
          "oklch(72% 0.16 85)",
          "oklch(68% 0.18 145)",
        ].map((c, i) => (
          <span
            key={i}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: c,
              display: "block",
            }}
          />
        ))}
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: position,
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

function LifeOSVisual() {
  const vault = [
    "/identity.md",
    "/goals.md",
    "/projects/",
    "/patterns/",
  ];
  const mcp = ["filesystem", "notion", "figma", "tasknotes"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "oklch(93% 0.01 22)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "0.625rem",
          borderBottom: "1px solid oklch(82% 0.01 22)",
        }}
      >
        <span
          style={{
            fontFamily: df,
            fontWeight: 700,
            fontSize: "0.5rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "oklch(32% 0.01 22)",
          }}
        >
          Life-OS · vault
        </span>
        <span
          style={{
            fontFamily: bf,
            fontSize: "0.5rem",
            color: "oklch(60% 0.008 22)",
          }}
        >
          Claude Code
        </span>
      </div>

      {/* Vault tree */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {vault.map((entry) => (
          <div
            key={entry}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                backgroundColor: "var(--accent)",
                display: "block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: bf,
                fontSize: "0.6875rem",
                color: "oklch(28% 0.008 22)",
                letterSpacing: "0.02em",
              }}
            >
              {entry}
            </span>
          </div>
        ))}
      </div>

      {/* MCP nodes */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "0.75rem",
          borderTop: "1px solid oklch(82% 0.01 22)",
        }}
      >
        <span
          style={{
            fontFamily: df,
            fontWeight: 700,
            fontSize: "0.4375rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "oklch(56% 0.008 22)",
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          MCP servers
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.4rem 0.75rem",
          }}
        >
          {mcp.map((node) => (
            <div
              key={node}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  border: "1px solid oklch(50% 0.008 22)",
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: bf,
                  fontSize: "0.625rem",
                  color: "oklch(36% 0.008 22)",
                  letterSpacing: "0.02em",
                }}
              >
                {node}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const VISUALS: Record<ProjectVisualKey, React.ReactNode> = {
  figma: (
    <ScreenshotVisual
      src="/project-figma-agent.png"
      alt="Figma → spec agent — project workflow selection screen"
      bg="oklch(12% 0.006 240)"
      position="top center"
    />
  ),
  shopify: (
    <ScreenshotVisual
      src="/project-n8n-workflow.png"
      alt="Shopify product automation — n8n workflow with multiple pipeline stages"
      bg="oklch(10% 0.005 240)"
      position="center"
    />
  ),
  lifeos: <LifeOSVisual />,
};

/* ─── Shared sub-blocks ────────────────────────────────────── */

function StackChips({ stack }: { stack: readonly string[] }) {
  return (
    <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
      {stack.map((tag) => (
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
  );
}

function DemonstratesLine({ text }: { text: string }) {
  return (
    <div style={{ marginTop: "1.25rem" }}>
      <span
        style={{
          fontFamily: df,
          fontWeight: 700,
          fontSize: "0.5625rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          display: "block",
          marginBottom: "0.4rem",
        }}
      >
        Demonstrates
      </span>
      <p
        style={{
          fontFamily: bf,
          fontSize: "0.875rem",
          lineHeight: 1.6,
          color: "var(--ink-2)",
          maxWidth: "58ch",
        }}
      >
        {text}
      </p>
    </div>
  );
}

/* ─── Featured card ────────────────────────────────────────── */

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
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
        <div>
          {/* Index + title */}
          <div
            className="flex items-baseline gap-5"
            style={{ marginBottom: "1rem" }}
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

          {/* Status + qualifier */}
          <div
            className="flex flex-wrap items-center"
            style={{
              gap: "0.75rem",
              marginBottom: "1.75rem",
              paddingBottom: "1.75rem",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <StatusPill
              status={project.status}
              label={project.statusLabel}
            />
            {project.qualifier && (
              <span
                style={{
                  fontFamily: bf,
                  fontStyle: "italic",
                  fontSize: "0.8125rem",
                  color: "var(--ink-3)",
                }}
              >
                {project.qualifier}
              </span>
            )}
          </div>

          {/* Summary */}
          <p
            style={{
              fontFamily: bf,
              fontSize: "0.9375rem",
              lineHeight: 1.75,
              color: "var(--ink-2)",
              maxWidth: "58ch",
              marginBottom: "1.75rem",
            }}
          >
            {project.summary}
          </p>

          {/* Stack */}
          <StackChips stack={project.stack} />

          {/* Demonstrates */}
          <DemonstratesLine text={project.demonstrates} />
        </div>

        {/* Visual */}
        {project.visualKey && (
          <div className="md:sticky" style={{ top: "5.5rem" }}>
            <div
              style={{
                aspectRatio: "4 / 3",
                position: "relative",
                overflow: "hidden",
              }}
              role="img"
              aria-label={`Visual representation of ${project.title}`}
            >
              {VISUALS[project.visualKey]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Secondary card ───────────────────────────────────────── */

function SecondaryProjectCard({ project }: { project: Project }) {
  return (
    <div
      style={{ borderTop: "1px solid var(--border)" }}
      className="px-6 md:px-10"
    >
      <div
        style={{
          paddingTop: "clamp(2rem, 4vw, 3rem)",
          paddingBottom: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        {/* Top row: index + title + status */}
        <div
          className="flex flex-col md:flex-row md:items-baseline md:justify-between"
          style={{ gap: "1rem", marginBottom: "1.25rem" }}
        >
          <div className="flex items-baseline gap-4">
            <span
              aria-hidden="true"
              style={{
                fontFamily: df,
                fontWeight: 900,
                fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
                lineHeight: 1,
                letterSpacing: "-0.025em",
                color: "var(--ink-ghost)",
              }}
            >
              {project.index}
            </span>
            <h3
              style={{
                fontFamily: df,
                fontWeight: 700,
                fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              {project.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: "0.75rem" }}>
            <StatusPill
              status={project.status}
              label={project.statusLabel}
            />
            {project.qualifier && (
              <span
                style={{
                  fontFamily: bf,
                  fontStyle: "italic",
                  fontSize: "0.75rem",
                  color: "var(--ink-3)",
                }}
              >
                {project.qualifier}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        <p
          style={{
            fontFamily: bf,
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "var(--ink-2)",
            maxWidth: "72ch",
            marginBottom: "1.25rem",
          }}
        >
          {project.summary}
        </p>

        {/* Stack */}
        <StackChips stack={project.stack} />

        {/* Demonstrates */}
        <DemonstratesLine text={project.demonstrates} />
      </div>
    </div>
  );
}

/* ─── Secondary block heading ──────────────────────────────── */

function SecondaryHeading() {
  return (
    <div
      className="px-6 md:px-10"
      style={{
        borderTop: "1px solid var(--border)",
        paddingTop: "clamp(3rem, 6vw, 4.5rem)",
        paddingBottom: "clamp(1.25rem, 2vw, 1.75rem)",
      }}
    >
      <p
        style={{
          fontFamily: df,
          fontWeight: 400,
          fontSize: "0.625rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--ink-ghost)",
          marginBottom: "0.875rem",
        }}
      >
        [02b] Also building & planned
      </p>
      <h2
        style={{
          fontFamily: df,
          fontWeight: 900,
          fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          color: "var(--ink)",
        }}
      >
        Active builds and queued projects.
      </h2>
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────── */

export default function Projects() {
  return (
    <section style={{ backgroundColor: "var(--bg)" }}>
      {FEATURED_PROJECTS.map((project, i) => (
        <FadeIn key={project.index} delay={(i % 3) as 0 | 1 | 2}>
          <FeaturedProjectCard project={project} />
        </FadeIn>
      ))}

      <FadeIn>
        <SecondaryHeading />
      </FadeIn>

      {SECONDARY_PROJECTS.map((project, i) => (
        <FadeIn key={project.index} delay={(i % 3) as 0 | 1 | 2}>
          <SecondaryProjectCard project={project} />
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
