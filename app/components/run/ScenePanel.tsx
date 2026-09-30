import SceneContent from "./SceneContent";
import { panelOpen, sceneAt, type Viewport } from "../../lib/timeline";

export default function ScenePanel({ progress, vp }: { progress: number; vp: Viewport }) {
  const s = sceneAt(progress);
  if (s.phase !== "scene") return null;
  const open = panelOpen(progress);
  const radius = (open * Math.hypot(vp.w, vp.h)) / 2;
  return (
    <section
      aria-labelledby={`scene-${s.sceneIndex}-title`}
      inert={open < 0.6}
      className="absolute inset-0 overflow-hidden bg-paper"
      style={{ clipPath: `circle(${radius}px at 50% 50%)` }}
    >
      <SceneContent sceneIndex={s.sceneIndex} t={s.t} />
    </section>
  );
}
