import { test } from "node:test";
import assert from "node:assert/strict";
import { N8N_WORKFLOW } from "./n8nWorkflow.ts";
import { PROJECTS } from "./projects.ts";

test("all four sections of the live workflow, with their own titles", () => {
  assert.deepEqual(N8N_WORKFLOW.sections.map((s) => s.title), [
    "01 - Image Intake & Trigger",
    "02 - Image Processing & Preparation",
    "03 - AI Image Analysis & Product Creation",
    "04 - Publishing & Logging",
  ]);
});

test("every node label from the screenshot, section by section", () => {
  assert.deepEqual(
    N8N_WORKFLOW.sections.map((s) => s.nodes.map((n) => n.label)),
    [
      ["New Image Detected", "Set incoming ID", "Find Incoming Images", "Process Each Image"],
      ["Edit Fields", "Loop Over Items", "Move file", "Edit Fields3", "Edit Image - Info", "Remove Background", "Upload file", "Edit Fields1", "AI Image Analysis", "Merge"],
      ["Merge", "Log to Google Sheet", "Code in JavaScript", "Group Product Images", "Message a model", "Merge2"],
      ["Format Product Data", "HTTP Request", "Edit Fields2", "Merge3", "Split Out1", "Archive Processed Files"],
    ],
  );
});

test("25 distinct nodes (Merge sits on the 02/03 boundary and is drawn in both)", () => {
  const ids = new Set(N8N_WORKFLOW.sections.flatMap((s) => s.nodes.map((n) => n.id)));
  assert.equal(ids.size, 25);
});

test("wiring references real nodes in its own section, and matches the screenshot", () => {
  for (const s of N8N_WORKFLOW.sections) {
    const ids = new Set(s.nodes.map((n) => n.id));
    for (const e of s.edges) assert.ok(ids.has(e.from) && ids.has(e.to), `${s.title}: ${e.from} → ${e.to}`);
  }
  const pairs = N8N_WORKFLOW.sections.map((s) => s.edges.map((e) => `${e.from}>${e.to}${e.back ? " (loop)" : ""}`));
  assert.deepEqual(pairs[0], ["trigger>setId", "setId>find", "find>splitImages"]);
  assert.deepEqual(pairs[1], [
    "editFields>loop", "loop>moveFile", "loop>editInfo", "loop>removeBg", "removeBg>loop (loop)",
    "moveFile>editFields3", "editInfo>uploadFile", "uploadFile>editFields1", "editInfo>aiAnalysis",
    "editFields1>merge", "aiAnalysis>merge",
  ]);
  assert.deepEqual(pairs[2], ["merge>sheet", "merge>code", "code>group", "group>merge2", "group>model", "model>merge2"]);
  assert.deepEqual(pairs[3], ["format>http", "http>editFields2", "editFields2>merge3", "format>merge3", "merge3>splitOut", "splitOut>archive"]);
});

test("nothing from the screenshot that identifies the client or its servers", () => {
  const text = JSON.stringify(N8N_WORKFLOW);
  assert.doesNotMatch(text, /https?:|\d+\.\d+\.\d+\.\d+|pretty|pink/i);
});

test("Shopify shows the full redrawn workflow, and its summary counts the real nodes", () => {
  const shopify = PROJECTS.find((p) => p.title === "Shopify product automation")!;
  assert.equal(shopify.figure, "n8n-workflow");
  assert.equal(shopify.image, undefined);
  assert.match(shopify.summary, /25-node n8n workflow/);
});

test("the original n8n screenshot is never shipped (it shows the server IP and the client's store)", async () => {
  const { readdirSync } = await import("node:fs");
  const shipped = readdirSync(new URL("../../public/", import.meta.url));
  assert.ok(!shipped.some((f) => /n8n/i.test(f)), `public/ ships: ${shipped.join(", ")}`);
});
