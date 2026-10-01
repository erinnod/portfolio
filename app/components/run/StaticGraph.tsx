import Graph from "./Graph";
import { SCENES, WORLD_H, WORLD_W } from "../../lib/timeline";

// The finished run (all nodes done, all wires drawn). The SVG viewBox does the scaling, so this renders on the
// server and needs no JavaScript.
export default function StaticGraph() {
  return (
    <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="mt-10 block h-auto w-full" aria-hidden="true">
      <foreignObject width={WORLD_W} height={WORLD_H}>
        <div style={{ position: "relative", width: WORLD_W, height: WORLD_H }}>
          <Graph
            progress={0.999}
            cam={{ x: 0, y: 0, scale: 1 }}
            nodeHref={(i) => `#static-scene-${SCENES.findIndex((ids) => ids.includes(i))}-title`}
            contactHref="#static-finish-title"
          />
        </div>
      </foreignObject>
    </svg>
  );
}
