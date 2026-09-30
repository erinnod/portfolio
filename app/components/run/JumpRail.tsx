import { PROJECTS } from "../../data/projects";
import { SCENES, finishOpen, railIndex, railTargets } from "../../lib/timeline";

const LABELS = [
  "Start",
  ...SCENES.map((ids) =>
    ids.length === 1
      ? `${PROJECTS[ids[0]].no} ${PROJECTS[ids[0]].title}`
      : `${PROJECTS[ids[0]].no}–${PROJECTS[ids[ids.length - 1]].no} More workflows`,
  ),
  "Contact",
];

export default function JumpRail({ progress, onJump }: { progress: number; onJump: (target: number) => void }) {
  const current = railIndex(progress);
  const onOrange = finishOpen(progress) > 0.5;
  const targets = railTargets();
  return (
    <nav aria-label="Jump to a node" className="absolute right-[clamp(8px,2vw,28px)] top-1/2 z-10 flex -translate-y-1/2 flex-col">
      {targets.map((target, i) => (
        <button
          key={LABELS[i]}
          type="button"
          onClick={() => onJump(target)}
          aria-label={`Jump to ${LABELS[i]}`}
          aria-current={i === current ? "step" : undefined}
          className="group inline-flex h-11 w-11 cursor-pointer items-center justify-center"
        >
          <span
            className={`block h-2.5 rounded-full border-2 transition-[width] duration-300 group-hover:scale-125 ${
              onOrange ? "border-paper" : "border-ink"
            } ${i <= current ? (onOrange ? "bg-paper" : "bg-ink") : "bg-transparent"}`}
            style={{ width: i === current ? 26 : 10 }}
          />
        </button>
      ))}
    </nav>
  );
}
