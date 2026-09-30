---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

## Scope

Home page (`app/page.tsx`), the whole single-page portfolio. Visitor mode: **Experience** (the work leads).

## Audience and job

Hiring managers for AI Automation Specialist / AI engineer roles, arriving from a CV or LinkedIn and skimming for under a minute. Action: inspect a project, then contact Erin (LinkedIn or copy email). Proof: the seven real projects and their honest statuses in PRODUCT.md, the three screenshots in `public/`, and the two public GitHub repos.

## Direction contract

THESIS: The portfolio is a running workflow. A trigger ("a real business problem") feeds seven project nodes, and the visitor can execute it. It refuses the category default of a name hero plus a grid of project cards.

OWN-WORLD: A dotted canvas ground (#EEEFEA), white node cards with 2px borders and 10px corners, ink #1E1F24, one signal orange #D9481F reserved for live wires and the primary action, and status green #1F8A4C for shipped. Hanken Grotesk is the only face. Bezier wires carry travelling dashes, and a white Output inspector docks on the right.

STORY: The visitor understands that Erin builds production AI workflows and believes they have shipped (green checks, a live wire into the Shopify node). They inspect nodes, then reach the final Contact node.

FIRST VIEWPORT: A toolbar holds the workflow name, "Active", nav, and the primary **Execute workflow** button on the right. The left two-thirds shows the name at about 88px, a one-line pitch, then the canvas: the trigger node on the left and seven project nodes on the right, joined by wires. The right third is the inspector, open on node 02 with its screenshot.

FORM: Workflow Canvas, position 1 of my grounded list (chosen as Impeccable's pick), seed key 6b4bd8ed.

SIGNATURE INTERACTION: Execute workflow runs the graph node by node, one orchestrated timeline. Each node spins, then settles to its true status, and the run ends on a Contact output node that opens LinkedIn and copy-email. Under reduced motion it settles instantly.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints

- Build path is code-led (no image generation available).
- Must not read as a clone of n8n's product UI: own palette, own type, no n8n marks.
- Phone: the canvas becomes a vertical flow and the inspector becomes an expanding panel under the tapped node.

## Unresolved

- Whether each node also gets a deep link (`#node-02`). Proposed: yes.
