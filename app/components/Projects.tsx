import FadeIn from "./FadeIn";
import ClickableImage from "./Lightbox";
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

/* ─── Life-OS visual (typographic) ─────────────────────────── */

function LifeOSVisual() {
  const vault = ["/identity.md", "/goals.md", "/projects/", "/patterns/"];
  const mcp = ["filesystem", "notion", "figma", "tasknotes"];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-tint)",
        padding:
          "clamp(1.75rem, 4vw, 3rem) clamp(2rem, 5vw, 4rem)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(2rem, 5vw, 4rem)",
        alignItems: "start",
      }}
    >
      {/* Vault tree */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingBottom: "0.875rem",
            borderBottom: "1px solid var(--border)",
            marginBottom: "1.25rem",
          }}
        >
          <span
            style={{
              fontFamily: df,
              fontWeight: 700,
              fontSize: "0.6875rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            Life-OS · vault
          </span>
          <span
            style={{
              fontFamily: bf,
              fontSize: "0.6875rem",
              color: "var(--ink-3)",
            }}
          >
            Claude Code
          </span>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}
        >
          {vault.map((entry) => (
            <div
              key={entry}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "var(--accent)",
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: bf,
                  fontSize: "0.9375rem",
                  color: "var(--ink)",
                  letterSpacing: "0.01em",
                }}
              >
                {entry}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MCP nodes */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingBottom: "0.875rem",
            borderBottom: "1px solid var(--border)",
            marginBottom: "1.25rem",
          }}
        >
          <span
            style={{
              fontFamily: df,
              fontWeight: 700,
              fontSize: "0.6875rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ink-2)",
            }}
          >
            MCP servers
          </span>
          <span
            style={{
              fontFamily: bf,
              fontSize: "0.6875rem",
              color: "var(--ink-3)",
            }}
          >
            4 active
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.65rem 1rem",
          }}
        >
          {mcp.map((node) => (
            <div
              key={node}
              style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  border: "1px solid var(--ink-2)",
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: bf,
                  fontSize: "0.875rem",
                  color: "var(--ink-2)",
                  letterSpacing: "0.01em",
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

/* ─── Figure plate (frame + caption) ───────────────────────── */

interface FigurePlateProps {
  figNumber: string;
  caption: string;
  clickable?: boolean;
  children: React.ReactNode;
}

function FigurePlate({
  figNumber,
  caption,
  clickable,
  children,
}: FigurePlateProps) {
  return (
    <figure style={{ margin: 0 }}>
      <div
        style={{
          backgroundColor: "var(--bg-tint)",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      <figcaption
        className="flex flex-col md:flex-row md:items-baseline md:justify-between"
        style={{
          marginTop: "0.875rem",
          gap: "0.5rem 1.5rem",
        }}
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
    </figure>
  );
}

/* ─── Featured visuals dispatch ────────────────────────────── */

interface FeaturedVisualProps {
  visualKey: ProjectVisualKey;
  figNumber: string;
}

function FeaturedVisual({ visualKey, figNumber }: FeaturedVisualProps) {
  if (visualKey === "figma") {
    return (
      <FigurePlate
        figNumber={figNumber}
        caption="Project workflow selection screen — Shoothill onboarding modes."
        clickable
      >
        <ClickableImage
          src="/project-figma-agent.png"
          alt="Figma → spec agent — project workflow selection screen"
          width={3002}
          height={1874}
          caption="Fig. 01 — Project workflow selection screen"
        />
      </FigurePlate>
    );
  }
  if (visualKey === "shopify") {
    return (
      <FigurePlate
        figNumber={figNumber}
        caption="n8n automation pipeline — image to Shopify product, end to end."
        clickable
      >
        <ClickableImage
          src="/project-n8n-workflow.png"
          alt="Shopify product automation — n8n workflow pipeline"
          width={2514}
          height={618}
          caption="Fig. 02 — n8n automation pipeline"
        />
      </FigurePlate>
    );
  }
  return (
    <FigurePlate
      figNumber={figNumber}
      caption="Vault structure and active MCP servers — read on every interaction."
    >
      <LifeOSVisual />
    </FigurePlate>
  );
}

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

/* ─── Featured card (stacked editorial) ────────────────────── */

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <div
      style={{ borderTop: "1px solid var(--border)" }}
      className="px-6 md:px-10"
    >
      <div
        style={{
          paddingTop: "clamp(3rem, 6vw, 5rem)",
          paddingBottom: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        {/* Title row */}
        <div
          className="flex flex-col md:flex-row md:items-baseline md:justify-between"
          style={{ gap: "1rem", marginBottom: "1.5rem" }}
        >
          <div className="flex items-baseline gap-5">
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
                fontSize: "clamp(1.25rem, 2.4vw, 1.875rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
                color: "var(--ink)",
              }}
            >
              {project.title}
            </h3>
          </div>
          <div
            className="flex flex-wrap items-center"
            style={{ gap: "0.75rem" }}
          >
            <StatusPill status={project.status} label={project.statusLabel} />
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
        </div>

        {/* Hairline rule */}
        <div
          style={{
            borderTop: "1px solid var(--border-light)",
            marginBottom: "clamp(1.75rem, 3vw, 2.5rem)",
          }}
        />

        {/* Figure plate */}
        {project.visualKey && (
          <div style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
            <FeaturedVisual
              visualKey={project.visualKey}
              figNumber={project.index}
            />
          </div>
        )}

        {/* Body copy */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 md:gap-16 items-start"
        >
          <p
            style={{
              fontFamily: bf,
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "var(--ink-2)",
              maxWidth: "62ch",
            }}
          >
            {project.summary}
          </p>
          <div>
            <span
              style={{
                fontFamily: df,
                fontWeight: 700,
                fontSize: "0.5625rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                display: "block",
                marginBottom: "0.6rem",
              }}
            >
              Demonstrates
            </span>
            <p
              style={{
                fontFamily: bf,
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "var(--ink-2)",
              }}
            >
              {project.demonstrates}
            </p>
          </div>
        </div>

        {/* Stack chips */}
        <div style={{ marginTop: "clamp(1.75rem, 3vw, 2.25rem)" }}>
          <StackChips stack={project.stack} />
        </div>
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
          <div
            className="flex flex-wrap items-center"
            style={{ gap: "0.75rem" }}
          >
            <StatusPill status={project.status} label={project.statusLabel} />
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

        <StackChips stack={project.stack} />

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
