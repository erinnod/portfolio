"use client";

import { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import { WORLD_H, WORLD_W } from "../../lib/timeline";

// The finished run (all nodes done, all wires drawn), scaled to fit its column.
export default function StaticGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = width / WORLD_W;
  return (
    <div ref={ref} className="relative mt-10 w-full overflow-hidden" style={{ height: width ? WORLD_H * scale : 0 }}>
      {width > 0 && <Graph progress={0.999} cam={{ x: 0, y: 0, scale }} />}
    </div>
  );
}
