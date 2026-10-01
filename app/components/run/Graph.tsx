import NodeCard from "./NodeCard";
import { PROJECTS } from "../../data/projects";
import {
  WORLD_H, WORLD_W, activeIds, beadAt, contactLit, inWirePath, inWireProgress,
  nodeState, outWirePath, wireProgress, type Camera,
} from "../../lib/timeline";

function Wire({ d, drawn }: { d: string; drawn: number }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--line)" strokeWidth={3} />
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - drawn} />
    </>
  );
}

export default function Graph({
  progress,
  cam,
  onSelectNode,
  onSelectContact,
  nodeHref,
  contactHref,
  covered = false,
}: {
  progress: number;
  cam: Camera;
  /** Live run: clicking a node or Contact jumps the scroll to it. */
  onSelectNode?: (index: number) => void;
  onSelectContact?: () => void;
  /** Static run: nodes and Contact link to their sections. */
  nodeHref?: (index: number) => string;
  contactHref?: string;
  /** A panel covers the graph: take its controls out of reach. */
  covered?: boolean;
}) {
  const bead = beadAt(progress);
  const into = inWireProgress(progress);
  const lit = contactLit(progress);
  const active = activeIds(progress);
  const contactClass = `absolute left-255 top-98 h-19 w-60 rounded-xl border-2 px-4.5 py-3.5 text-left transition-[color,background-color,border-color,transform] duration-300 ${
    lit ? "border-signal-ink bg-signal-ink text-paper" : "border-signal bg-paper text-ink"
  } ${onSelectContact || contactHref ? "cursor-pointer hover:-translate-y-0.5" : ""}`;
  const contactBody = (
    <>
      <span className="block text-xs font-bold">Output</span>
      <span className="mt-0.5 block text-xl font-black">Contact Erin</span>
    </>
  );
  return (
    // No will-change here: it freezes the layer's raster scale, so the camera zoom would upscale a bitmap and
    // blur the text. Without it the browser re-rasterises at each scale and stays crisp.
    <div
      inert={covered}
      className="absolute left-0 top-0 origin-top-left"
      style={{ width: WORLD_W, height: WORLD_H, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})` }}
    >
      <svg aria-hidden="true" width={WORLD_W} height={WORLD_H} viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="absolute inset-0 overflow-visible">
        {PROJECTS.map((p, i) => (
          <Wire key={`out-${p.no}`} d={outWirePath(i)} drawn={wireProgress(i, progress)} />
        ))}
        {PROJECTS.map((p, i) => (
          <Wire key={`in-${p.no}`} d={inWirePath(i)} drawn={into} />
        ))}
      </svg>

      <div aria-hidden="true" className="absolute left-10 top-92.5 h-30 w-70 rounded-[14px] bg-ink px-5 py-4.5 text-paper shadow-[0_18px_40px_-18px_rgba(30,31,36,0.55)]">
        <p className="text-xs font-bold text-line">Trigger</p>
        <p className="mt-1.5 text-[38px] font-black leading-[0.95] tracking-[-0.03em]">Erin Nodland</p>
        <span className="absolute -right-2.25 top-12.75 h-4.5 w-4.5 rounded-full bg-signal" />
        <span className="port-ring absolute -right-2.25 top-12.75 h-4.5 w-4.5 rounded-full border-2 border-signal" />
      </div>

      {PROJECTS.map((p, i) => (
        <NodeCard
          key={p.no}
          project={p}
          index={i}
          state={nodeState(i, progress)}
          active={active.includes(i)}
          onSelect={onSelectNode ? () => onSelectNode(i) : undefined}
          href={nodeHref?.(i)}
        />
      ))}

      {onSelectContact ? (
        <button type="button" data-contact className={contactClass} onClick={onSelectContact} aria-label="Contact Erin">
          {contactBody}
        </button>
      ) : contactHref ? (
        <a data-contact href={contactHref} tabIndex={-1} className={contactClass} aria-label="Contact Erin">
          {contactBody}
        </a>
      ) : (
        <div data-contact aria-hidden="true" className={contactClass}>{contactBody}</div>
      )}

      {bead && (
        <span
          aria-hidden="true"
          className="absolute h-4.5 w-4.5 rounded-full bg-signal shadow-[0_4px_10px_-2px_rgba(217,72,31,0.6)]"
          style={{ left: bead.x - 9, top: bead.y - 9 }}
        />
      )}
    </div>
  );
}
