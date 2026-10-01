"use client";

import { useState } from "react";
import { N8N_WORKFLOW, type N8nNode, type N8nNodeKind, type N8nSection } from "../../data/n8nWorkflow";

const W = N8N_WORKFLOW.width;
const H = N8N_WORKFLOW.height;

/** Long labels set on two lines, split at the space nearest the middle (n8n wraps them under the node too). */
function lines(label: string): string[] {
  if (label.length <= 17) return [label];
  const mid = label.length / 2;
  let best = -1;
  for (let i = 0; i < label.length; i++) if (label[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return best < 0 ? [label] : [label.slice(0, best), label.slice(best + 1)];
}

function wire(section: N8nSection, from: string, to: string, back?: boolean): string {
  const byId = new Map(section.nodes.map((n) => [n.id, n]));
  const a = byId.get(from)!, b = byId.get(to)!;
  if (back) {
    // Loop return: out of the right side, under the node, back to the loop's bottom port.
    const x1 = a.x + a.w, y1 = a.y + a.h / 2, xl = b.x - 26, yb = b.y + b.h / 2, low = a.y + a.h + 4;
    return `M${x1} ${y1} C ${x1 + 22} ${y1}, ${x1 + 22} ${low}, ${x1} ${low} L ${xl + 12} ${low} Q ${xl} ${low}, ${xl} ${low - 12} L ${xl} ${yb + 12} Q ${xl} ${yb}, ${xl + 12} ${yb} L ${b.x} ${yb}`;
  }
  const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2;
  // Dropping to a lower node: run right first, then drop, so the wire clears the source's label underneath.
  if (y2 > y1 + 20) return `M${x1} ${y1} C ${x2 - 10} ${y1}, ${x2 - 30} ${y2}, ${x2} ${y2}`;
  const dx = Math.max(24, (x2 - x1) / 2);
  return `M${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

/** Stroke icons drawn in a 24×24 box, centred on (cx, cy). */
function Icon({ kind, cx, cy }: { kind: N8nNodeKind; cx: number; cy: number }) {
  const t = `translate(${cx - 12} ${cy - 12})`;
  const s = { fill: "none", stroke: "var(--ink)", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<N8nNodeKind, React.ReactNode> = {
    drive: <><path d="M8.5 4h7l6 10.5-3.5 6h-12L2.5 14.5z" /><path d="M8.5 4l6 10.5H21.5M15.5 4l-9.5 16.5" /></>,
    edit: <><path d="M15 4.5l4.5 4.5L9 19.5H4.5V15z" /><path d="M12.5 7l4.5 4.5" /></>,
    split: <><path d="M4 12h5M9 6v12M9 6h3M9 12h3M9 18h3" /><circle cx="17" cy="6" r="1.6" /><circle cx="17" cy="12" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
    loop: <><path d="M19 9a7.5 7.5 0 0 0-13.5-1.5M5 15a7.5 7.5 0 0 0 13.5 1.5" /><path d="M5.5 3.5v4h4M18.5 20.5v-4h-4" /></>,
    image: <><rect x="3.5" y="5" width="17" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 16l-5-5-8 8" /></>,
    http: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z" /></>,
    merge: <><circle cx="5" cy="6" r="2.2" /><circle cx="5" cy="18" r="2.2" /><circle cx="19" cy="12" r="2.2" /><path d="M7 6h3c2 0 3 2 4 4l1 1M7 18h3c2 0 3-2 4-4l1-1" /></>,
    sheet: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9.5 12h6M9.5 15.5h6M12.5 10v8" /></>,
    code: <path d="M9 4C6.5 4 7 7 7 9s-2 3-2 3 2 1 2 3-.5 5 2 5M15 4c2.5 0 2 3 2 5s2 3 2 3-2 1-2 3 .5 5-2 5" />,
    model: <><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /><path d="M18 16v4M16 18h4" /></>,
  };
  return <g transform={t} {...s}>{paths[kind]}</g>;
}

function Node({ node }: { node: N8nNode }) {
  const wide = node.w > node.h;
  const iconY = node.y + node.h / 2;
  if (wide) {
    return (
      <g>
        <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="10" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
        <Icon kind={node.kind} cx={node.x + 22} cy={iconY} />
        <text x={node.x + 40} y={node.y + 23} fontSize="12" fontWeight="800" fill="var(--ink)">{node.label}</text>
        {node.sub && <text x={node.x + 40} y={node.y + 38} fontSize="10" fontWeight="500" fill="var(--muted)">{node.sub}</text>}
      </g>
    );
  }
  const cx = node.x + node.w / 2;
  const ls = lines(node.label);
  const base = node.y + node.h + 16;
  return (
    <g>
      <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="10" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <Icon kind={node.kind} cx={cx} cy={iconY} />
      {ls.map((l, i) => (
        <text key={l} x={cx} y={base + i * 15} fontSize="11" fontWeight="800" fill="var(--ink)" textAnchor="middle">{l}</text>
      ))}
      {node.sub && <text x={cx} y={base + ls.length * 15 + 2} fontSize="10" fontWeight="500" fill="var(--muted)" textAnchor="middle">{node.sub}</text>}
    </g>
  );
}

function SectionDiagram({ section, drawn }: { section: N8nSection; drawn: number }) {
  const described = `${section.title}. Nodes: ${section.nodes.map((n) => n.label).join(", ")}.`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={described}
      className="block h-auto w-full rounded-xl border-2 border-ink bg-paper"
      style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
    >
      <text x="18" y="28" fontSize="14" fontWeight="900" fill="var(--ink)">{section.title}</text>
      <text x="18" y="45" fontSize="10" fontWeight="500" fill="var(--ink-2)">{section.subtitle}</text>
      {section.edges.map((ed) => {
        const d = wire(section, ed.from, ed.to, ed.back);
        return (
          <g key={`${ed.from}-${ed.to}${ed.back ? "-back" : ""}`}>
            <path d={d} fill="none" stroke="var(--line)" strokeWidth="2" />
            <path d={d} fill="none" stroke="var(--ink)" strokeWidth="2" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - drawn} />
          </g>
        );
      })}
      {section.nodes.map((node) => <Node key={node.id} node={node} />)}
    </svg>
  );
}

const CAPTION = "Redrawn from the live n8n workflow: 25 nodes in 4 sections.";

/**
 * The Shopify workflow, all four sections, redrawn as vector so it stays legible at any size. In the live run
 * (`tabs`) one section shows at a time behind tabs; otherwise all four stack. `drawn` (0..1) draws the wires in.
 */
export default function N8nWorkflowFigure({ tabs = false, drawn = 1 }: { tabs?: boolean; drawn?: number }) {
  const [active, setActive] = useState(0);
  const sections = N8N_WORKFLOW.sections;
  if (!tabs) {
    return (
      <figure className="m-0 flex flex-col gap-3">
        {sections.map((s) => <SectionDiagram key={s.id} section={s} drawn={drawn} />)}
        <figcaption className="text-[13px] font-bold text-muted">{CAPTION}</figcaption>
      </figure>
    );
  }
  const onKey = (ev: React.KeyboardEvent) => {
    if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
    ev.preventDefault();
    const next = (active + (ev.key === "ArrowRight" ? 1 : sections.length - 1)) % sections.length;
    setActive(next);
    (ev.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")[next])?.focus();
  };
  return (
    <figure className="m-0">
      <div role="tablist" aria-label="Workflow sections" className="mb-2 flex flex-wrap gap-1.5" onKeyDown={onKey}>
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`n8n-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls={`n8n-panel-${s.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`min-h-9 cursor-pointer rounded-lg border-2 border-ink px-3 text-[13px] font-extrabold transition-colors ${
              i === active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-ground"
            }`}
          >
            {s.tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`n8n-panel-${sections[active].id}`} aria-labelledby={`n8n-tab-${sections[active].id}`}>
        <SectionDiagram section={sections[active]} drawn={drawn} />
      </div>
      <figcaption className="mt-2 text-[13px] font-bold text-muted">{CAPTION}</figcaption>
    </figure>
  );
}
