---
name: Erin Nodland — Workflow Canvas
description: A single-page portfolio that is a running workflow; scrolling executes it node by node.
colors:
  ground: "#eeefea"
  paper: "#ffffff"
  ink: "#1e1f24"
  ink-2: "#3d4038"
  muted: "#5e6158"
  line: "#c9cbc2"
  signal: "#d9481f"
  signal-ink: "#b23a12"
  signal-tint: "#fbe3d9"
  ok: "#1f8a4c"
  ok-ink: "#1f6e3f"
  ok-tint: "#ddefe3"
  paused-tint: "#e4e5df"
  wip: "#2f74c0"
  wip-ink: "#1f5fa8"
  wip-tint: "#dce8f7"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(34px, 6.4vw, 96px)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  display-finish:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(40px, 8vw, 96px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline-trigger:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "38px"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(20px, 2vw, 28px)"
    fontWeight: 700
    lineHeight: 1.375
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.25
  title-card:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 900
    letterSpacing: "-0.02em"
  wordmark:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 900
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(15px, 1.35vw, 19px)"
    fontWeight: 400
    lineHeight: 1.625
  meta:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
  step:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.25
  step-compact:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 800
    lineHeight: 1.25
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 800
rounded:
  focus: "4px"
  badge: "9px"
  step: "10px"
  node: "12px"
  trigger: "14px"
  well: "20px"
  frame: "24px"
  full: "9999px"
spacing:
  node-pad: "14px"
  button-x: "24px"
  well-pad: "32px"
  dot-grid: "22px"
  gutter: "clamp(20px, 6vw, 96px)"
  column-gap: "clamp(16px, 4vw, 64px)"
components:
  node-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.node}"
    padding: "0 14px"
    height: "76px"
    width: "340px"
  node-card-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.node}"
  trigger-node:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.headline-trigger}"
    rounded: "{rounded.trigger}"
    padding: "18px 20px"
    width: "280px"
    height: "120px"
  output-node:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.node}"
    padding: "14px 18px"
    width: "240px"
    height: "76px"
  output-node-lit:
    backgroundColor: "{colors.signal-ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.node}"
  pipeline-step:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.step}"
    rounded: "{rounded.step}"
    padding: "10px 12px"
  pipeline-step-final:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.step}"
    rounded: "{rounded.step}"
    padding: "10px 12px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.step}"
    padding: "0 20px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-finish-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.node}"
    padding: "0 24px"
    height: "56px"
  button-finish-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.signal-ink}"
  button-finish-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.node}"
    padding: "0 24px"
    height: "56px"
  button-finish-secondary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  canvas-well:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.well}"
    padding: "{spacing.well-pad}"
  group-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title-card}"
    rounded: "{rounded.node}"
    padding: "16px"
  finish-field:
    backgroundColor: "{colors.signal-ink}"
    textColor: "{colors.paper}"
    typography: "{typography.display-finish}"
---

# Design System: Erin Nodland — Workflow Canvas

## Overview

**Creative North Star: "The Running Workflow"**

The site is a node graph that executes. A dark trigger node carrying Erin's name feeds six white project nodes over bezier wires into a Contact output node, all laid on a pale dotted canvas. Scrolling is execution: a camera travels the graph, an orange bead runs each wire, a node spins, and the node opens (a circular clip-path reveal) into a full-screen white panel that builds its own pipeline. The run ends when the Contact node opens into a full-bleed burnt-orange field.

Density is low and the voice is heavy: one grotesque at weight 900 with tight negative tracking for headings, calm 400 body in ink-2, and 2px ink borders on everything that sits on the canvas. Colour is almost entirely neutral. Orange means "live now", and three separate tones (green, blue and grey) report the honest status of each project, so a status can never be mistaken for the live signal. The world is its own: its palette, type and marks are not n8n's, even though one screenshot shows an n8n canvas.

Motion is scrubbed from scroll progress with a cubic ease-out, and only transform, opacity and clip-path animate. Under reduced motion, or without JS, the same content renders as a static stacked run with the graph settled at its finished state and every panel open in normal flow.

**Key Characteristics:**
- Dotted canvas ground (22px dot grid) as the world; white paper for opened nodes.
- 2px borders on every canvas object: ink at rest, signal when active, dashed line when queued.
- Hanken Grotesk only, weight-driven hierarchy (400 / 700 / 800 / 900).
- Signal orange reserved for what is live; status uses its own tones, each paired with a mark shape.
- Circle clip-path reveals open and close nodes; a camera, not page sections, moves the eye.

## Colors

Warm-grey neutrals with a single burnt-orange signal and three status tones, each a trio of base, ink (small text) and tint (fills).

### Primary
- **Signal Orange** (signal): the live current. It appears on the travelling bead, the trigger's pulsing output port, the executing spinner, the active node's border, the unlit Contact node's border, focus rings and text selection. Where paper text must sit on the live colour (the lit Contact node, the finish field) the fill deepens to signal-ink. It is used for fills and marks, never for small text.
- **Deep Signal** (signal-ink): the small-text and field version of the signal. It covers the "Scroll to run the workflow" cue, the full-bleed finish field (paper text on it) and the Contact frame label.
- **Signal Wash** (signal-tint): the track of the executing spinner.

### Secondary
- **Shipped Green** (ok / ok-ink / ok-tint): shipped, live and running work. The base colour fills the check disc and the running pulse dot, the ink colour sets the status label text, and the tint sits behind the node-number badge.
- **In-Progress Blue** (wip / wip-ink / wip-tint): work in progress. The base colour draws the half-filled circle mark, the ink colour sets the label, and the tint sits behind the badge.

### Neutral
- **Canvas Ground** (ground): the page, the dotted canvas and the canvas well inside panels. It is also the scrollbar track.
- **Paper** (paper): node cards, opened panels, pipeline steps and text on dark or orange fields.
- **Graph Ink** (ink): primary text, 2px borders, drawn wires, the trigger node, the final pipeline step, the finish primary button and the scrollbar thumb.
- **Soft Ink** (ink-2): body and summary copy.
- **Muted Olive-Grey** (muted): stack lines ("via"), "Queued", the paused tone and separators.
- **Wire Grey** (line): undrawn wires, canvas dots and queued dashed borders.
- **Paused Grey** (paused-tint): the badge fill for paused work.

### Named Rules
**The Signal Is Current Rule.** Orange marks only what is executing or actionable right now. That means the bead, the port, the spinner, the active border, the lit output and the finish. A project's status is never orange. In-progress work is blue precisely so orange stays free.

**The Small Orange Goes Deep Rule.** Signal (#d9481f) is for fills, marks and large type only. Any orange text under 24px uses signal-ink.

**The Tone Trio Rule.** Every status tone ships as base (the mark), ink (the label text) and tint (the badge fill). Never set a label in the base colour.

## Typography

**Display Font:** Hanken Grotesk (with system-ui, sans-serif), loaded via next/font as `--font-hanken`
**Body Font:** Hanken Grotesk
**Label/Mono Font:** none; there is no second face

**Character:** A single grotesque does everything. Hierarchy comes from weight and tracking, not from pairing: black (900) and tightly tracked for anything that names a node, extra-bold (800) for UI labels, regular (400) for reading.

### Hierarchy
- **Display** (900, clamp(34px, 6.4vw, 96px), 0.92, -0.04em, text-balance): the opened node's title. The static-run h1 uses clamp(56px, 9vw, 96px) at 0.9.
- **Display Finish** (900, clamp(40px, 8vw, 96px), 0.9, max 12ch; 40px on phones so it sets in at most four lines inside the frame): the Contact question on the orange field.
- **Headline Trigger** (900, 38px, 0.95, -0.03em): "Erin Nodland" inside the trigger node. The camera's opening zoom (about 2.7x) is what makes it read as the hero.
- **Lead** (700, clamp(20px, 2vw, 28px), 1.375, max 30 to 34ch): the one-line pitch.
- **Title** (800, 17px): node-card titles. **Title Card** (900, 18px to 22px, -0.02em) is used for group-scene cards.
- **Body** (400, clamp(15px, 1.35vw, 19px), 1.625, max 48ch, ink-2): node summaries.
- **Meta** (700, 15px to 16px): the node meta line (state mark, state and stack).
- **Step** (800, 13px on phones, 15px in a row, 19px as a chain card): pipeline step labels.
- **Label** (800, 12px to 14px): the status line, "Queued" and the status word on node cards. Node-type labels ("Trigger", "Output") are 12px at 700.
- **Wordmark** (900, 15px to 17px, -0.01em): "erin-nodland.workflow" in the status line.

### Named Rules
**The One Face Rule.** Hanken Grotesk is the only typeface. Never add a serif, a mono or a second display face. Reach for weight instead.

**The Heavy and Tight Rule.** Headings that name something are set at 900 with -0.02em to -0.04em tracking and line-height of 0.95 or less. Body copy never goes above 400.

## Layout

The live run is a tall section (1100svh) holding a sticky full-viewport stage. Content sits in a fixed 1300×860 world-unit graph that a camera transforms (translate plus scale), and the dot grid follows the camera's pan and zoom but never packs tighter than 22px. Chrome is pinned. The status line runs across the top with a clamp(16px, 3vw, 40px) inset, and the jump rail runs down the right edge (44px hit targets). On phones (under 640px) the camera frames only the area left of a 64px rail column.

Opened node panels use an auto-fit two-column grid (columns at least min(100%, 440px), gap clamp(16px, 4vw, 64px)), with gutters of clamp(20px, 6vw, 96px) and vertical padding of clamp(28px, 7vh, 80px), centred with `content-center-safe`. Copy goes on the left. The right column is the visual: from 640px up it sits in a canvas well. Below 640px, columns stack and the node meta line splits state and stack onto two lines.

The static run (reduced motion or no JS) is a dotted header with the settled graph scaled into an SVG viewBox. Every scene follows as a paper section with a 2px ink top rule, then the finish field.

## Elevation & Depth

Depth is the canvas and what floats on it. The ground is flat and dotted. Objects placed on the canvas (nodes, chain steps, screenshots) cast soft, downward shadows with negative spread, so they read as cards resting on a board. Opened panels are flat paper filling the viewport. Their depth comes from the circular reveal, not from a shadow.

### Shadow Vocabulary
- **Node rest** (`box-shadow: 0 10px 24px -16px rgba(30,31,36,0.45)`): node cards and pipeline chain cards.
- **Trigger lift** (`box-shadow: 0 18px 40px -18px rgba(30,31,36,0.55)`): the dark trigger node only.
- **Screenshot drop** (`box-shadow: 0 30px 60px -30px rgba(30,31,36,0.5)`): project screenshots in a canvas well.
- **Bead glow** (`box-shadow: 0 4px 10px -2px rgba(217,72,31,0.6)`): the travelling orange bead.
- **Running pulse** (animated `0 0 0 0 → 0 0 0 6px rgba(31,138,76,0)`): the "Running" status dot.

### Named Rules
**The Resting Card Rule.** Shadows are soft, ink-tinted, offset downward and pulled in with negative spread. Never use hard offset shadows, and never put a shadow on a full-bleed panel.

## Shapes

Softly rounded rectangles with firm 2px borders. Radii step up with the size of the object: 9px for the number badge, 10px for pipeline steps and in-panel link buttons, 12px for node cards, group cards, screenshots and finish buttons, 14px for the trigger, 20px for the canvas well and 24px for the Contact output frame. Ports, beads, the spinner and rail pips are full circles. Wires are cubic beziers stroked at 3px. In panels, pipeline connectors are 3px straight ink bars that grow (scaleX in a row, scaleY in a column). Borders are dashed only for the queued state.

## Components

### Buttons
Heavy, bordered and blunt. Every action is at least 48px tall, and the finish actions are 56px.
- **Shape:** 10px corners in panels, 12px on the finish field.
- **Outline (panel):** a 2px ink border, ink 800 text, transparent fill and 20px horizontal padding. On hover it fills with ink and the text turns paper. It is used for "Read the code on GitHub".
- **Finish primary:** an ink fill with paper 17px/800 text. On hover it turns paper with signal-ink text ("Message on LinkedIn").
- **Finish secondary:** a 2px paper border with paper text. On hover it turns paper with ink text ("Copy email address"). The label changes to "Email copied" for 1.8s.
- **Focus:** a 3px signal outline with a 3px offset and 4px radius everywhere. Inside the finish field (`.on-dark`) the outline turns paper.

### Chips (pipeline steps)
- **Style:** paper fill, a 2px ink border, 10px corners and 800 weight. The final step is inverted (ink fill, paper text) because it is the output. Steps are joined by 3px ink connectors that draw in step by step.
- **Chain variant:** when a project has no screenshot, from 640px up the steps become full node cards. These are at least 64px tall with 12px corners, the node-rest shadow, a numbered 32px badge (ground fill, or paper at 15% on the final step) and 19px text, stacked with 24px vertical wires.

### Cards / Containers
- **Node card:** 340×76 on paper with a 2px border and 12px corners, holding a 40px number badge in the status tint, a 17px/800 title, a 12px muted stack line and a state mark on the right. The border is ink when done, signal when active, and a dashed line on a ground-coloured fill when queued (always full opacity, so the 12px labels keep AA contrast). Border and fill colour transition over 300ms.
- **Trigger node:** a 280×120 ink block with 14px corners and the trigger-lift shadow. It carries a signal output port with an expanding ring pulse.
- **Output node:** a 240×76 paper block with a 2px signal border. It fills with signal (paper text) once every wire has drawn in.
- **Group card:** paper with a 2px ink border, 12px corners and 12px to 16px padding. It holds a title, a status row and a one-line summary, laid out in an auto-fit grid (min 200px).
- **Canvas well:** from 640px up, the visual column of an opened panel sits on ground with the 22px dot grid, 20px corners and 32px padding, so an opened node still reads as the canvas.

### Status Mark
Status is never shown by colour alone. Each tone has a shape: a filled green check disc for shipped and live, a pulsing green dot for running, a blue half-filled circle for in progress, and a muted pause ring for paused. The mark always sits next to its label, set in the tone's ink colour.

### Navigation
- **Status line:** a top bar with no background. It holds the wordmark on the left and a live execution state on the right ("Trigger fired · 6 nodes queued", "Executing node 02", "Workflow finished"), announced politely to screen readers. Text is ink, and turns paper over the finish field.
- **Jump rail:** a vertical column of 44px buttons on the right, each holding a 10px ring pip. Visited pips are filled, and the current pip stretches to a 26px pill (width transitions over 300ms). Pips are ink on the canvas and paper on the finish field.

### Contact Output (signature)
The finish is the Contact node opened. The field is signal-ink, filled by a circular clip-path reveal. From 640px up, six paper wires at 50% opacity converge on a paper input port, and a 24px-radius paper frame at 50% opacity carries the node-type label "Output · Get in touch", set on the frame border. The display question and the two finish buttons sit inside the frame.

## Do's and Don'ts

### Do:
- **Do** put every object on the canvas in a 2px border: ink at rest, signal when active, dashed line (#c9cbc2) when queued.
- **Do** pair every status with its mark shape and set its label in the tone's ink colour (ok-ink, wip-ink, muted).
- **Do** set anything that names a node at 900 weight with negative tracking (-0.02em to -0.04em) and line-height of 0.95 or less.
- **Do** place an opened node's visual column on a canvas well (ground plus 22px dots, 20px corners, 32px padding) from 640px up.
- **Do** animate only transform, opacity and clip-path. Open and close nodes with a circular reveal, and ease with a cubic ease-out.
- **Do** provide the static stacked run for `prefers-reduced-motion` and no-JS, and stop every looping animation (port ring, spinner, nudge, running pulse).
- **Do** switch focus rings to paper on the orange finish field.

### Don't:
- **Don't** use signal orange for a project status, a decorative accent, or small text. Small orange text is signal-ink.
- **Don't** add a second typeface. Hanken Grotesk carries every role.
- **Don't** put kickers or eyebrows above headings. Node-type labels ("Trigger", "Output") are native to the graph and belong only on graph nodes and the Contact frame.
- **Don't** use hard offset shadows or shadows on full-bleed panels.
- **Don't** borrow n8n's palette, marks or node styling. The world must not read as a clone of that product.
- **Don't** let a status read by colour alone.
