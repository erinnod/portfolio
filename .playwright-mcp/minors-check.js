async (page) => {
  const BASE = "http://localhost:3000";
  const pump = async (n) => { for (let i = 0; i < n; i++) await page.screenshot(); };
  const go = async (p) => {
    await page.evaluate((p) => { const el = document.getElementById("run"); const st = document.querySelector("#run > div"); window.scrollTo(0, el.offsetTop + p * (el.offsetHeight - st.clientHeight)); }, p);
    await pump(3); await page.waitForTimeout(200); await pump(2);
  };
  const status = () => page.evaluate(() => document.querySelector("[aria-live=polite]")?.textContent);
  const out = {};

  // A. Phone rotation keeps the visitor on the same scene.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE); await page.waitForSelector("#run"); await page.waitForTimeout(800);
  await go(0.15 + 1.76 * 0.14);
  const before = await status();
  await page.setViewportSize({ width: 844, height: 390 });
  await pump(4); await page.waitForTimeout(300); await pump(4);
  const after = await status();
  out.A_rotation = { before, after, pass: before === after };

  // B. Focus inside a panel that closes goes to the jump rail, not <body>.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE); await page.waitForSelector("#run"); await page.waitForTimeout(800);
  await go(0.15 + 2.76 * 0.14);
  await page.evaluate(() => [...document.querySelectorAll("#run section a")].find((a) => a.textContent.includes("GitHub"))?.focus());
  await go(0.15 + 3 * 0.14 + 0.05 * 0.14); // next scene starts: RAG panel is gone
  const focusB = await page.evaluate(() => { const a = document.activeElement; return { tag: a?.tagName, inRail: !!a?.closest("nav[aria-label='Jump to a node']"), label: a?.getAttribute("aria-label") }; });
  out.B_focus = { ...focusB, pass: focusB.inRail };

  // C. Live screen-reader copy includes the contact routes.
  out.C_srContact = await page.evaluate(() => {
    const srs = [...document.querySelectorAll(".run-live .sr-only")];
    const linkedin = srs.some((n) => !!n.querySelector("a[href*='linkedin.com']"));
    const email = srs.some((n) => n.textContent.includes("noderin1@gmail.com"));
    return { linkedin, email, pass: linkedin && email };
  });

  // D. Queued nodes are full opacity (their 12px "Queued" label must hold contrast).
  await go(0.12);
  out.D_queued = await page.evaluate(() => {
    const label = [...document.querySelectorAll("#run span")].find((s) => s.textContent === "Queued");
    const card = label?.parentElement;
    const op = card ? parseFloat(getComputedStyle(card).opacity) : null;
    return { opacity: op, pass: op === 1 };
  });

  // E. Lit Contact node: paper text sits on signal-ink, label at full opacity.
  await go(0.85 + 0.42 * 0.15); // finish t≈0.42: Contact lit, finish field not yet open
  out.E_contact = await page.evaluate(() => {
    const label = [...document.querySelectorAll("#run p")].find((p) => p.textContent === "Output");
    const node = label?.parentElement;
    const bg = node ? getComputedStyle(node).backgroundColor : null;
    const op = label ? parseFloat(getComputedStyle(label).opacity) : null;
    return { bg, labelOpacity: op, pass: bg === "rgb(178, 58, 18)" && op === 1 };
  });

  // F. Phone finish headline: at most 4 lines.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE); await page.waitForSelector("#run"); await page.waitForTimeout(800);
  await go(0.985);
  out.F_headline = await page.evaluate(() => {
    const h = document.getElementById("finish-title");
    const lh = parseFloat(getComputedStyle(h).lineHeight);
    const lines = Math.round(h.getBoundingClientRect().height / lh);
    return { lines, pass: lines <= 4 };
  });

  // G. Dot grid moves by transform on its own layer (no background-position repaint per frame).
  out.G_dots = await page.evaluate(() => {
    const stage = document.querySelector("#run > div");
    const repaints = !!stage.style.backgroundPosition;
    const layer = stage.querySelector("[data-dots]");
    const transformed = !!layer && !!layer.style.transform;
    return { stageBackgroundPosition: repaints, dotLayerTransformed: transformed, pass: !repaints && transformed };
  });

  out.allPass = Object.values(out).every((v) => v.pass);
  return out;
}
