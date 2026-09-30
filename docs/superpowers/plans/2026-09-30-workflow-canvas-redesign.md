# Workflow Canvas (scroll = execute) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the editorial portfolio with a single page where scrolling runs a workflow: a camera travels a graph of Erin's projects, opens each node into a full-screen panel, and ends on a Contact scene.

**Architecture:** All motion comes from one number, scroll progress `p` from 0 to 1. The pure functions in `app/lib/timeline.ts` turn `p` into camera, node, wire and panel state. React components only render that state. A static stacked version of the same components is the no-JS and reduced-motion fallback.

**Tech Stack:** Next.js 16.3 App Router, React 19.3, Tailwind v4, TypeScript 5.9, `next/font/google` (Hanken Grotesk), `next/image`, and the Node 22 built-in test runner with native type stripping.

**Spec:** `docs/superpowers/specs/2026-09-30-workflow-canvas-redesign-design.md`. Direction contract: `.impeccable/surfaces/app-page-tsx.md`. Product truth: `PRODUCT.md`.

## Global Constraints

- Next.js 16 has breaking changes: read the matching guide in `node_modules/next/dist/docs/` before using any Next API. `next/image` `priority` is deprecated, so use `preload` or `loading`.
- Palette (exact): ground `#EEEFEA`, paper `#FFFFFF`, ink `#1E1F24`, ink-2 `#3D4038`, muted `#5E6158`, line `#C9CBC2`, line-soft `#D6D8D0`, signal `#D9481F`, signal-ink `#B23A12`, signal-tint `#FBE3D9`, ok `#1F8A4C`, ok-ink `#1F6E3F`, ok-tint `#DDEFE3`, paused-tint `#E4E5DF`.
- Hanken Grotesk is the only typeface. Display text maxes out at 96px, and letter-spacing never goes below -0.04em.
- Banned: monospace, gradient text, glow, glass, eyebrow/kicker labels above headings, emoji or unicode glyphs as icons (draw icons as SVG), and hard offset shadows.
- `--signal` is for fills and large text only. Small orange text uses `--signal-ink`. Body text contrast must be ≥4.5:1.
- Animate only `transform`, `opacity` and `clip-path`.
- Copy comes from `PRODUCT.md`. No invented metrics, clients or testimonials. Email is `noderin1@gmail.com`, LinkedIn is `https://www.linkedin.com/in/erin-nodland/`.
- Timeline constants (exact): `INTRO 0.08`, `OVER 0.15`, `SCN 0.14`, `SCENES [[0],[1],[2],[3],[4,5,6]]`, `CONTACT_START 0.85`, and world size 1300×860.
- Work on branch `redesign/workflow-canvas`, never on `main`.

## Review Focus

1. **Viewport changes mid-scroll** (phone rotation, desktop resize): the focused node stays centred. Pinned by the `camera` small-viewport test in Task 2.
2. **Overscroll past the ends** (iOS rubber-band gives `p < 0` or `p > 1`): the state clamps instead of jumping. Pinned by the `sceneAt` clamp test in Task 2.
3. **Reduced motion or no JavaScript:** every project's title, status, summary and link is still readable top to bottom. Pinned by the static-page check in Task 3 and the reduced-motion capture in Task 6.
4. **Phone at 390×844:** an open scene panel fits the screen without clipping, and the page never scrolls sideways. Pinned by the overflow checks in Task 6.
5. **Keyboard-only visitor:** Tab reaches the jump rail, a rail button opens a scene, and the next Tab lands on that scene's link, never on a hidden control. Pinned by the `inert` rule in Task 5 and the keyboard check in Task 6.

---

### Task 1: Tooling, dependency bumps and branch

**Files:**
- Modify: `package.json` (scripts and dependency versions)
- Modify: `tsconfig.json` (add `allowImportingTsExtensions`)

**Interfaces:**
- Produces: `npm test` runs `node --test "app/**/*.test.ts"`.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b redesign/workflow-canvas
```

- [ ] **Step 2: Bump the minor versions**

```bash
npm install next@16.3.8 react@19.3.0 react-dom@19.3.0 eslint-config-next@16.3.8 tailwindcss@4.3.3 @tailwindcss/postcss@4.3.3 @types/react@19.3.0 @types/react-dom@19.3.0
```

Expected: install completes and `package.json` shows the new versions.

- [ ] **Step 3: Add the test script**

In `package.json` `"scripts"`, add:

```json
"test": "node --test \"app/**/*.test.ts\""
```

- [ ] **Step 4: Allow `.ts` import specifiers for the tests**

In `tsconfig.json` `compilerOptions`, add the line below (it's valid because `noEmit` is already `true`):

```json
"allowImportingTsExtensions": true,
```

- [ ] **Step 5: Verify the old site still builds on the new versions**

Run: `npm run build`
Expected: `✓ Compiled successfully` and the route table printed, with no type errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json
git commit -m "chore: bump Next 16.3, React 19.3, Tailwind 4.3; add node test script"
```

---

### Task 2: The timeline (pure, TDD)

**Files:**
- Create: `app/lib/timeline.ts`
- Test: `app/lib/timeline.test.ts`

**Interfaces:**
- Produces (all exported from `app/lib/timeline.ts`):
  - **Constants:** `WORLD_W = 1300`, `WORLD_H = 860`, `INTRO`, `OVER`, `SCN`, `SCENES: readonly (readonly number[])[]`, `CONTACT_START`, `TRIGGER: Point`, `CONTACT: Point`.
  - **Types:** `Point {x,y}`, `Viewport {w,h}`, `Camera {x,y,scale}`, `Phase`, `SceneInfo {phase, sceneIndex, t}`, `NodeRunState = "queued" | "executing" | "done"`.
  - **Math helpers:** `clamp01(x)`, `easeOut(x)`, `local(t, start, duration): number`.
  - **Layout:** `nodeTop(i)`, `nodeCenter(i): Point`, `outWirePath(i): string`, `inWirePath(i): string`, `bezierPoint(i, u, into): Point`.
  - **State from progress:** `sceneAt(p): SceneInfo`, `fitScale(v)`, `camera(p, v): Camera`, `nodeState(i, p)`, `activeIds(p): readonly number[]`, `wireProgress(i, p)`, `inWireProgress(p)`, `contactLit(p): boolean`, `beadAt(p): Point | null`, `panelOpen(p)`, `finishOpen(p)`.
  - **Rail and status:** `railTargets(): number[]` (7 entries: Start, 5 scenes, Contact), `railIndex(p): number`, `statusLine(p): string`.

- [ ] **Step 1: Write the failing tests**

Create `app/lib/timeline.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONTACT_START, OVER, SCN, SCENES, TRIGGER,
  sceneAt, camera, fitScale, nodeCenter, nodeState, wireProgress,
  panelOpen, finishOpen, railTargets, railIndex, beadAt, statusLine,
} from "./timeline.ts";

const DESK = { w: 1440, h: 900 };
const PHONE = { w: 390, h: 844 };
const near = (a: number, b: number, eps = 1e-6) =>
  assert.ok(Math.abs(a - b) < eps, `${a} !≈ ${b}`);

test("sceneAt maps progress to phases and clamps overscroll", () => {
  assert.equal(sceneAt(0).phase, "intro");
  assert.equal(sceneAt(0.1).phase, "overview");
  assert.deepEqual(sceneAt(OVER), { phase: "scene", sceneIndex: 0, t: 0 });
  assert.equal(sceneAt(CONTACT_START - 0.001).sceneIndex, 4);
  assert.equal(sceneAt(CONTACT_START).phase, "finish");
  assert.deepEqual(sceneAt(-0.3), { phase: "intro", sceneIndex: -1, t: 0 });
  assert.deepEqual(sceneAt(1.4), { phase: "finish", sceneIndex: -1, t: 1 });
});

test("camera opens centred on the trigger at 2.7x fit", () => {
  const c = camera(0, DESK);
  near(c.scale, fitScale(DESK) * 2.7);
  near(c.x + TRIGGER.x * c.scale, DESK.w / 2);
  near(c.y + TRIGGER.y * c.scale, DESK.h / 2);
});

test("camera keeps the focused node centred on a phone viewport", () => {
  const mid = OVER + SCN * 1 + SCN * 0.5; // scene 1 (node 02), fully zoomed
  const c = camera(mid, PHONE);
  const n = nodeCenter(1);
  near(c.x + n.x * c.scale, PHONE.w / 2);
  near(c.y + n.y * c.scale, PHONE.h / 2);
  near(c.scale, fitScale(PHONE) * 3.2);
});

test("nodeState walks queued → executing → done", () => {
  for (let i = 0; i < 7; i++) assert.equal(nodeState(i, 0.1), "queued");
  const early = OVER + SCN * 1 + SCN * 0.1; // scene 1, t = 0.1
  assert.equal(nodeState(0, early), "done");
  assert.equal(nodeState(1, early), "executing");
  assert.equal(nodeState(2, early), "queued");
  for (let i = 0; i < 7; i++) assert.equal(nodeState(i, 0.95), "done");
});

test("wireProgress never decreases as the visitor scrolls down", () => {
  for (let i = 0; i < 7; i++) {
    let prev = 0;
    for (let p = 0; p <= 1.0001; p += 0.001) {
      const w = wireProgress(i, p);
      assert.ok(w >= prev - 1e-9, `wire ${i} fell at p=${p.toFixed(3)}`);
      prev = w;
    }
    near(prev, 1);
  }
});

test("panelOpen is closed at scene edges and open mid-scene", () => {
  near(panelOpen(OVER), 0);
  near(panelOpen(OVER + SCN * 0.5), 1);
  near(panelOpen(OVER + SCN * 0.999), 0);
  near(panelOpen(0.1), 0);
});

test("rail targets land on fully open scenes and the open finish", () => {
  const targets = railTargets();
  assert.equal(targets.length, SCENES.length + 2);
  assert.equal(targets[0], 0);
  for (let k = 0; k < SCENES.length; k++) {
    const p = targets[k + 1];
    assert.equal(sceneAt(p).sceneIndex, k);
    assert.ok(panelOpen(p) > 0.99);
    assert.equal(railIndex(p), k + 1);
  }
  const last = targets[targets.length - 1];
  assert.ok(finishOpen(last) > 0.99);
  assert.equal(railIndex(last), SCENES.length + 1);
});

test("the bead only travels while a wire is drawing", () => {
  assert.equal(beadAt(0.1), null);
  const b = beadAt(OVER + SCN * 0.1);
  assert.ok(b && b.x > 320 && b.x < 520);
  assert.equal(beadAt(OVER + SCN * 0.5), null);
});

test("statusLine narrates the run", () => {
  assert.equal(statusLine(0), "Waiting for trigger");
  assert.equal(statusLine(0.1), "Trigger fired · 7 nodes queued");
  assert.equal(statusLine(OVER + SCN * 1.5), "Executing node 02");
  assert.equal(statusLine(OVER + SCN * 4.5), "Executing nodes 05–07");
  assert.equal(statusLine(0.95), "Workflow finished");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL with `Cannot find module` … `timeline.ts`.

- [ ] **Step 3: Implement `app/lib/timeline.ts`**

```ts
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
    focus = { x: lerp(TRIGGER.x, OVERVIEW.x, k), y: TRIGGER.y };
    scale = lerp(fit * 2.7, fit, k);
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
    ...SCENES.map((_, k) => OVER + k * SCN + 0.5 * SCN),
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: all 9 tests PASS. A Node warning about type stripping is fine; a failure is not.

- [ ] **Step 5: Commit**

```bash
git add app/lib/timeline.ts app/lib/timeline.test.ts
git commit -m "feat: scroll timeline math for the workflow run"
```

---

### Task 3: Data, tokens, fonts and the static stacked page

This task ships the fallback site on its own: every project readable top to bottom, in the new visual world.

**Files:**
- Replace: `app/data/projects.ts`
- Test: `app/data/projects.test.ts`
- Replace: `app/globals.css`
- Replace: `app/layout.tsx`
- Replace: `app/page.tsx`
- Replace: `app/components/CopyEmailLink.tsx`
- Create: `app/components/run/SceneContent.tsx`
- Create: `app/components/run/FinishContent.tsx`
- Create: `app/components/run/StaticRun.tsx`
- Delete: `app/components/Hero.tsx`, `About.tsx`, `Projects.tsx`, `FadeIn.tsx`, `Nav.tsx`, `Lightbox.tsx`, `Contact.tsx`
- Modify: `package.json` (remove `framer-motion`)

**Interfaces:**
- Consumes: `SCENES`, `local` from `app/lib/timeline.ts`.
- Produces:
  - `PROJECTS: readonly Project[]`, `STATUS_LABEL`, `STATUS_TONE`, `GROUP_INTRO`, `PITCH`, `EMAIL`, `LINKEDIN` from `app/data/projects.ts`.
  - `<SceneContent sceneIndex t />`, with its heading id `scene-${sceneIndex}-title`.
  - `<FinishContent t />`.
  - `<CopyEmailLink email className />`.
  - `<StaticRun graph? />`, where `graph` is an optional ReactNode slot filled in Task 4.

- [ ] **Step 1: Write the failing data test**

Create `app/data/projects.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { PROJECTS } from "./projects.ts";
import { SCENES } from "../lib/timeline.ts";

test("seven projects numbered 01–07", () => {
  assert.deepEqual(PROJECTS.map((p) => p.no), ["01", "02", "03", "04", "05", "06", "07"]);
});

test("every project appears in exactly one scene", () => {
  assert.deepEqual([...SCENES.flat()].sort(), [0, 1, 2, 3, 4, 5, 6]);
});

test("statuses match PRODUCT.md as of 2026-09-30", () => {
  const byTitle = Object.fromEntries(PROJECTS.map((p) => [p.title, p.status]));
  assert.equal(byTitle["Figma → spec agent"], "shipped");
  assert.equal(byTitle["Shopify product automation"], "live");
  assert.equal(byTitle["RAG support assistant"], "shipped");
  assert.equal(byTitle["Multi-agent outreach"], "shipped");
  assert.equal(byTitle["Life-OS"], "running");
  assert.equal(byTitle["Migration agent"], "in-progress");
  assert.equal(byTitle["Morning brief"], "paused");
});

test("the two public repos are linked", () => {
  const links = PROJECTS.flatMap((p) => (p.link ? [p.link.href] : []));
  assert.deepEqual(links, [
    "https://github.com/erinnod/rag-assistant",
    "https://github.com/erinnod/multi-agent-outreach",
  ]);
});

test("group-scene projects carry a short summary", () => {
  for (const i of SCENES[SCENES.length - 1]) assert.ok(PROJECTS[i].short, PROJECTS[i].title);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL. The old `projects.ts` has no `PROJECTS` export, and its test import fails.

- [ ] **Step 3: Replace `app/data/projects.ts`**

```ts
export type ProjectStatus = "shipped" | "live" | "running" | "in-progress" | "paused";
export type StatusTone = "ok" | "signal" | "muted";

export interface ProjectImage { src: string; alt: string; width: number; height: number }

export interface Project {
  no: string;
  title: string;
  via: string;
  status: ProjectStatus;
  summary: string;
  short?: string;
  steps: readonly string[];
  link?: { label: string; href: string };
  image?: ProjectImage;
}

export const EMAIL = "noderin1@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/erin-nodland/";
export const PITCH =
  "Software developer at Shoothill. I build AI workflows that are still running after the demo ends.";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  live: "Shipped · live in production",
  running: "Running",
  "in-progress": "In progress",
  paused: "Paused",
};

export const STATUS_TONE: Record<ProjectStatus, StatusTone> = {
  shipped: "ok",
  live: "ok",
  running: "ok",
  "in-progress": "signal",
  paused: "muted",
};

export const GROUP_INTRO = {
  title: "Also on the canvas",
  status: "Three more workflows",
  summary: "One runs every day, one is being hardened, and one is honestly paused.",
};

export const PROJECTS: readonly Project[] = [
  {
    no: "01",
    title: "Figma → spec agent",
    via: "Claude Code · Figma MCP",
    status: "shipped",
    summary:
      "Paste a Figma handoff and it reads every screen, then writes two reports in under two minutes: plain English for the client, technical for the developer. Every question is backed by evidence from the design.",
    steps: ["Figma link", "Read every screen", "Client report", "Developer report"],
    image: {
      src: "/project-figma-agent.png",
      alt: "Figma spec agent: choosing the entry point for a project",
      width: 3002,
      height: 1874,
    },
  },
  {
    no: "02",
    title: "Shopify product automation",
    via: "n8n · Claude · Shopify Admin API",
    status: "live",
    summary:
      "Live in production for a Shoothill client. Product photos land in Drive, get cropped and re-backgrounded, Claude writes titles and descriptions from the images, and a ~20-node n8n workflow publishes them to Shopify.",
    steps: ["Drive upload", "Crop + background", "Claude writes copy", "Publish to Shopify"],
    image: {
      src: "/project-n8n-workflow.png",
      alt: "The n8n workflow behind the Shopify product automation",
      width: 2514,
      height: 618,
    },
  },
  {
    no: "03",
    title: "RAG support assistant",
    via: "Python · Claude API · embeddings",
    status: "shipped",
    summary:
      "Retrieval-augmented Q&A with citations over a real document set, scored by a 20-question eval on retrieval hit-rate and answer quality.",
    steps: ["Ingest docs", "Chunk + embed", "Retrieve", "Answer + cite", "20-question eval"],
    link: { label: "Read the code on GitHub", href: "https://github.com/erinnod/rag-assistant" },
  },
  {
    no: "04",
    title: "Multi-agent outreach",
    via: "Python · Claude API · tool use",
    status: "shipped",
    summary:
      "Three Claude agents with shared state and structured tool use, run end to end on ten real companies. The Python orchestrator is built from scratch, with no LangChain.",
    steps: ["Researcher", "Drafter", "Critic", "Ten real companies"],
    link: { label: "Read the code on GitHub", href: "https://github.com/erinnod/multi-agent-outreach" },
  },
  {
    no: "05",
    title: "Life-OS",
    via: "Claude Code · Obsidian · MCP",
    status: "running",
    summary:
      "A personal AI operating system. Claude Code reads a structured Obsidian vault on every interaction, writes back as life happens, flags drift and proposes its own new skills.",
    short: "A personal AI OS that reads a structured vault on every interaction and writes back.",
    steps: ["Read the vault", "Act through MCP", "Write back"],
  },
  {
    no: "06",
    title: "Migration agent",
    via: "Browser Use · Playwright · Claude",
    status: "in-progress",
    summary:
      "A four-phase agentic pipeline for moving legacy products to a modern stack: crawl, code read, multimodal synthesis, migration plan. Code complete; the crawl phase is being hardened for legacy UIs.",
    short: "Crawl, code read, multimodal synthesis, migration plan. Code complete; crawl being hardened.",
    steps: ["Crawl", "Code read", "Synthesis", "Plan"],
  },
  {
    no: "07",
    title: "Morning brief",
    via: "n8n · Telegram · Claude",
    status: "paused",
    summary:
      "A daily Telegram brief built from weather, tech news and Notion content, written by Claude. Built and working; paused while newer work takes priority.",
    short: "A daily Telegram brief written by Claude. Built; paused for newer work.",
    steps: ["Weather", "Tech news", "Notion", "Telegram"],
  },
];
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: the timeline tests and all 5 data tests PASS.

- [ ] **Step 5: Replace `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --ground: #eeefea;
  --paper: #ffffff;
  --ink: #1e1f24;
  --ink-2: #3d4038;
  --muted: #5e6158;
  --line: #c9cbc2;
  --line-soft: #d6d8d0;
  --signal: #d9481f;
  --signal-ink: #b23a12;
  --signal-tint: #fbe3d9;
  --ok: #1f8a4c;
  --ok-ink: #1f6e3f;
  --ok-tint: #ddefe3;
  --paused-tint: #e4e5df;
}

@theme inline {
  --color-ground: var(--ground);
  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-line-soft: var(--line-soft);
  --color-signal: var(--signal);
  --color-signal-ink: var(--signal-ink);
  --color-signal-tint: var(--signal-tint);
  --color-ok: var(--ok);
  --color-ok-ink: var(--ok-ink);
  --color-ok-tint: var(--ok-tint);
  --color-paused-tint: var(--paused-tint);
  --font-sans: var(--font-hanken), system-ui, sans-serif;
}

html {
  background: var(--ground);
  color-scheme: light;
  scrollbar-color: var(--ink) var(--ground);
}

body {
  background: var(--ground);
  color: var(--ink);
  font-family: var(--font-hanken), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}

::selection {
  background: var(--signal);
  color: var(--paper);
}

:focus-visible {
  outline: 3px solid var(--signal);
  outline-offset: 3px;
  border-radius: 4px;
}

.dotted {
  background-color: var(--ground);
  background-image: radial-gradient(var(--line) 1.3px, transparent 1.3px);
  background-size: 22px 22px;
}

@keyframes port-ring {
  0% { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(2.6); opacity: 0; }
}
@keyframes node-spin { to { transform: rotate(360deg); } }
@keyframes nudge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

.port-ring { animation: port-ring 1.6s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
.node-spin { animation: node-spin 0.8s linear infinite; }
.nudge { animation: nudge 1.6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .port-ring, .node-spin, .nudge { animation: none; }
}
```

- [ ] **Step 6: Replace `app/layout.tsx`**

Read `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` first to confirm the `variable` option.

```tsx
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  weight: ["400", "500", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Erin Nodland — AI workflows that ship",
  description:
    "Software developer at Shoothill building AI agents and automation workflows that run in production.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Replace `app/components/CopyEmailLink.tsx`**

```tsx
"use client";

import { useCallback, useState } from "react";

export default function CopyEmailLink({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const flash = useCallback(() => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, []);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      flash();
    } catch {
      // Clipboard API unavailable: fall back to a selection copy.
      const el = document.createElement("span");
      el.textContent = email;
      document.body.appendChild(el);
      const range = document.createRange();
      range.selectNode(el);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      try {
        document.execCommand("copy");
        flash();
      } finally {
        selection?.removeAllRanges();
        document.body.removeChild(el);
      }
    }
  }, [email, flash]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? `Email address ${email} copied` : `Copy email address ${email}`}
      className={className}
    >
      {copied ? "Email copied" : "Copy email address"}
    </button>
  );
}
```

- [ ] **Step 8: Create `app/components/run/SceneContent.tsx`**

Read `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` (`sizes`, `loading`) first.

```tsx
import Image from "next/image";
import { GROUP_INTRO, PROJECTS, STATUS_LABEL, STATUS_TONE, type Project, type StatusTone } from "../../data/projects";
import { SCENES, local } from "../../lib/timeline";

const TONE_TEXT: Record<StatusTone, string> = { ok: "text-ok-ink", signal: "text-signal-ink", muted: "text-muted" };
const TONE_DOT: Record<StatusTone, string> = { ok: "bg-ok", signal: "bg-signal", muted: "bg-muted" };

function Status({ tone, label }: { tone: StatusTone; label: string }) {
  return (
    <p className={`inline-flex items-center gap-2.5 text-base font-extrabold ${TONE_TEXT[tone]}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${TONE_DOT[tone]}`} />
      {label}
    </p>
  );
}

const rise = (a: number, px: number) => ({ opacity: a, transform: `translateY(${(1 - a) * px}px)` });

function Solo({ project, t, headingId }: { project: Project; t: number; headingId: string }) {
  const text = local(t, 0.28, 0.14);
  const img = local(t, 0.5, 0.18);
  return (
    <>
      <div style={rise(text, 24)}>
        <Status tone={STATUS_TONE[project.status]} label={STATUS_LABEL[project.status]} />
        <h2 id={headingId} className="mt-4 text-[clamp(44px,6.4vw,96px)] font-black leading-[0.92] tracking-[-0.04em] text-balance">
          {project.title}
        </h2>
        <p className="mt-6 max-w-[48ch] text-[clamp(16px,1.35vw,19px)] leading-relaxed text-ink-2">{project.summary}</p>
        {project.link && (
          <a
            href={project.link.href}
            className="mt-6 inline-flex min-h-12 items-center rounded-[10px] border-2 border-ink px-5 font-extrabold hover:bg-ink hover:text-paper"
          >
            {project.link.label}
          </a>
        )}
      </div>
      <div className="flex flex-col gap-7">
        <ol className="flex flex-wrap items-center gap-y-3.5" aria-label={`${project.title} pipeline`}>
          {project.steps.map((step, j) => {
            const a = local(t, 0.34 + j * 0.07, 0.08);
            const w = local(t, 0.38 + j * 0.07, 0.06);
            const last = j === project.steps.length - 1;
            return (
              <li key={step} className="flex items-center" style={rise(a, 14)}>
                <span
                  className={`whitespace-nowrap rounded-[10px] border-2 border-ink px-3.5 py-3 text-[15px] font-extrabold ${
                    last ? "bg-ink text-paper" : "bg-paper"
                  }`}
                >
                  {step}
                </span>
                {!last && (
                  <span aria-hidden="true" className="block h-[3px] w-9 origin-left bg-ink" style={{ transform: `scaleX(${w})` }} />
                )}
              </li>
            );
          })}
        </ol>
        {project.image && (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(min-width: 900px) 45vw, 90vw"
            loading="lazy"
            className="max-h-[42svh] w-full rounded-xl border-2 border-ink object-cover object-left-top shadow-[0_30px_60px_-30px_rgba(30,31,36,0.5)]"
            style={{ opacity: img, transform: `translateY(${(1 - img) * 60}px) rotate(${(1 - img) * 2.5}deg)` }}
          />
        )}
      </div>
    </>
  );
}

function Group({ ids, t, headingId }: { ids: readonly number[]; t: number; headingId: string }) {
  const text = local(t, 0.28, 0.14);
  return (
    <>
      <div style={rise(text, 24)}>
        <Status tone="muted" label={GROUP_INTRO.status} />
        <h2 id={headingId} className="mt-4 text-[clamp(44px,6.4vw,96px)] font-black leading-[0.92] tracking-[-0.04em] text-balance">
          {GROUP_INTRO.title}
        </h2>
        <p className="mt-6 max-w-[48ch] text-[clamp(16px,1.35vw,19px)] leading-relaxed text-ink-2">{GROUP_INTRO.summary}</p>
      </div>
      <ul className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {ids.map((i, j) => {
          const p = PROJECTS[i];
          const a = local(t, 0.36 + j * 0.08, 0.1);
          return (
            <li key={p.no} className="rounded-xl border-2 border-ink p-4" style={rise(a, 24)}>
              <p className={`text-[13px] font-extrabold ${TONE_TEXT[STATUS_TONE[p.status]]}`}>{STATUS_LABEL[p.status]}</p>
              <h3 className="mt-1.5 text-[22px] font-black tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-2 text-sm leading-normal text-ink-2">{p.short}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function SceneContent({ sceneIndex, t }: { sceneIndex: number; t: number }) {
  const ids = SCENES[sceneIndex];
  const headingId = `scene-${sceneIndex}-title`;
  return (
    <div className="grid h-full content-center gap-[clamp(24px,4vw,64px)] px-[clamp(20px,6vw,96px)] py-[clamp(28px,7vh,80px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]">
      {ids.length === 1 ? (
        <Solo project={PROJECTS[ids[0]]} t={t} headingId={headingId} />
      ) : (
        <Group ids={ids} t={t} headingId={headingId} />
      )}
    </div>
  );
}
```

- [ ] **Step 9: Create `app/components/run/FinishContent.tsx`**

```tsx
import CopyEmailLink from "../CopyEmailLink";
import { EMAIL, LINKEDIN } from "../../data/projects";
import { local } from "../../lib/timeline";

export default function FinishContent({ t }: { t: number }) {
  const a = local(t, 0.68, 0.15);
  return (
    <div className="flex h-full flex-col justify-center px-[clamp(20px,7vw,120px)] py-20">
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 24}px)` }}>
        <p className="text-base font-extrabold text-paper/85">Workflow finished · 7 nodes run</p>
        <h2 id="finish-title" className="mt-4 max-w-[12ch] text-[clamp(52px,8vw,96px)] font-black leading-[0.9] tracking-[-0.04em] text-balance">
          Got a process that should run itself?
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={LINKEDIN}
            className="inline-flex min-h-14 items-center rounded-xl bg-ink px-6 text-[17px] font-extrabold text-paper hover:bg-paper hover:text-signal-ink"
          >
            Message on LinkedIn
          </a>
          <CopyEmailLink
            email={EMAIL}
            className="min-h-14 cursor-pointer rounded-xl border-2 border-paper px-6 text-[17px] font-extrabold text-paper hover:bg-paper hover:text-ink"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Create `app/components/run/StaticRun.tsx`**

```tsx
import type { ReactNode } from "react";
import SceneContent from "./SceneContent";
import FinishContent from "./FinishContent";
import { PITCH } from "../../data/projects";
import { SCENES } from "../../lib/timeline";

// The whole run laid out in normal flow: the no-JS and reduced-motion version.
export default function StaticRun({ graph }: { graph?: ReactNode }) {
  return (
    <div>
      <header className="dotted px-[clamp(20px,5vw,72px)] pb-12 pt-10">
        <p className="text-[17px] font-black tracking-[-0.01em]">erin-nodland.workflow</p>
        <h1 className="mt-10 text-[clamp(56px,9vw,96px)] font-black leading-[0.9] tracking-[-0.04em]">Erin Nodland</h1>
        <p className="mt-6 max-w-[34ch] text-[clamp(20px,2vw,28px)] font-bold leading-snug">{PITCH}</p>
        {graph}
      </header>
      {SCENES.map((_, k) => (
        <section key={k} aria-labelledby={`scene-${k}-title`} className="border-t-2 border-ink bg-paper">
          <SceneContent sceneIndex={k} t={1} />
        </section>
      ))}
      <section aria-labelledby="finish-title" className="bg-signal text-paper">
        <FinishContent t={1} />
      </section>
    </div>
  );
}
```

- [ ] **Step 11: Replace `app/page.tsx`, delete the old components, drop framer-motion**

```tsx
import StaticRun from "./components/run/StaticRun";

export default function Home() {
  return (
    <main>
      <StaticRun />
      <footer className="flex flex-wrap justify-between gap-4 px-[clamp(20px,5vw,72px)] py-10 text-sm font-bold text-muted">
        <span>© 2026 Erin Nodland</span>
        <span>Built with Claude Code</span>
      </footer>
    </main>
  );
}
```

```bash
git rm app/components/Hero.tsx app/components/About.tsx app/components/Projects.tsx app/components/FadeIn.tsx app/components/Nav.tsx app/components/Lightbox.tsx app/components/Contact.tsx
npm uninstall framer-motion
```

- [ ] **Step 12: Verify the static site**

Run: `npm test && npm run lint && npm run build`
Expected: all tests PASS, lint is clean, and the build succeeds.

Then run `npm run dev`, open http://localhost:3000, and confirm that the name, the pitch, five white scene sections (Figma, Shopify with screenshot, RAG with GitHub link, outreach with GitHub link, the three-project group) and the orange finish all render top to bottom, with **no animation dependency**: every element at full opacity.

- [ ] **Step 13: Commit**

```bash
git add -A app package.json package-lock.json
git commit -m "feat: workflow-canvas content, tokens and static stacked page"
```

---

### Task 4: The graph (world layer and nodes)

**Files:**
- Create: `app/components/run/NodeCard.tsx`
- Create: `app/components/run/Graph.tsx`
- Create: `app/components/run/StaticGraph.tsx`
- Modify: `app/page.tsx` (pass `<StaticGraph />` into `StaticRun`)

**Interfaces:**
- Consumes: `Project`, `STATUS_LABEL`, `STATUS_TONE`, `PROJECTS`, and from timeline: `WORLD_W`, `WORLD_H`, `nodeTop`, `nodeState`, `activeIds`, `wireProgress`, `inWireProgress`, `contactLit`, `beadAt`, `outWirePath`, `inWirePath`, `Camera`, `NodeRunState`.
- Produces: `<Graph progress cam />`, which renders an `aria-hidden` world div transformed by `cam`, and `<StaticGraph />`, which renders the finished graph scaled to its container.

- [ ] **Step 1: Create `app/components/run/NodeCard.tsx`**

```tsx
import { STATUS_LABEL, STATUS_TONE, type Project } from "../../data/projects";
import { nodeTop, type NodeRunState } from "../../lib/timeline";

const TINT = { ok: "bg-ok-tint", signal: "bg-signal-tint", muted: "bg-paused-tint" } as const;
const TEXT = { ok: "text-ok-ink", signal: "text-signal-ink", muted: "text-muted" } as const;

function Check() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <circle cx="13" cy="13" r="13" fill="var(--ok)" />
      <path d="M7.5 13.5l3.5 3.5 7.5-8" fill="none" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NodeCard({
  project,
  index,
  state,
  active,
}: {
  project: Project;
  index: number;
  state: NodeRunState;
  active: boolean;
}) {
  const tone = STATUS_TONE[project.status];
  const queued = state === "queued";
  const border = active ? "border-signal" : queued ? "border-line border-dashed" : "border-ink";
  return (
    <div
      className={`absolute left-[520px] flex h-[76px] w-[340px] items-center gap-3 rounded-xl border-2 bg-paper px-3.5 shadow-[0_10px_24px_-16px_rgba(30,31,36,0.45)] transition-[border-color,opacity] duration-300 ${border}`}
      style={{ top: nodeTop(index), opacity: queued ? 0.7 : 1 }}
    >
      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] text-sm font-extrabold ${TINT[tone]}`}>
        {project.no}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-extrabold">{project.title}</span>
        <span className="mt-0.5 block text-xs text-muted">{project.via}</span>
      </span>
      {state === "executing" && (
        <span className="node-spin h-[22px] w-[22px] shrink-0 rounded-full border-[3px] border-signal-tint border-t-signal" />
      )}
      {queued && <span className="text-xs font-extrabold text-muted">Queued</span>}
      {state === "done" && (tone === "ok" && project.status !== "running" ? (
        <Check />
      ) : (
        <span className={`text-xs font-extrabold ${TEXT[tone]}`}>{STATUS_LABEL[project.status]}</span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/components/run/Graph.tsx`**

```tsx
import NodeCard from "./NodeCard";
import { PROJECTS } from "../../data/projects";
import {
  WORLD_H, WORLD_W, activeIds, beadAt, contactLit, inWirePath, inWireProgress,
  nodeState, outWirePath, wireProgress, type Camera,
} from "../../lib/timeline";

function Wire({ d, drawn }: { d: string; drawn: number }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--line)" strokeWidth={3} />
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - drawn} />
    </>
  );
}

export default function Graph({ progress, cam }: { progress: number; cam: Camera }) {
  const bead = beadAt(progress);
  const into = inWireProgress(progress);
  const lit = contactLit(progress);
  const active = activeIds(progress);
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 origin-top-left will-change-transform"
      style={{ width: WORLD_W, height: WORLD_H, transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})` }}
    >
      <svg width={WORLD_W} height={WORLD_H} viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="absolute inset-0 overflow-visible">
        {PROJECTS.map((p, i) => (
          <Wire key={`out-${p.no}`} d={outWirePath(i)} drawn={wireProgress(i, progress)} />
        ))}
        {PROJECTS.map((p, i) => (
          <Wire key={`in-${p.no}`} d={inWirePath(i)} drawn={into} />
        ))}
      </svg>

      <div className="absolute left-[40px] top-[370px] h-[120px] w-[280px] rounded-[14px] bg-ink px-5 py-[18px] text-paper shadow-[0_18px_40px_-18px_rgba(30,31,36,0.55)]">
        <p className="text-xs font-bold text-[#B9BCB2]">Trigger</p>
        <p className="mt-1.5 text-[38px] font-black leading-[0.95] tracking-[-0.03em]">Erin Nodland</p>
        <span className="absolute -right-[9px] top-[51px] h-[18px] w-[18px] rounded-full bg-signal" />
        <span className="port-ring absolute -right-[9px] top-[51px] h-[18px] w-[18px] rounded-full border-2 border-signal" />
      </div>

      {PROJECTS.map((p, i) => (
        <NodeCard key={p.no} project={p} index={i} state={nodeState(i, progress)} active={active.includes(i)} />
      ))}

      <div
        className={`absolute left-[1020px] top-[392px] h-[76px] w-[240px] rounded-xl border-2 border-signal px-[18px] py-3.5 transition-colors duration-300 ${
          lit ? "bg-signal text-paper" : "bg-paper text-ink"
        }`}
      >
        <p className="text-xs font-bold opacity-80">Output</p>
        <p className="mt-0.5 text-xl font-black">Contact Erin</p>
      </div>

      {bead && (
        <span
          className="absolute h-[18px] w-[18px] rounded-full bg-signal shadow-[0_4px_10px_-2px_rgba(217,72,31,0.6)]"
          style={{ left: bead.x - 9, top: bead.y - 9 }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `app/components/run/StaticGraph.tsx`**

```tsx
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
```

- [ ] **Step 4: Put the graph on the static page**

In `app/page.tsx`, change `<StaticRun />` to `<StaticRun graph={<StaticGraph />} />` and add `import StaticGraph from "./components/run/StaticGraph";`.

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run build`, then `npm run dev`.
Expected: under the pitch, the finished graph renders: dark trigger, seven white nodes, and all wires drawn in ink into an orange "Contact Erin".
- Nodes 01–04 show green checks.
- Life-OS shows "Running", the migration agent "In progress" in dark orange, and the morning brief "Paused".
- Resizing the window rescales the graph with no horizontal scroll.

- [ ] **Step 6: Commit**

```bash
git add app/components/run/NodeCard.tsx app/components/run/Graph.tsx app/components/run/StaticGraph.tsx app/page.tsx
git commit -m "feat: workflow graph world layer and node cards"
```

---

### Task 5: The live scroll run

**Files:**
- Create: `app/components/run/ScenePanel.tsx`
- Create: `app/components/run/FinishScene.tsx`
- Create: `app/components/run/Intro.tsx`
- Create: `app/components/run/StatusLine.tsx`
- Create: `app/components/run/JumpRail.tsx`
- Create: `app/components/run/SrSummary.tsx`
- Create: `app/components/run/RunStage.tsx`
- Modify: `app/page.tsx` (render `<RunStage />`)

**Interfaces:**
- Consumes: everything from Tasks 2–4.
- Produces: `<RunStage />`. It renders `<StaticRun graph={<StaticGraph />} />` until mount and whenever reduced motion is on; otherwise it renders `section#run` (height `1100svh`) with a sticky stage.

- [ ] **Step 1: Create `app/components/run/ScenePanel.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `app/components/run/FinishScene.tsx`**

```tsx
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
      className="absolute inset-0 bg-signal text-paper"
      style={{ clipPath: `circle(${radius}px at 50% 50%)` }}
    >
      <FinishContent t={s.t} />
    </section>
  );
}
```

- [ ] **Step 3: Create `app/components/run/Intro.tsx`**

```tsx
import { INTRO, easeOut } from "../../lib/timeline";
import { PITCH } from "../../data/projects";

export default function Intro({ progress }: { progress: number }) {
  const gone = easeOut(progress / (INTRO * 0.6));
  if (gone >= 1) return null;
  return (
    <div
      className="pointer-events-none absolute bottom-[clamp(28px,7vh,72px)] left-[clamp(20px,5vw,72px)]"
      style={{ opacity: 1 - gone, transform: `translateY(${gone * -30}px)` }}
    >
      <p className="max-w-[30ch] text-[clamp(20px,2vw,28px)] font-bold leading-snug">{PITCH}</p>
      <p className="nudge mt-5 inline-flex items-center gap-2.5 text-[15px] font-extrabold text-signal-ink">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M9 2v13M3.5 9.5L9 15l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Scroll to run the workflow
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Create `app/components/run/StatusLine.tsx`**

```tsx
import { finishOpen, statusLine } from "../../lib/timeline";

export default function StatusLine({ progress }: { progress: number }) {
  const onOrange = finishOpen(progress) > 0.5;
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-[clamp(20px,3vw,40px)] py-4 ${
        onOrange ? "text-paper" : "text-ink"
      }`}
    >
      <span className="text-[17px] font-black tracking-[-0.01em]">erin-nodland.workflow</span>
      <span className="text-sm font-extrabold" aria-live="polite">{statusLine(progress)}</span>
    </div>
  );
}
```

- [ ] **Step 5: Create `app/components/run/JumpRail.tsx`**

```tsx
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
    <nav aria-label="Jump to a node" className="absolute z-10 right-[clamp(8px,2vw,28px)] top-1/2 flex -translate-y-1/2 flex-col">
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
```

- [ ] **Step 6: Create `app/components/run/SrSummary.tsx`**

```tsx
import { PROJECTS, STATUS_LABEL } from "../../data/projects";

// Screen-reader copy of every project, so nothing depends on scroll position.
export default function SrSummary() {
  return (
    <div className="sr-only">
      <h2>Projects</h2>
      <ol>
        {PROJECTS.map((p) => (
          <li key={p.no}>
            <h3>{p.title}</h3>
            <p>{STATUS_LABEL[p.status]}. {p.summary}</p>
            {p.link && <a href={p.link.href}>{p.link.label}</a>}
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 7: Create `app/components/run/RunStage.tsx`**

```tsx
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
```

Note that JumpRail comes **before** ScenePanel in the DOM, so a keyboard user tabs through the rail and then into the open panel. Its `z-10` keeps it painted above the panels, so a focused rail button is always visible. Its ink and paper colours already switch for the orange finish.

- [ ] **Step 8: Render the live run on the page**

In `app/page.tsx`, replace `<StaticRun graph={<StaticGraph />} />` and its two imports with:

```tsx
import RunStage from "./components/run/RunStage";
```

and `<RunStage />` in the JSX.

- [ ] **Step 9: Verify**

Run: `npm test && npm run lint && npm run build`, then `npm run dev` and scroll through http://localhost:3000.
Expected: the sequence matches storyboard frames D1–D9.
- Opening zoomed onto the name, then pull back to the queued graph.
- A bead runs to each node, which opens as a white circle reveal with the pipeline building. Node 02's screenshot slides in.
- The group scene shows 05–07.
- The finish ends as an orange reveal with working LinkedIn and copy-email.
- The rail buttons jump to each scene.

Then set the OS to reduce motion and reload: the static stacked page renders instead.

- [ ] **Step 10: Commit**

```bash
git add app/components/run app/page.tsx
git commit -m "feat: scroll-driven workflow run with scene panels, finish, rail"
```

---

### Task 6: Verify, review and document

**Files:**
- Create: `.impeccable/review/desktop-*.png`, `.impeccable/review/mobile-*.png`, `.impeccable/review/desktop.png`, `.impeccable/review/mobile.png`
- Create (by the documenter subagent): `DESIGN.md`, `.impeccable/design.json`

- [ ] **Step 1: Start the dev server in the background**

Run: `npm run dev` (background). Wait until it prints `Ready`.

- [ ] **Step 2: Capture the storyboard frames with the Playwright MCP browser**

For each viewport (1440×900, then 390×844) and each progress value `0, 0.12, 0.307, 0.234, 0.374, 0.514, 0.654, 0.794, 0.985`:
1. Resize the browser.
2. Navigate to `http://localhost:3000`.
3. Evaluate the snippet below.
4. Take a screenshot to `.impeccable/review/<desktop|mobile>-<p>.png`.

```js
(p) => {
  const el = document.getElementById("run");
  window.scrollTo(0, el.offsetTop + p * (el.offsetHeight - innerHeight));
  return new Promise((r) => setTimeout(r, 300));
}
```

Copy the `0.374` frames to `.impeccable/review/desktop.png` and `mobile.png`. Open every file once and confirm it shows the named scene, with no blank or half-loaded frames.

- [ ] **Step 3: Review Focus checks (in the same browser session)**

At 390×844, for p = `0.234, 0.374, 0.514, 0.654, 0.794, 0.985`, evaluate:

```js
() => {
  const panel = document.querySelector("#run section[aria-labelledby]");
  return {
    sideScroll: document.documentElement.scrollWidth > innerWidth,
    clipped: panel ? panel.scrollHeight > panel.clientHeight + 1 : false,
  };
}
```

Expected: `{ sideScroll: false, clipped: false }` every time. If `clipped` is true, reduce that scene's image `max-h` or the title clamp until it passes.

**Keyboard check:**
1. At 1440×900, press Tab from the top of the page until focus is on "Jump to 03 RAG support assistant", then press Enter.
2. Wait 1.5s, then keep pressing Tab.
3. Expected: focus moves through the remaining rail buttons, then lands on "Read the code on GitHub" in the open RAG panel. It never lands on an element inside a closed panel, and the focus ring is visible at every step.

**Reduced-motion check:**
1. Emulate `prefers-reduced-motion: reduce` and reload.
2. Take a full-page screenshot to `.impeccable/review/reduced-motion.png`.
3. Expected: the static stacked page, with all seven project titles present.

- [ ] **Step 4: Run the Impeccable detector once**

Run: `.claude/skills/impeccable/scripts/impeccable.cmd detect --json app/components/run app/globals.css app/layout.tsx app/page.tsx`
Fix the mechanical findings in one batch, then re-run `npm run lint && npm run build`.

- [ ] **Step 5: Finish review**

Spawn a fresh `impeccable-finish-reviewer` subagent (no forked history) with:
- the original request ("more wow, less AI; scroll = execute")
- the answers confirmed in `PRODUCT.md`
- the artifact path `app/page.tsx`
- the screenshot paths from Step 2 and Step 3
- the direction contract `.impeccable/surfaces/app-page-tsx.md`
- the detector output
- the storyboard artifact https://claude.ai/artifact/7y98CYY4c3rN275zRiaqrL as the critique reference (code-led build, so no approved comp)
- the craft floor `.claude/skills/impeccable/reference/craft-floor.md`

Act on the returned disposition, which will be one of recapture, rebuild, fix or ship, as `.claude/skills/impeccable/reference/new-work.md` §7 describes. Allow at most two fix rounds.

- [ ] **Step 6: Document**

Spawn `impeccable-documenter` with the project root, `app/page.tsx`, the direction contract, `PRODUCT.md`, `.claude/skills/impeccable/reference/document.md`, and the write boundary `DESIGN.md` plus `.impeccable/`. Verify that both `DESIGN.md` and `.impeccable/design.json` exist and contain tokens.

- [ ] **Step 7: Final checks and commit**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

```bash
git add -A DESIGN.md .impeccable app
git commit -m "chore: finish review fixes and DESIGN.md for workflow canvas"
```
