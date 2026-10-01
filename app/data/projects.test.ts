import { test } from "node:test";
import assert from "node:assert/strict";
import { PROJECTS, STATUS_TONE } from "./projects.ts";
import { SCENES } from "../lib/timeline.ts";

test("four projects numbered 01–04", () => {
  assert.deepEqual(PROJECTS.map((p) => p.no), ["01", "02", "03", "04"]);
});

test("only built work is on the canvas: the RAG assistant and multi-agent outreach are still on Erin's todo list", () => {
  for (const p of PROJECTS) assert.doesNotMatch(`${p.title} ${p.summary}`, /RAG|outreach|multi-agent/i, p.title);
});

test("every project appears in exactly one scene", () => {
  assert.deepEqual([...SCENES.flat()].sort(), [0, 1, 2, 3]);
});

test("statuses match PRODUCT.md as of 2026-10-01", () => {
  const byTitle = Object.fromEntries(PROJECTS.map((p) => [p.title, p.status]));
  assert.equal(byTitle["Figma → spec agent"], "shipped");
  assert.equal(byTitle["Shopify product automation"], "live");
  assert.equal(byTitle["Life-OS"], "running");
  assert.equal(byTitle["ASP.NET → Hono migration"], "shipped");
});

test("no project links to a repo visitors can't open (both old links were private and 404ed)", () => {
  assert.deepEqual(PROJECTS.flatMap((p) => (p.link ? [p.link.href] : [])), []);
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
  // Not capped at a number: the CRM had 200+ endpoints, and the method scales to any count (Erin, 2026-10-01).
  assert.match(m.summary, /200\+ endpoints/);
  assert.match(m.summary, /any number of endpoints/i);
  for (const text of [m.summary, ...m.steps]) assert.doesNotMatch(text, /~200/);
  assert.match(m.summary, /130\+ tables/);
  for (const text of [m.summary, m.via, ...m.steps]) {
    assert.doesNotMatch(text, /blocked|harden|in progress|Browser Use|Playwright|crawl/i);
  }
});

test("every project gets its own scene (the morning brief is part of Life-OS, not a separate node)", () => {
  assert.ok(SCENES.every((ids) => ids.length === 1));
  assert.ok(!PROJECTS.some((p) => /morning brief/i.test(p.title)));
});

test("Life-OS reflects Erin's write-up: always-on agent, scheduled jobs, one daily brief", () => {
  const l = PROJECTS.find((p) => p.title === "Life-OS")!;
  assert.equal(l.status, "running");
  assert.match(l.via, /Hermes Agent/);
  assert.match(l.summary, /Raspberry Pi 5/);
  assert.match(l.summary, /18 scheduled jobs/);
  assert.match(l.summary, /06:00/);
  assert.match(l.summary, /since May 2026/);
  assert.ok(l.steps.length <= 5);
  // A public page: engineering facts only, nothing personal from the vault.
  for (const text of [l.summary, l.via, ...l.steps, l.node?.via ?? ""]) {
    assert.doesNotMatch(text, /Simon|Garmin|sleep|gym|laundry|anime|military|Ellie|partner|Shoothill/i);
  }
});

test("email is shown scraper-resistant and only assembled from parts", async () => {
  const mod = await import("./projects.ts");
  assert.equal(mod.EMAIL_DISPLAY, "noderin1 [at] gmail (dot) com");
  assert.equal(mod.emailAddress(), ["noderin1", "gmail.com"].join("@"));
  // No export carries the plain address as a ready-made string.
  for (const [name, value] of Object.entries(mod)) {
    if (typeof value === "function") continue;
    assert.doesNotMatch(JSON.stringify(value) ?? "", /noderin1@/, name);
  }
});

test("contact routes include GitHub", async () => {
  const mod = await import("./projects.ts");
  assert.equal(mod.GITHUB, "https://github.com/erinnod");
});

test("Life-OS shows how it stays reliable, without mapping the setup for an attacker", () => {
  const l = PROJECTS.find((p) => p.title === "Life-OS")!;
  assert.ok(l.notes && l.notes.items.length >= 2 && l.notes.items.length <= 3, "two or three reliability notes");
  assert.ok(l.notes.items.some((n) => /silent/i.test(n)), "the silent-delivery outage");
  assert.ok(l.notes.items.some((n) => /three fallback/i.test(n)), "the rotator's three-fallback guard");
  for (const text of [l.notes.title, ...l.notes.items]) {
    // No addresses, ports, auth/dashboard internals, endpoint or model names, or scraping workarounds.
    assert.doesNotMatch(text, /\d+\.\d+\.\d+\.\d+|\bport\b|auth|dashboard|endpoint|password|token gate|DeepSeek|Reddit|Trakt|scrap|Cloudflare/i);
  }
});
