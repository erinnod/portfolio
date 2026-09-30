# Portfolio redesign: Workflow Canvas, scroll = execute

**Date:** 2026-09-30 · **Status:** approved by Erin ("build it")
**Direction contract:** `.impeccable/surfaces/app-page-tsx.md` (seed 6b4bd8ed) · **Product truth:** `PRODUCT.md`
**Approved mockup and storyboard:** https://claude.ai/artifact/7y98CYY4c3rN275zRiaqrL (live prototype plus frames D1–D9 and P1–P4)

## Goal

Replace the editorial site with a single page where **scrolling runs a workflow**. A camera travels a graph of Erin's projects, zooms into each node, and opens it into a full-screen panel that builds its own pipeline. The run ends on a full-bleed Contact scene. A hiring manager should see within 30 seconds that Erin ships real AI systems, and be able to jump straight to any project or to contact. Project statuses are accurate as of 2026-09-30.

## The scroll, scene by scene

The page is a tall `#run` section (≈1100vh on desktop) with a sticky full-viewport stage, driven by progress `p` from 0 to 1.

| p | Scene | What happens |
|---|---|---|
| 0–0.08 | Opening (D1) | The camera is zoomed about 2.7× onto the dark trigger node, so "Erin Nodland" fills the screen. The output port pulses, with the pitch line and "Scroll to run the workflow" underneath. |
| 0.08–0.15 | Pull back (D2) | The camera flies out to the whole graph: trigger → 7 project nodes → Contact output. Every node shows "Queued" (dashed). |
| 0.15–0.85 | Five node scenes, 0.14 each | See the node-scene row below. There are four solo scenes (01 Figma agent, 02 Shopify, 03 RAG, 04 multi-agent) and one group scene for nodes 05–07. |
| 0.85–1 | Finish (D9) | Every wire draws into Contact. The camera dives into it, and an orange circle reveal fills the screen: "Got a process that should run itself?", with LinkedIn and copy-email. |

**Inside each node scene** (local progress t from 0 to 1):
- **t 0–0.2:** an orange bead travels the wire, the wire draws in ink, the node spins, and the camera zooms to about 3.2×.
- **t 0.2–0.34:** a white panel opens as a circle reveal from the node.
- **t 0.28–0.7:** the status and title (≤96px) come in, then the summary. The pipeline steps appear one by one with their connectors growing. The screenshot slides in with a 2.5° tilt that settles.
- **t 0.84–1:** the panel closes back into the node, which now shows its real status, and the camera returns to the overview.

**Persistent chrome:**
- **Status line (top):** shows the workflow name and "Waiting for trigger", then "Executing node 02", then "Workflow finished".
- **Jump rail (right):** 7 real buttons (Start, 01–04, 05–07, Contact) that smooth-scroll to each scene.
- **Footer:** sits after the section.

## Content changes (the "outdated" fixes)

| Project | Old status | New status |
|---|---|---|
| RAG support assistant | Planned | Shipped, with GitHub link |
| Multi-agent outreach | Planned | Shipped, with GitHub link |
| Migration agent | Building | In progress |
| Morning brief | Shipped | Paused |
| Life-OS | Shipped | Running |

All copy is taken from `PRODUCT.md`. There are no invented metrics, clients or testimonials.

## Architecture

The site stays a Next.js 16 App Router page. Before touching any routing, font, image or metadata API, read the matching guide in `node_modules/next/dist/docs/`.

- `app/data/projects.ts`: a single `PROJECTS` array. `status` is `"shipped" | "live" | "running" | "in-progress" | "paused"`. Each project has `via`, `summary`, `steps`, optional `link` and optional `image` (src/alt/width/height).
- `app/lib/timeline.ts`: **pure** functions, with no React or DOM.
  - `sceneAt(p)` returns `{ phase, sceneIndex, t }`.
  - `camera(p, viewport)` returns `{ x, y, scale }`.
  - `nodeState(i, p)` returns `queued | executing | done`.
  - `wireProgress(i, p)`, `panelOpen(p)`, `finishOpen(p)`, and `bezierPoint(...)`.
  - The timeline constants (`INTRO`, `OVER`, `SCN`, `CONTACT_START`) live here.
- `app/components/run/`:
  - `RunStage.tsx` (client): owns the scroll listener. A single rAF-throttled handler writes `p` as a CSS custom property plus React state for the discrete bits, and it holds the sticky stage.
  - `Graph.tsx`: the world layer (1300×860 world units) with trigger, nodes, contact, SVG wires and the bead, transformed by `camera()`.
  - `NodeCard.tsx`: a node rendered from `nodeState`.
  - `ScenePanel.tsx`: the circle-reveal detail panel. It has solo and group variants and uses `next/image` for screenshots.
  - `FinishScene.tsx`: the Contact reveal. It reuses `CopyEmailLink`.
  - `StatusLine.tsx` and `JumpRail.tsx`.
- `app/page.tsx` renders `<RunStage />` and the footer. `layout.tsx` swaps the fonts for Hanken Grotesk via `next/font` and updates the metadata copy.
- **Removed:** `Hero`, `About`, `Projects`, `FadeIn`, `Nav`, `Lightbox`, and the `AccentBreak` block. `CopyEmailLink` is kept and restyled.
- **Tokens:** CSS variables in `globals.css`: `--ground #EEEFEA`, `--ink #1E1F24`, `--ink-2 #3D4038`, `--muted #5E6158`, `--line #C9CBC2`, `--signal #D9481F`, `--signal-ink #B23A12`, `--ok #1F8A4C` / `--ok-ink #1F6E3F`. Selection, focus ring and scrollbar are themed from these.

## Accessibility and fallbacks (non-negotiable)

- **No JS, or `prefers-reduced-motion: reduce`:** RunStage renders a **static stacked version**. That's the graph at overview with every node at its final status, then each ScenePanel fully open in normal flow, then the Finish scene. Everything is readable top to bottom, and nothing is hidden behind scroll position.
- **Screen readers:** each scene panel is a real `<section>` with an `h2`, and the stage visuals are `aria-hidden` wherever they duplicate text. The jump rail buttons have labels.
- **Contrast:** body text ≥4.5:1. `--signal` is used for fills and large text only; small orange text uses `--signal-ink`.
- **Keyboard:** the rail buttons, GitHub links, LinkedIn and copy-email are all focusable with a themed focus ring. Keyboard users reach any scene through the jump rail, which comes before the panels in tab order. A panel's controls are `inert` while it is less than 60% open, so Tab never lands on something invisible.
- **Screen readers in live mode:** a visually hidden list repeats every project's title, status, summary and link, so nothing depends on scroll position.

## Performance

- Only `transform`, `opacity` and `clip-path` animate. No layout reads inside the rAF except the one `getBoundingClientRect` on `#run`.
- Screenshots are lazy-loaded via `next/image` with `sizes`.
- Target 60fps at 1440×900 on a mid-range laptop. If a frame drops, simplify the clip-path first.

## Dependencies

- **Minor bumps:** next 16.3.8, react and react-dom 19.3.0, tailwindcss and @tailwindcss/postcss 4.3.3, eslint-config-next 16.3.8, @types/react and @types/react-dom.
- **framer-motion:** removed. The scroll timeline is hand-rolled, and nothing else needs it.
- **Deferred:** ESLint 10, TypeScript 7 and @types/node 26.

## Verification

- **Unit tests:** `app/lib/timeline.ts` gets tests with Node's built-in test runner (`node --test`, TypeScript run via `tsx`). They cover scene boundaries, camera at key progress values, node states, and that `wireProgress` is monotonic.
- **Build checks:** `npm run lint` and `npm run build` pass.
- **Screenshots:** Playwright captures at 1440×900 and 390×844 for the D1–D9 progress values, plus full-page reduced-motion captures, into `.impeccable/review/`. They're compared against the storyboard.
- **Detector:** `impeccable detect --json` runs once on the changed files.
- **Finish review:** the `impeccable-finish-reviewer` subagent, then `impeccable-documenter` writes DESIGN.md and `.impeccable/design.json`.

## Out of scope

Per-project case study pages, custom domain, analytics, CV download, and blog.
