// The live Shopify n8n workflow, all four sections, redrawn as vector from Erin's screenshot. The screenshot is
// deliberately not shipped (it shows the server IP and the client's store). Labels, layout and wiring are copied
// from it, not invented. Two sub-labels
// are deliberately left out: the Remove Background server's IP and the HTTP Request's store domain (it names the
// client). Model nodes keep their own labels and no provider mark, matching the site's provider-neutral wording.

export type N8nNodeKind = "drive" | "edit" | "split" | "loop" | "image" | "http" | "merge" | "sheet" | "code" | "model";

export interface N8nNode {
  id: string;
  label: string;
  sub?: string;
  kind: N8nNodeKind;
  /** Top-left corner and size in the section's viewBox. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface N8nEdge {
  from: string;
  to: string;
  /** The loop's return wire (drawn back underneath, right to left). */
  back?: boolean;
}

export interface N8nSection {
  id: string;
  tab: string;
  title: string;
  subtitle: string;
  nodes: N8nNode[];
  edges: N8nEdge[];
}

const n = (id: string, label: string, kind: N8nNodeKind, x: number, y: number, sub?: string, w = 52, h = 52): N8nNode =>
  ({ id, label, kind, x, y, w, h, ...(sub ? { sub } : {}) });
const e = (from: string, to: string, back?: boolean): N8nEdge => ({ from, to, ...(back ? { back } : {}) });

export const N8N_WORKFLOW: { width: number; height: number; sections: N8nSection[] } = {
  width: 640,
  height: 350,
  sections: [
    {
      id: "intake",
      tab: "01 Intake",
      title: "01 - Image Intake & Trigger",
      subtitle: "Detects new product images in the incoming Google Drive folder and prepares each one for processing.",
      nodes: [
        n("trigger", "New Image Detected", "drive", 40, 150, "fileCreated"),
        n("setId", "Set incoming ID", "edit", 190, 150, "manual"),
        n("find", "Find Incoming Images", "drive", 340, 150, "search: fileFolder"),
        n("splitImages", "Process Each Image", "split", 490, 150),
      ],
      edges: [e("trigger", "setId"), e("setId", "find"), e("find", "splitImages")],
    },
    {
      id: "processing",
      tab: "02 Processing",
      title: "02 - Image Processing & Preparation",
      subtitle: "Removes backgrounds, resizes and centres each image, and uploads a clean version ready for analysis.",
      nodes: [
        n("editFields", "Edit Fields", "edit", 16, 162, "manual"),
        n("loop", "Loop Over Items", "loop", 120, 162),
        n("moveFile", "Move file", "drive", 232, 64, "move: file"),
        n("editFields3", "Edit Fields3", "edit", 352, 64, "manual"),
        n("editInfo", "Edit Image - Info", "image", 232, 162, "Get Information"),
        n("removeBg", "Remove Background", "http", 232, 252),
        n("uploadFile", "Upload file", "drive", 352, 162, "upload: file"),
        n("editFields1", "Edit Fields1", "edit", 472, 162, "manual"),
        n("aiAnalysis", "AI Image Analysis", "model", 352, 252, "Analyze Image"),
        n("merge", "Merge", "merge", 576, 232, "combine"),
      ],
      edges: [
        e("editFields", "loop"), e("loop", "moveFile"), e("loop", "editInfo"), e("loop", "removeBg"), e("removeBg", "loop", true),
        e("moveFile", "editFields3"), e("editInfo", "uploadFile"), e("uploadFile", "editFields1"), e("editInfo", "aiAnalysis"),
        e("editFields1", "merge"), e("aiAnalysis", "merge"),
      ],
    },
    {
      id: "ai",
      tab: "03 AI",
      title: "03 - AI Image Analysis & Product Creation",
      subtitle: "Uses AI to analyse images, group related photos into products, and generate structured titles and descriptions.",
      nodes: [
        n("merge", "Merge", "merge", 24, 110, "combine"),
        n("sheet", "Log to Google Sheet", "sheet", 140, 80, "append: sheet"),
        n("code", "Code in JavaScript", "code", 140, 190),
        n("group", "Group Product Images", "code", 262, 190),
        n("model", "Message a model", "model", 380, 250, "Response Text", 140),
        n("merge2", "Merge2", "merge", 560, 190, "combine"),
      ],
      edges: [e("merge", "sheet"), e("merge", "code"), e("code", "group"), e("group", "merge2"), e("group", "model"), e("model", "merge2")],
    },
    {
      id: "publishing",
      tab: "04 Publishing",
      title: "04 - Publishing & Logging",
      subtitle: "Creates the product in Shopify, logs every result for tracking, and archives the processed images.",
      nodes: [
        n("format", "Format Product Data", "code", 16, 170),
        n("http", "HTTP Request", "http", 136, 80),
        n("editFields2", "Edit Fields2", "edit", 264, 80, "manual"),
        n("merge3", "Merge3", "merge", 380, 170, "combine"),
        n("splitOut", "Split Out1", "split", 474, 170),
        n("archive", "Archive Processed Files", "drive", 566, 170, "move: file"),
      ],
      edges: [e("format", "http"), e("http", "editFields2"), e("editFields2", "merge3"), e("format", "merge3"), e("merge3", "splitOut"), e("splitOut", "archive")],
    },
  ],
};
