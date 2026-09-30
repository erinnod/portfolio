"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import ScenePanel from "./ScenePanel";
import FinishScene from "./FinishScene";
import Intro from "./Intro";
import StatusLine from "./StatusLine";
import JumpRail from "./JumpRail";
import SrSummary from "./SrSummary";
import StaticRun from "./StaticRun";
import StaticGraph from "./StaticGraph";
import { camera, clamp01, type Viewport } from "../../lib/timeline";

export default function RunStage() {
  const [live, setLive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [vp, setVp] = useState<Viewport>({ w: 1440, h: 900 });
  const runRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setLive(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = runRef.current;
      if (!el) return;
      const span = el.offsetHeight - window.innerHeight;
      setProgress(clamp01(-el.getBoundingClientRect().top / (span || 1)));
      setVp({ w: window.innerWidth, h: window.innerHeight });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [live]);

  const jumpTo = useCallback((target: number) => {
    const el = runRef.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.offsetTop + target * span, behavior: smooth ? "smooth" : "auto" });
  }, []);

  if (!live) return <StaticRun graph={<StaticGraph />} />;

  const cam = camera(progress, vp);
  return (
    <section id="run" ref={runRef} className="relative h-[1100svh]">
      <h1 className="sr-only">Erin Nodland</h1>
      <div
        className="dotted sticky top-0 h-svh overflow-hidden"
        style={{ backgroundPosition: `${cam.x}px ${cam.y}px`, backgroundSize: `${22 * cam.scale}px ${22 * cam.scale}px` }}
      >
        <Graph progress={progress} cam={cam} />
        <Intro progress={progress} />
        <StatusLine progress={progress} />
        <JumpRail progress={progress} onJump={jumpTo} />
        <ScenePanel progress={progress} vp={vp} />
        <FinishScene progress={progress} vp={vp} />
      </div>
      <SrSummary />
    </section>
  );
}
