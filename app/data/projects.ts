export type ProjectStatus = "shipped" | "live" | "running" | "in-progress" | "paused";
// "wip" is its own cool tone: signal orange stays reserved for live wires and the primary action.
export type StatusTone = "ok" | "wip" | "muted";

export interface ProjectImage { src: string; alt: string; width: number; height: number }

/** A figure drawn in code instead of a raster (crisp at any size). */
export type ProjectFigure = "n8n-section-03";

export interface Project {
  no: string;
  title: string;
  via: string;
  status: ProjectStatus;
  summary: string;
  short?: string;
  steps: readonly string[];
  link?: { label: string; href: string };
  image?: ProjectImage;
  figure?: ProjectFigure;
  /** Shorter label/stack for the graph's node card, where each must fit one line; the panel shows the full ones. */
  node?: { title?: string; via?: string };
}

export const EMAIL = "noderin1@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/erin-nodland/";
export const PITCH =
  "Software developer at Shoothill. I build AI workflows that are still running after the demo ends.";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  live: "Shipped · live in production",
  running: "Running",
  "in-progress": "In progress",
  paused: "Paused",
};

export const STATUS_TONE: Record<ProjectStatus, StatusTone> = {
  shipped: "ok",
  live: "ok",
  running: "ok",
  "in-progress": "wip",
  paused: "muted",
};

export const GROUP_INTRO = {
  title: "Also on the canvas",
  summary: "Two more systems built from the same toolkit.",
};

export const PROJECTS: readonly Project[] = [
  {
    no: "01",
    title: "Figma → spec agent",
    via: "Claude Code · Figma MCP",
    status: "shipped",
    summary:
      "Paste a Figma handoff and it reads every screen, then writes two reports in under two minutes: plain English for the client, technical for the developer. Every question is backed by evidence from the design.",
    steps: ["Figma link", "Read every screen", "Client report", "Developer report"],
    image: {
      src: "/project-figma-agent.png",
      alt: "Figma spec agent: choosing the entry point for a project",
      width: 3002,
      height: 1874,
    },
  },
  {
    no: "02",
    title: "Shopify product automation",
    via: "n8n · LLM · Shopify Admin API",
    node: { title: "Shopify automation" },
    status: "live",
    summary:
      "Live in production for a Shoothill client. Product photos land in Drive, get cropped and re-backgrounded, an LLM writes titles and descriptions from the images, and a ~20-node n8n workflow publishes them to Shopify.",
    steps: ["Drive upload", "Crop + background", "LLM writes copy", "Publish to Shopify"],
    figure: "n8n-section-03",
  },
  {
    no: "03",
    title: "RAG support assistant",
    via: "Python · Claude API · embeddings",
    status: "shipped",
    summary:
      "Retrieval-augmented Q&A with citations over a real document set, scored by a 20-question eval on retrieval hit-rate and answer quality.",
    steps: ["Ingest docs", "Chunk + embed", "Retrieve", "Answer + cite", "20-question eval"],
    link: { label: "Read the code on GitHub", href: "https://github.com/erinnod/rag-assistant" },
  },
  {
    no: "04",
    title: "Multi-agent outreach",
    via: "Python · Claude API · tool use",
    status: "shipped",
    summary:
      "Three Claude agents with shared state and structured tool use, run end to end on ten real companies. The Python orchestrator is built from scratch, with no LangChain.",
    steps: ["Researcher", "Drafter", "Critic", "Ten real companies"],
    link: { label: "Read the code on GitHub", href: "https://github.com/erinnod/multi-agent-outreach" },
  },
  {
    no: "05",
    title: "ASP.NET → Hono migration",
    via: "Hono · Cloudflare Workers · Postgres (Neon) · Drizzle",
    node: { title: "ASP.NET → Hono", via: "Hono · Workers · Postgres · Drizzle" },
    status: "shipped",
    summary:
      "A strangler-fig toolkit for moving a legacy ASP.NET + SQL Server backend onto Hono on Cloudflare Workers one endpoint at a time, with responses matched byte for byte so the client can't tell which backend answered. It handles any number of endpoints; on a production CRM it moved 200+ endpoints and 130+ tables while the app stayed fully usable.",
    steps: ["Strangler Worker", "JWTs valid both ways", "Guarded data CLIs", "Port every endpoint", "Rehearsed cutover"],
  },
  {
    no: "06",
    title: "Life-OS",
    via: "Claude Code · Obsidian · MCP",
    status: "running",
    summary:
      "A personal AI operating system. Claude Code reads a structured Obsidian vault on every interaction, writes back as life happens, flags drift and proposes its own new skills.",
    short: "A personal AI OS that reads a structured vault on every interaction and writes back.",
    steps: ["Read the vault", "Act through MCP", "Write back"],
  },
  {
    no: "07",
    title: "Morning brief",
    via: "n8n · Telegram · Claude",
    status: "paused",
    summary:
      "A daily Telegram brief built from weather, tech news and Notion content, written by Claude. Built and working; paused while newer work takes priority.",
    short: "A daily Telegram brief written by Claude. Built; paused for newer work.",
    steps: ["Weather", "Tech news", "Notion", "Telegram"],
  },
];
