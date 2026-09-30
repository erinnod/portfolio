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

// Both versions are server-rendered; CSS picks one (see .run-live / .run-static in globals.css), so there is no
// swap after hydration. Without JS, the <noscript> style shows the static run.
const NO_JS_STYLE = "<style>.run-live{display:none!important}.run-static{display:block!important}</style>";

export default function RunStage() {
  const [listening, setListening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [vp, setVp] = useState<Viewport>({ w: 1440, h: 900 });
  const runRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setListening(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!listening) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = runRef.current;
      const stage = stageRef.current;
      if (!el || !stage) return;
      // Measure the sticky stage, not the window: mobile toolbars make innerHeight differ from the stage height.
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const span = el.offsetHeight - h;
      setProgress(clamp01(-el.getBoundingClientRect().top / (span || 1)));
      setVp((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
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
  }, [listening]);

  const jumpTo = useCallback((target: number) => {
    const el = runRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const span = el.offsetHeight - stage.clientHeight;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.offsetTop + target * span, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const cam = camera(progress, vp);
  // Dot grid follows the camera's zoom, but never packs tighter than its native 22px (it moirés when zoomed out).
  const dot = Math.max(22, 22 * cam.scale);
  return (
    <>
      <div className="run-live">
        <section id="run" ref={runRef} className="relative h-[1100svh]">
          <h1 className="sr-only">Erin Nodland</h1>
          <div
            ref={stageRef}
            className="dotted sticky top-0 h-dvh overflow-hidden"
            style={{ backgroundPosition: `${cam.x}px ${cam.y}px`, backgroundSize: `${dot}px ${dot}px` }}
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
      </div>
      <div className="run-static">
        <StaticRun graph={<StaticGraph />} idPrefix="static-" />
      </div>
      <noscript dangerouslySetInnerHTML={{ __html: NO_JS_STYLE }} />
    </>
  );
}
