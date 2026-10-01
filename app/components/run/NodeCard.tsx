import { STATUS_LABEL, STATUS_TONE, type Project } from "../../data/projects";
import { nodeTop, type NodeRunState } from "../../lib/timeline";

const TINT = { ok: "bg-ok-tint", wip: "bg-wip-tint", muted: "bg-paused-tint" } as const;
const TEXT = { ok: "text-ok-ink", wip: "text-wip-ink", muted: "text-muted" } as const;

function Check() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <circle cx="13" cy="13" r="13" fill="var(--ok)" />
      <path d="M7.5 13.5l3.5 3.5 7.5-8" fill="none" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A project node on the graph. With `onSelect` it is a button (live run: jumps to the project's scene); with
 * `href` a link (static run: jumps to its section); otherwise a plain card. The node shows the project's short
 * label and stack (`project.node`) so it always fits on one line each; the panel carries the full versions.
 */
export default function NodeCard({
  project,
  index,
  state,
  active,
  onSelect,
  href,
}: {
  project: Project;
  index: number;
  state: NodeRunState;
  active: boolean;
  onSelect?: () => void;
  href?: string;
}) {
  const tone = STATUS_TONE[project.status];
  const queued = state === "queued";
  const border = active ? "border-signal" : queued ? "border-line border-dashed" : "border-ink";
  const title = project.node?.title ?? project.title;
  const via = project.node?.via ?? project.via;
  const interactive = !!(onSelect || href);
  const className = `absolute left-130 flex h-19 w-85 items-center gap-3 rounded-xl border-2 px-3.5 text-left text-ink shadow-[0_10px_24px_-16px_rgba(30,31,36,0.45)] transition-[border-color,background-color,transform,box-shadow] duration-300 ${border} ${queued ? "bg-ground" : "bg-paper"} ${
    interactive ? "cursor-pointer hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_14px_28px_-14px_rgba(30,31,36,0.5)]" : ""
  }`;
  const body = (
    <>
      <span aria-hidden="true" className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] text-sm font-extrabold ${TINT[tone]}`}>
        {project.no}
      </span>
      <span className="min-w-0 flex-1">
        <span data-node-title className="block truncate text-[17px] font-extrabold">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-muted">{via}</span>
      </span>
      {state === "executing" && (
        <span aria-hidden="true" className="node-spin h-5.5 w-5.5 shrink-0 rounded-full border-[3px] border-signal-tint border-t-signal" />
      )}
      {queued && <span className="shrink-0 text-xs font-extrabold text-muted">Queued</span>}
      {state === "done" && (tone === "ok" && project.status !== "running" ? (
        <Check />
      ) : (
        <span className={`shrink-0 text-xs font-extrabold ${TEXT[tone]}`}>{STATUS_LABEL[project.status]}</span>
      ))}
    </>
  );
  const common = { "data-node": index, className, style: { top: nodeTop(index) } };
  if (onSelect) {
    return (
      <button type="button" {...common} onClick={onSelect} aria-label={`Open ${project.no} ${project.title}`}>
        {body}
      </button>
    );
  }
  if (href) {
    return (
      <a {...common} href={href} tabIndex={-1} aria-label={`Go to ${project.no} ${project.title}`}>
        {body}
      </a>
    );
  }
  return <div {...common}>{body}</div>;
}
