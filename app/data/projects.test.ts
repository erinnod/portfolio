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
