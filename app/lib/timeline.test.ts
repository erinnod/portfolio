import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONTACT_START, OVER, SCN, SCENES, TRIGGER,
  sceneAt, camera, fitScale, nodeCenter, nodeState, wireProgress,
  panelOpen, finishOpen, railTargets, railIndex, beadAt, statusLine, local, nodeTarget, contactTarget,
} from "./timeline.ts";

const DESK = { w: 1440, h: 900 };
const PHONE = { w: 390, h: 844 };
const near = (a: number, b: number, eps = 1e-6) =>
  assert.ok(Math.abs(a - b) < eps, `${a} !≈ ${b}`);

test("sceneAt maps progress to phases and clamps overscroll", () => {
  assert.equal(sceneAt(0).phase, "intro");
  assert.equal(sceneAt(0.1).phase, "overview");
  assert.deepEqual(sceneAt(OVER), { phase: "scene", sceneIndex: 0, t: 0 });
  assert.equal(sceneAt(CONTACT_START - 0.001).sceneIndex, SCENES.length - 1);
  assert.equal(sceneAt(CONTACT_START).phase, "finish");
  assert.deepEqual(sceneAt(-0.3), { phase: "intro", sceneIndex: -1, t: 0 });
  assert.deepEqual(sceneAt(1.4), { phase: "finish", sceneIndex: -1, t: 1 });
});

test("camera opens centred on the trigger at 2.7x fit", () => {
  const c = camera(0, DESK);
  near(c.scale, fitScale(DESK) * 2.7);
  near(c.x + TRIGGER.x * c.scale, DESK.w / 2);
  near(c.y + TRIGGER.y * c.scale, DESK.h / 2);
});

test("camera opening makes the trigger fill most of a phone's usable width (left of the rail)", () => {
  const c = camera(0, PHONE);
  const usable = PHONE.w - 64;
  const triggerOnScreen = 280 * c.scale; // trigger card is 280 world units wide
  assert.ok(triggerOnScreen > usable * 0.8, `trigger only ${triggerOnScreen.toFixed(0)}px wide`);
  assert.ok(triggerOnScreen <= usable * 0.9, `trigger overflows at ${triggerOnScreen.toFixed(0)}px`);
  near(c.x + TRIGGER.x * c.scale, usable / 2);
});

const PHONE_SHORT = { w: 390, h: 664 }; // iPhone Safari with toolbars
const RAIL = 64; // phone jump-rail column the camera must keep clear of

test("phone overview frames the node column readably and clear of the rail", () => {
  for (const v of [PHONE, PHONE_SHORT]) {
    const c = camera(0.1, v);
    assert.ok(c.scale >= 0.6, `node labels too small: scale ${c.scale.toFixed(2)} at ${v.w}x${v.h}`);
    const left = c.x + 520 * c.scale, right = c.x + 860 * c.scale; // node column spans world x 520..860
    const top = c.y + nodeCenter(0).y * c.scale - 38 * c.scale, bottom = c.y + nodeCenter(5).y * c.scale + 38 * c.scale;
    assert.ok(left >= 8 && right <= v.w - RAIL, `column ${left.toFixed(0)}..${right.toFixed(0)} hits the edge or rail`);
    assert.ok(top >= 40 && bottom <= v.h - 8, `column ${top.toFixed(0)}..${bottom.toFixed(0)} leaves the stage`);
  }
});

test("phone opening and zoomed node stay clear of the rail", () => {
  const open = camera(0, PHONE);
  const portX = open.x + (TRIGGER.x + 140 + 9) * open.scale; // trigger card right edge + output port
  assert.ok(portX <= PHONE.w - RAIL, `output port at ${portX.toFixed(0)} sits under the rail`);
  const zoomed = camera(OVER + SCN * 1 + SCN * 0.5, PHONE);
  const nodeRight = zoomed.x + 860 * zoomed.scale;
  assert.ok(nodeRight <= PHONE.w - RAIL, `zoomed node right edge ${nodeRight.toFixed(0)} under the rail`);
});

test("desktop framing is unchanged by the phone rail", () => {
  const c = camera(0.1, DESK);
  near(c.scale, fitScale(DESK));
  near(c.x + 650 * c.scale, DESK.w / 2);
});

test("camera keeps the focused node centred on a phone viewport", () => {
  const mid = OVER + SCN * 1 + SCN * 0.5; // scene 1 (node 02), fully zoomed
  const c = camera(mid, PHONE);
  const n = nodeCenter(1);
  near(c.x + n.x * c.scale, (PHONE.w - 64) / 2);
  near(c.y + n.y * c.scale, PHONE.h / 2);
});

test("nodeState walks queued → executing → done", () => {
  for (let i = 0; i < 6; i++) assert.equal(nodeState(i, 0.1), "queued");
  const early = OVER + SCN * 1 + SCN * 0.1; // scene 1, t = 0.1
  assert.equal(nodeState(0, early), "done");
  assert.equal(nodeState(1, early), "executing");
  assert.equal(nodeState(2, early), "queued");
  for (let i = 0; i < 6; i++) assert.equal(nodeState(i, 0.95), "done");
});

test("wireProgress never decreases as the visitor scrolls down", () => {
  for (let i = 0; i < 6; i++) {
    let prev = 0;
    for (let p = 0; p <= 1.0001; p += 0.001) {
      const w = wireProgress(i, p);
      assert.ok(w >= prev - 1e-9, `wire ${i} fell at p=${p.toFixed(3)}`);
      prev = w;
    }
    near(prev, 1);
  }
});

test("panelOpen is closed at scene edges and open mid-scene", () => {
  near(panelOpen(OVER), 0);
  near(panelOpen(OVER + SCN * 0.5), 1);
  near(panelOpen(OVER + SCN * 0.999), 0);
  near(panelOpen(0.1), 0);
});

test("rail targets land on fully open scenes and the open finish", () => {
  const targets = railTargets();
  assert.equal(targets.length, SCENES.length + 2);
  assert.equal(targets[0], 0);
  for (let k = 0; k < SCENES.length; k++) {
    const p = targets[k + 1];
    const s = sceneAt(p);
    assert.equal(s.sceneIndex, k);
    assert.ok(panelOpen(p) > 0.99);
    assert.equal(railIndex(p), k + 1);
    // A jump must land on a finished panel: the last pipeline step (5 steps max) and the image are fully revealed.
    assert.ok(local(s.t, 0.34 + 4 * 0.07, 0.08) === 1, `scene ${k} pipeline unfinished at t=${s.t.toFixed(2)}`);
    assert.ok(local(s.t, 0.5, 0.18) === 1, `scene ${k} image unfinished at t=${s.t.toFixed(2)}`);
  }
  const last = targets[targets.length - 1];
  assert.ok(finishOpen(last) > 0.99);
  assert.equal(railIndex(last), SCENES.length + 1);
});

test("clicking a project node targets that project's fully built panel; Contact targets the open finish", () => {
  for (let i = 0; i < 6; i++) {
    const p = nodeTarget(i);
    const s = sceneAt(p);
    assert.equal(s.phase, "scene", `node ${i}`);
    assert.ok(SCENES[s.sceneIndex].includes(i), `node ${i} lands on scene ${s.sceneIndex}`);
    assert.ok(panelOpen(p) > 0.99, `node ${i} panel not open`);
  }
  assert.ok(finishOpen(contactTarget()) > 0.99);
});

test("the bead only travels while a wire is drawing", () => {
  assert.equal(beadAt(0.1), null);
  const b = beadAt(OVER + SCN * 0.1);
  assert.ok(b && b.x > 320 && b.x < 520);
  assert.equal(beadAt(OVER + SCN * 0.5), null);
});

test("statusLine narrates the run", () => {
  assert.equal(statusLine(0), "Waiting for trigger");
  assert.equal(statusLine(0.1), "Trigger fired · 6 nodes queued");
  assert.equal(statusLine(OVER + SCN * 1.5), "Executing node 02");
  assert.equal(statusLine(OVER + SCN * 4.5), "Executing node 05");
  assert.equal(statusLine(OVER + SCN * 5.5), "Executing node 06");
  assert.equal(statusLine(0.95), "Workflow finished");
});

test("the six-node column is centred on the trigger → Contact line", () => {
  near((nodeCenter(0).y + nodeCenter(5).y) / 2, TRIGGER.y);
});
