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

export default function Graph({ progress, cam }: { progress: number; cam: Camera }) {
  const bead = beadAt(progress);
  const into = inWireProgress(progress);
  const lit = contactLit(progress);
  const active = activeIds(progress);
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 origin-top-left will-change-transform"
      style={{ width: WORLD_W, height: WORLD_H, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})` }}
    >
      <svg width={WORLD_W} height={WORLD_H} viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="absolute inset-0 overflow-visible">
        {PROJECTS.map((p, i) => (
          <Wire key={`out-${p.no}`} d={outWirePath(i)} drawn={wireProgress(i, progress)} />
        ))}
        {PROJECTS.map((p, i) => (
          <Wire key={`in-${p.no}`} d={inWirePath(i)} drawn={into} />
        ))}
      </svg>

      <div className="absolute left-10 top-92.5 h-30 w-70 rounded-[14px] bg-ink px-5 py-4.5 text-paper shadow-[0_18px_40px_-18px_rgba(30,31,36,0.55)]">
        <p className="text-xs font-bold text-[#B9BCB2]">Trigger</p>
        <p className="mt-1.5 text-[38px] font-black leading-[0.95] tracking-[-0.03em]">Erin Nodland</p>
        <span className="absolute -right-2.25 top-12.75 h-4.5 w-4.5 rounded-full bg-signal" />
        <span className="port-ring absolute -right-2.25 top-12.75 h-4.5 w-4.5 rounded-full border-2 border-signal" />
      </div>

      {PROJECTS.map((p, i) => (
        <NodeCard key={p.no} project={p} index={i} state={nodeState(i, progress)} active={active.includes(i)} />
      ))}

      <div
        className={`absolute left-255 top-98 h-19 w-60 rounded-xl border-2 border-signal px-4.5 py-3.5 transition-colors duration-300 ${
          lit ? "bg-signal text-paper" : "bg-paper text-ink"
        }`}
      >
        <p className="text-xs font-bold opacity-80">Output</p>
        <p className="mt-0.5 text-xl font-black">Contact Erin</p>
      </div>

      {bead && (
        <span
          className="absolute h-4.5 w-4.5 rounded-full bg-signal shadow-[0_4px_10px_-2px_rgba(217,72,31,0.6)]"
          style={{ left: bead.x - 9, top: bead.y - 9 }}
        />
      )}
    </div>
  );
}
