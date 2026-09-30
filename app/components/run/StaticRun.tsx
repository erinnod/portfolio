import type { ReactNode } from "react";
import SceneContent from "./SceneContent";
import FinishContent from "./FinishContent";
import { PITCH } from "../../data/projects";
import { SCENES } from "../../lib/timeline";

// The whole run laid out in normal flow: the no-JS and reduced-motion version.
export default function StaticRun({ graph, idPrefix = "" }: { graph?: ReactNode; idPrefix?: string }) {
  return (
    <div>
      <header className="dotted px-[clamp(20px,5vw,72px)] pb-12 pt-10">
        <p className="text-[17px] font-black tracking-[-0.01em]">erin-nodland.workflow</p>
        <h1 className="mt-10 text-[clamp(56px,9vw,96px)] font-black leading-[0.9] tracking-[-0.04em]">Erin Nodland</h1>
        <p className="mt-6 max-w-[34ch] text-[clamp(20px,2vw,28px)] font-bold leading-snug">{PITCH}</p>
        {graph}
      </header>
      {SCENES.map((_, k) => (
        <section key={k} aria-labelledby={`${idPrefix}scene-${k}-title`} className="border-t-2 border-ink bg-paper">
          <SceneContent sceneIndex={k} t={1} idPrefix={idPrefix} />
        </section>
      ))}
      <section aria-labelledby={`${idPrefix}finish-title`} className="bg-signal-ink text-paper">
        <FinishContent t={1} idPrefix={idPrefix} />
      </section>
    </div>
  );
}
