import FinishContent from "./FinishContent";
import { finishOpen, sceneAt, type Viewport } from "../../lib/timeline";

export default function FinishScene({ progress, vp }: { progress: number; vp: Viewport }) {
  const s = sceneAt(progress);
  if (s.phase !== "finish") return null;
  const open = finishOpen(progress);
  const radius = (open * Math.hypot(vp.w, vp.h)) / 2;
  return (
    <section
      aria-labelledby="finish-title"
      inert={open < 0.6}
      className="absolute inset-0 bg-signal-ink text-paper"
      style={{ clipPath: `circle(${radius}px at 50% 50%)` }}
    >
      <FinishContent t={s.t} inStage />
    </section>
  );
}
