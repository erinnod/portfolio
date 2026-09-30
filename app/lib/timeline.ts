// Pure scroll-timeline math. `progress` (0..1) is the only input; nothing here touches React or the DOM.

export const WORLD_W = 1300;
export const WORLD_H = 860;
export const INTRO = 0.08;
export const OVER = 0.15;
export const SCN = 0.14;
export const SCENES: readonly (readonly number[])[] = [[0], [1], [2], [3], [4, 5, 6]];
export const CONTACT_START = OVER + SCN * SCENES.length;

export interface Point { x: number; y: number }
export interface Viewport { w: number; h: number }
export interface Camera { x: number; y: number; scale: number }
export type Phase = "intro" | "overview" | "scene" | "finish";
export interface SceneInfo { phase: Phase; sceneIndex: number; t: number }
export type NodeRunState = "queued" | "executing" | "done";

export const TRIGGER: Point = { x: 180, y: 430 };
export const CONTACT: Point = { x: 1140, y: 430 };
const OVERVIEW: Point = { x: 650, y: 430 };

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Eased 0..1 for a sub-range [start, start + duration] of a scene's local t. */
export function local(t: number, start: number, duration: number): number {
  return easeOut((t - start) / duration);
}

export function nodeTop(i: number): number {
  return 60 + i * 110;
}

export function nodeCenter(i: number): Point {
  return { x: 690, y: nodeTop(i) + 38 };
}

export function outWirePath(i: number): string {
  const y = nodeCenter(i).y;
  return `M320 430 C 420 430, 420 ${y}, 520 ${y}`;
}

export function inWirePath(i: number): string {
  const y = nodeCenter(i).y;
  return `M860 ${y} C 940 ${y}, 940 430, 1020 430`;
}

export function bezierPoint(i: number, u: number, into: boolean): Point {
  const y = nodeCenter(i).y;
  const pts: Point[] = into
    ? [{ x: 860, y }, { x: 940, y }, { x: 940, y: 430 }, { x: 1020, y: 430 }]
    : [{ x: 320, y: 430 }, { x: 420, y: 430 }, { x: 420, y }, { x: 520, y }];
  const v = 1 - u;
  const f = (k: "x" | "y") =>
    v * v * v * pts[0][k] + 3 * v * v * u * pts[1][k] + 3 * v * u * u * pts[2][k] + u * u * u * pts[3][k];
  return { x: f("x"), y: f("y") };
}

export function sceneAt(progress: number): SceneInfo {
  const p = clamp01(progress);
  if (p < INTRO) return { phase: "intro", sceneIndex: -1, t: p / INTRO };
  if (p < OVER) return { phase: "overview", sceneIndex: -1, t: (p - INTRO) / (OVER - INTRO) };
  if (p < CONTACT_START) {
    const k = Math.min(SCENES.length - 1, Math.floor((p - OVER) / SCN));
    return { phase: "scene", sceneIndex: k, t: (p - OVER - k * SCN) / SCN };
  }
  return { phase: "finish", sceneIndex: -1, t: (p - CONTACT_START) / (1 - CONTACT_START) };
}

export function fitScale(v: Viewport): number {
  return Math.min(v.w / 1400, v.h / 940);
}

export function camera(progress: number, v: Viewport): Camera {
  const s = sceneAt(progress);
  const fit = fitScale(v);
  let focus = OVERVIEW;
  let scale = fit;
  if (s.phase === "intro") {
    const k = easeOut(s.t);
    // Opening zoom: 2.7x the height fit, capped so the 280-wide trigger card spans at most 86% of the width
    // (on narrow phones the height fit alone would leave the name tiny).
    const open = Math.min((v.h / 940) * 2.7, (v.w * 0.86) / 280);
    focus = { x: lerp(TRIGGER.x, OVERVIEW.x, k), y: TRIGGER.y };
    scale = lerp(open, fit, k);
  } else if (s.phase === "scene") {
    const ids = SCENES[s.sceneIndex];
    const target = ids.length > 1 ? nodeCenter(5) : nodeCenter(ids[0]);
    const k = easeOut(s.t / 0.2) * (1 - easeOut((s.t - 0.85) / 0.15));
    focus = { x: lerp(OVERVIEW.x, target.x, k), y: lerp(OVERVIEW.y, target.y, k) };
    scale = lerp(fit, fit * (ids.length > 1 ? 1.8 : 3.2), k);
  } else if (s.phase === "finish") {
    const k = easeOut((s.t - 0.3) / 0.25);
    focus = { x: lerp(OVERVIEW.x, CONTACT.x, k), y: CONTACT.y };
    scale = lerp(fit, fit * 3.4, k);
  }
  return { x: v.w / 2 - focus.x * scale, y: v.h / 2 - focus.y * scale, scale };
}

export function activeIds(progress: number): readonly number[] {
  const s = sceneAt(progress);
  return s.phase === "scene" ? SCENES[s.sceneIndex] : [];
}

export function nodeState(i: number, progress: number): NodeRunState {
  const s = sceneAt(progress);
  if (s.phase === "finish") return "done";
  if (s.phase !== "scene") return "queued";
  const ids = SCENES[s.sceneIndex];
  if (i < ids[0]) return "done";
  if (ids.includes(i)) return s.t < 0.2 ? "executing" : "done";
  return "queued";
}

export function wireProgress(i: number, progress: number): number {
  const s = sceneAt(progress);
  if (s.phase === "finish") return 1;
  if (s.phase !== "scene") return 0;
  const ids = SCENES[s.sceneIndex];
  if (i < ids[0]) return 1;
  if (ids.includes(i)) return easeOut(s.t / 0.2);
  return 0;
}

export function inWireProgress(progress: number): number {
  const s = sceneAt(progress);
  return s.phase === "finish" ? easeOut(s.t / 0.3) : 0;
}

export function contactLit(progress: number): boolean {
  const s = sceneAt(progress);
  return s.phase === "finish" && s.t > 0.3;
}

export function beadAt(progress: number): Point | null {
  const s = sceneAt(progress);
  if (s.phase === "scene" && s.t < 0.2) {
    const ids = SCENES[s.sceneIndex];
    return bezierPoint(ids[Math.floor(ids.length / 2)], easeOut(s.t / 0.2), false);
  }
  if (s.phase === "finish" && s.t < 0.3) return bezierPoint(1, easeOut(s.t / 0.3), true);
  return null;
}

export function panelOpen(progress: number): number {
  const s = sceneAt(progress);
  if (s.phase !== "scene") return 0;
  return easeOut((s.t - 0.2) / 0.14) * (1 - easeOut((s.t - 0.84) / 0.1));
}

export function finishOpen(progress: number): number {
  const s = sceneAt(progress);
  return s.phase === "finish" ? easeOut((s.t - 0.55) / 0.2) : 0;
}

export function railTargets(): number[] {
  return [
    0,
    // t = 0.76: every pipeline step and the image have finished revealing (≤ 0.70), and the panel hasn't started closing (0.84).
    ...SCENES.map((_, k) => OVER + k * SCN + 0.76 * SCN),
    CONTACT_START + 0.9 * (1 - CONTACT_START),
  ];
}

export function railIndex(progress: number): number {
  const s = sceneAt(progress);
  if (s.phase === "finish") return SCENES.length + 1;
  if (s.phase === "scene") return s.sceneIndex + 1;
  return 0;
}

const pad = (i: number) => String(i + 1).padStart(2, "0");

export function statusLine(progress: number): string {
  const s = sceneAt(progress);
  if (s.phase === "intro") return "Waiting for trigger";
  if (s.phase === "overview") return "Trigger fired · 7 nodes queued";
  if (s.phase === "finish") return "Workflow finished";
  const ids = SCENES[s.sceneIndex];
  return ids.length > 1
    ? `Executing nodes ${pad(ids[0])}–${pad(ids[ids.length - 1])}`
    : `Executing node ${pad(ids[0])}`;
}
