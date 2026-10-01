import { test } from "node:test";
import assert from "node:assert/strict";
import { N8N_SECTION_03 } from "./n8nSection03.ts";
import { PROJECTS } from "./projects.ts";

test("the redrawn n8n section carries the live workflow's own title and node labels", () => {
  assert.equal(N8N_SECTION_03.title, "03 - AI Image Analysis & Product Creation");
  assert.deepEqual(
    N8N_SECTION_03.nodes.map((n) => [n.label, n.sub]),
    [
      ["Merge", "combine"],
      ["Log to Google Sheet", "append: sheet"],
      ["Code in JavaScript", undefined],
      ["Group Product Images", undefined],
      ["Message a model", "Response Text"],
      ["Merge2", "combine"],
    ],
  );
});

test("the redrawn wiring matches the screenshot", () => {
  const ids = new Set(N8N_SECTION_03.nodes.map((n) => n.id));
  for (const [from, to] of N8N_SECTION_03.edges) assert.ok(ids.has(from) && ids.has(to), `${from} → ${to}`);
  assert.deepEqual(N8N_SECTION_03.edges, [
    ["merge", "sheet"],
    ["merge", "code"],
    ["code", "group"],
    ["group", "merge2"],
    ["group", "model"],
    ["model", "merge2"],
  ]);
});

test("Shopify shows the redrawn section instead of the low-resolution screenshot", () => {
  const shopify = PROJECTS.find((p) => p.title === "Shopify product automation")!;
  assert.equal(shopify.figure, "n8n-section-03");
  assert.equal(shopify.image, undefined);
});
