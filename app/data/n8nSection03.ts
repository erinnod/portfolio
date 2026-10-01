// Section 03 of the live Shopify n8n workflow, redrawn as vector from Erin's screenshot
// (public/project-n8n-workflow.png). The source raster is too small to stay legible on screen; the labels,
// node layout and wiring here are copied from it, not invented. The model node keeps its own label and no
// provider mark, matching the site's provider-neutral wording.

export type N8nNodeKind = "merge" | "sheet" | "code" | "model";

export interface N8nNode {
  id: string;
  label: string;
  sub?: string;
  kind: N8nNodeKind;
  /** Top-left corner and size in the diagram's 560×300 viewBox. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export const N8N_SECTION_03 = {
  title: "03 - AI Image Analysis & Product Creation",
  subtitle: "Uses AI to analyse images, group related photos into products, and generate structured titles and descriptions.",
  width: 560,
  height: 300,
  nodes: [
    { id: "merge", label: "Merge", sub: "combine", kind: "merge", x: 22, y: 84, w: 52, h: 52 },
    { id: "sheet", label: "Log to Google Sheet", sub: "append: sheet", kind: "sheet", x: 128, y: 64, w: 52, h: 52 },
    { id: "code", label: "Code in JavaScript", kind: "code", x: 128, y: 164, w: 52, h: 52 },
    { id: "group", label: "Group Product Images", kind: "code", x: 244, y: 164, w: 52, h: 52 },
    { id: "model", label: "Message a model", sub: "Response Text", kind: "model", x: 362, y: 228, w: 140, h: 52 },
    { id: "merge2", label: "Merge2", sub: "combine", kind: "merge", x: 506, y: 164, w: 52, h: 52 },
  ] satisfies N8nNode[],
  edges: [
    ["merge", "sheet"],
    ["merge", "code"],
    ["code", "group"],
    ["group", "merge2"],
    ["group", "model"],
    ["model", "merge2"],
  ] as [string, string][],
};
