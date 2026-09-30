import { STATUS_LABEL, STATUS_TONE, type Project } from "../../data/projects";
import { nodeTop, type NodeRunState } from "../../lib/timeline";

const TINT = { ok: "bg-ok-tint", signal: "bg-signal-tint", muted: "bg-paused-tint" } as const;
const TEXT = { ok: "text-ok-ink", signal: "text-signal-ink", muted: "text-muted" } as const;

function Check() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <circle cx="13" cy="13" r="13" fill="var(--ok)" />
      <path d="M7.5 13.5l3.5 3.5 7.5-8" fill="none" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NodeCard({
  project,
  index,
  state,
  active,
}: {
  project: Project;
  index: number;
  state: NodeRunState;
  active: boolean;
}) {
  const tone = STATUS_TONE[project.status];
  const queued = state === "queued";
  const border = active ? "border-signal" : queued ? "border-line border-dashed" : "border-ink";
  return (
    <div
      className={`absolute left-130 flex h-19 w-85 items-center gap-3 rounded-xl border-2 bg-paper px-3.5 shadow-[0_10px_24px_-16px_rgba(30,31,36,0.45)] transition-[border-color,opacity] duration-300 ${border}`}
      style={{ top: nodeTop(index), opacity: queued ? 0.7 : 1 }}
    >
      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] text-sm font-extrabold ${TINT[tone]}`}>
        {project.no}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-extrabold">{project.title}</span>
        <span className="mt-0.5 block text-xs text-muted">{project.via}</span>
      </span>
      {state === "executing" && (
        <span className="node-spin h-5.5 w-5.5 shrink-0 rounded-full border-[3px] border-signal-tint border-t-signal" />
      )}
      {queued && <span className="text-xs font-extrabold text-muted">Queued</span>}
      {state === "done" && (tone === "ok" && project.status !== "running" ? (
        <Check />
      ) : (
        <span className={`text-xs font-extrabold ${TEXT[tone]}`}>{STATUS_LABEL[project.status]}</span>
      ))}
    </div>
  );
}
