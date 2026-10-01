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
import { camera, clamp01, finishOpen, panelOpen, sceneAt, type Viewport } from "../../lib/timeline";

// Both versions are server-rendered; CSS picks one (see .run-live / .run-static in globals.css), so there is no
// swap after hydration. Without JS, the <noscript> style shows the static run.
const NO_JS_STYLE = "<style>.run-live{display:none!important}.run-static{display:block!important}</style>";
const DOT = 22;

export default function RunStage() {
  const [listening, setListening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [vp, setVp] = useState<Viewport>({ w: 1440, h: 900 });
  const runRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const focusInPanel = useRef(false);

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
    const measure = () => {
      const el = runRef.current;
      const stage = stageRef.current;
      if (!el || !stage) return null;
      // Measure the sticky stage, not the window: mobile toolbars make innerHeight differ from the stage height.
      return { el, w: stage.clientWidth, h: stage.clientHeight, span: el.offsetHeight - stage.clientHeight };
    };
    const update = () => {
      raf = 0;
      const m = measure();
      if (!m) return;
      const p = clamp01(-m.el.getBoundingClientRect().top / (m.span || 1));
      progressRef.current = p;
      setProgress(p);
      setVp((prev) => (prev.w === m.w && prev.h === m.h ? prev : { w: m.w, h: m.h }));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // A resize (phone rotation, toolbar collapse) changes the run's pixel length, so the same scrollY would land
    // on a different scene. Re-anchor scroll to the progress the visitor was at.
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        const m = measure();
        if (!m) return;
        window.scrollTo({ top: m.el.offsetTop + progressRef.current * m.span, behavior: "instant" });
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [listening]);

  // Remember whether keyboard focus is inside a scene/finish panel, so we can rescue it when that panel closes.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onFocusIn = (e: FocusEvent) => {
      focusInPanel.current = !!(e.target as Element | null)?.closest?.("section[aria-labelledby]");
    };
    stage.addEventListener("focusin", onFocusIn);
    return () => stage.removeEventListener("focusin", onFocusIn);
  }, []);

  const s = sceneAt(progress);
  const panelLive = s.phase === "scene" ? panelOpen(progress) >= 0.6 : s.phase === "finish" ? finishOpen(progress) >= 0.6 : false;
  const panelKey = `${s.phase}:${s.sceneIndex}:${panelLive}`;

  // When the panel holding focus goes inert or unmounts, focus would fall to <body> and Tab would restart at the
  // top of the page. Hand it to the jump rail's current step instead.
  useEffect(() => {
    if (!focusInPanel.current) return;
    const active = document.activeElement;
    const lost = !active || active === document.body || !!active.closest("[inert]");
    if (!lost) return;
    const rail = stageRef.current?.querySelector("nav[aria-label='Jump to a node']");
    const target = rail?.querySelector<HTMLButtonElement>("[aria-current='step']") ?? rail?.querySelector<HTMLButtonElement>("button");
    focusInPanel.current = false;
    target?.focus({ preventScroll: true });
  }, [panelKey]);

  const jumpTo = useCallback((target: number) => {
    const el = runRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const span = el.offsetHeight - stage.clientHeight;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.offsetTop + target * span, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const cam = camera(progress, vp);
  // Dot grid: its own layer, moved only by transform (no background repaint per frame). It follows the camera's
  // zoom but never packs tighter than its native 22px, which moirés when zoomed out.
  const k = Math.max(1, cam.scale);
  const step = DOT * k;
  const ox = ((cam.x % step) + step) % step - step;
  const oy = ((cam.y % step) + step) % step - step;
  return (
    <>
      <div className="run-live">
        <section id="run" ref={runRef} className="relative h-[1100svh]">
          <h1 className="sr-only">Erin Nodland</h1>
          <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden bg-ground">
            <div
              data-dots
              aria-hidden="true"
              className="dot-layer pointer-events-none absolute left-0 top-0 h-[calc(100%+44px)] w-[calc(100%+44px)] origin-top-left"
              style={{ transform: `translate3d(${ox}px, ${oy}px, 0) scale(${k})` }}
            />
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
