import { test } from "node:test";
import assert from "node:assert/strict";
import { GROUP_INTRO, PROJECTS, STATUS_TONE } from "./projects.ts";
import { SCENES } from "../lib/timeline.ts";

test("seven projects numbered 01–07", () => {
  assert.deepEqual(PROJECTS.map((p) => p.no), ["01", "02", "03", "04", "05", "06", "07"]);
});

test("every project appears in exactly one scene", () => {
  assert.deepEqual([...SCENES.flat()].sort(), [0, 1, 2, 3, 4, 5, 6]);
});

test("statuses match PRODUCT.md as of 2026-10-01", () => {
  const byTitle = Object.fromEntries(PROJECTS.map((p) => [p.title, p.status]));
  assert.equal(byTitle["Figma → spec agent"], "shipped");
  assert.equal(byTitle["Shopify product automation"], "live");
  assert.equal(byTitle["RAG support assistant"], "shipped");
  assert.equal(byTitle["Multi-agent outreach"], "shipped");
  assert.equal(byTitle["Life-OS"], "running");
  assert.equal(byTitle["ASP.NET → Hono migration"], "shipped");
  assert.equal(byTitle["Morning brief"], "paused");
});

test("the two public repos are linked", () => {
  const links = PROJECTS.flatMap((p) => (p.link ? [p.link.href] : []));
  assert.deepEqual(links, [
    "https://github.com/erinnod/rag-assistant",
    "https://github.com/erinnod/multi-agent-outreach",
  ]);
});

test("no project status spends the signal orange (reserved for live wires and the primary action)", () => {
  for (const [status, tone] of Object.entries(STATUS_TONE)) assert.notEqual(tone, "signal", status);
});

test("migration project reflects Erin's write-up: strangler-fig ASP.NET → Hono on Workers, real scale, no stale crawl-agent copy", () => {
  const m = PROJECTS.find((p) => p.title === "ASP.NET → Hono migration")!;
  assert.equal(m.status, "shipped");
  assert.match(m.via, /Hono/);
  assert.match(m.via, /Cloudflare Workers/);
  assert.match(m.summary, /strangler-fig/i);
  assert.match(m.summary, /~200 endpoints/);
  assert.match(m.summary, /130\+ tables/);
  for (const text of [m.summary, m.via, ...m.steps, GROUP_INTRO.summary]) {
    assert.doesNotMatch(text, /blocked|harden|in progress|Browser Use|Playwright|crawl/i);
  }
});

test("the migration toolkit gets its own scene; the group holds Life-OS and the morning brief", () => {
  const mi = PROJECTS.findIndex((p) => p.title === "ASP.NET → Hono migration");
  assert.ok(SCENES.some((ids) => ids.length === 1 && ids[0] === mi), "migration should be a solo scene");
  const group = SCENES[SCENES.length - 1].map((i) => PROJECTS[i].title);
  assert.deepEqual(group, ["Life-OS", "Morning brief"]);
});

test("group-scene projects carry a short summary", () => {
  for (const i of SCENES[SCENES.length - 1]) assert.ok(PROJECTS[i].short, PROJECTS[i].title);
});
