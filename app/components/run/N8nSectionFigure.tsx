import { N8N_SECTION_03, type N8nNode, type N8nNodeKind } from "../../data/n8nSection03";

const byId = new Map(N8N_SECTION_03.nodes.map((n) => [n.id, n]));

function wire(fromId: string, toId: string): string {
  const a = byId.get(fromId)!, b = byId.get(toId)!;
  const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2;
  // Dropping to a lower node: run right first, then drop, so the wire clears the source's label underneath.
  if (y2 > y1 + 20) return `M${x1} ${y1} C ${x2 - 10} ${y1}, ${x2 - 30} ${y2}, ${x2} ${y2}`;
  const dx = Math.max(24, (x2 - x1) / 2);
  return `M${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

/** Stroke icons drawn in a 24×24 box, centred on (cx, cy). */
function Icon({ kind, cx, cy }: { kind: N8nNodeKind; cx: number; cy: number }) {
  const t = `translate(${cx - 12} ${cy - 12})`;
  const stroke = { fill: "none", stroke: "var(--ink)", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "merge") {
    return <g transform={t} {...stroke}><circle cx="5" cy="6" r="2.2" /><circle cx="5" cy="18" r="2.2" /><circle cx="19" cy="12" r="2.2" /><path d="M7 6h3c2 0 3 2 4 4l1 1M7 18h3c2 0 3-2 4-4l1-1" /></g>;
  }
  if (kind === "sheet") {
    return <g transform={t} {...stroke}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9.5 12h6M9.5 15.5h6M12.5 10v8" /></g>;
  }
  if (kind === "code") {
    return <g transform={t} {...stroke}><path d="M9 4C6.5 4 7 7 7 9s-2 3-2 3 2 1 2 3-.5 5 2 5M15 4c2.5 0 2 3 2 5s2 3 2 3-2 1-2 3 .5 5-2 5" /></g>;
  }
  return <g transform={t} {...stroke}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /><path d="M18 16v4M16 18h4" /></g>;
}

function Node({ node }: { node: N8nNode }) {
  const wide = node.w > node.h;
  const iconX = wide ? node.x + 22 : node.x + node.w / 2;
  const iconY = node.y + node.h / 2;
  return (
    <g>
      <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="10" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <Icon kind={node.kind} cx={iconX} cy={iconY} />
      {wide ? (
        <>
          <text x={node.x + 40} y={node.y + 23} fontSize="12" fontWeight="800" fill="var(--ink)">{node.label}</text>
          {node.sub && <text x={node.x + 40} y={node.y + 38} fontSize="10" fontWeight="500" fill="var(--muted)">{node.sub}</text>}
        </>
      ) : (
        <>
          <text x={node.x + node.w / 2} y={node.y + node.h + 16} fontSize="11" fontWeight="800" fill="var(--ink)" textAnchor="middle">{node.label}</text>
          {node.sub && <text x={node.x + node.w / 2} y={node.y + node.h + 31} fontSize="10" fontWeight="500" fill="var(--muted)" textAnchor="middle">{node.sub}</text>}
        </>
      )}
    </g>
  );
}

/**
 * The Shopify workflow's AI stage, redrawn as vector so it stays legible at any size. `drawn` (0..1) draws the
 * wires in, matching the panel's reveal timeline.
 */
export default function N8nSectionFigure({ drawn = 1 }: { drawn?: number }) {
  const s = N8N_SECTION_03;
  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${s.width} ${s.height}`}
        role="img"
        aria-label={`${s.title}: Merge feeds Log to Google Sheet and Code in JavaScript; Code feeds Group Product Images, which goes to Merge2 directly and through Message a model.`}
        className="block h-auto w-full rounded-xl border-2 border-ink bg-paper"
        style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
      >
        <text x="18" y="28" fontSize="14" fontWeight="900" fill="var(--ink)">{s.title}</text>
        <text x="18" y="45" fontSize="10" fontWeight="500" fill="var(--ink-2)">{s.subtitle}</text>
        {s.edges.map(([a, b]) => (
          <g key={`${a}-${b}`}>
            <path d={wire(a, b)} fill="none" stroke="var(--line)" strokeWidth="2" />
            <path d={wire(a, b)} fill="none" stroke="var(--ink)" strokeWidth="2" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - drawn} />
          </g>
        ))}
        {s.nodes.map((n) => <Node key={n.id} node={n} />)}
      </svg>
      <figcaption className="mt-2 text-[13px] font-bold text-muted">Redrawn from the live n8n workflow (section 03 of ~20 nodes).</figcaption>
    </figure>
  );
}
