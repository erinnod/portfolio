async (page) => {
  const OVER = 0.15, SCN = 0.7 / 6;
  const checkSvg = () => {
    const svg = [...document.querySelectorAll("#run section[aria-labelledby]")].pop()?.querySelector("figure svg[role=img]");
    if (!svg) return ["no svg"];
    const texts = [...svg.querySelectorAll("text")].map((t) => ({ s: t.textContent, b: t.getBBox(), g: t.parentNode }));
    const rects = [...svg.querySelectorAll("rect[rx=\"10\"]")].map((r) => ({ b: r.getBBox(), g: r.parentNode }));
    const hit = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
    const vb = svg.viewBox.baseVal; const o = [];
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) if (hit(texts[i].b, texts[j].b)) o.push(`${texts[i].s} × ${texts[j].s}`);
      for (const r of rects) if (r.g !== texts[i].g && hit(texts[i].b, r.b)) o.push(`${texts[i].s} × node`);
      const t = texts[i].b; if (t.x < 0 || t.y < 0 || t.x + t.width > vb.width || t.y + t.height > vb.height) o.push(`${texts[i].s} outside`);
    }
    const labels = texts.filter((t) => t.b.y > 55);
    for (const path of [...svg.querySelectorAll("path[stroke='var(--line)']")]) {
      const L = path.getTotalLength();
      for (let k = 1; k < 120; k++) { const pt = path.getPointAtLength((L * k) / 120); const t = labels.find((t) => pt.x > t.b.x && pt.x < t.b.x + t.b.width && pt.y > t.b.y && pt.y < t.b.y + t.b.height); if (t) { o.push(`wire crosses "${t.s}"`); break; } }
      for (let k = 1; k < 120; k++) { const pt = path.getPointAtLength((L * k) / 120); const r = rects.find((r) => pt.x > r.b.x + 3 && pt.x < r.b.x + r.b.width - 3 && pt.y > r.b.y + 3 && pt.y < r.b.y + r.b.height - 3); if (r) { o.push("wire crosses a node"); break; } }
    }
    return [...new Set(o)];
  };
  const out = {};
  for (const [name, w, h, dpr] of [["wide125", 1720, 1280, 1.25], ["desktop", 1440, 900, 1]]) {
    const ctx = await page.context().browser().newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    const p = await ctx.newPage();
    const pump = async (n) => { for (let i = 0; i < n; i++) { await p.screenshot(); await p.waitForTimeout(50); } };
    await p.goto("http://localhost:3007"); await p.waitForSelector("#run"); await p.waitForTimeout(1500);
    await p.evaluate((v) => { const el = document.getElementById("run"); const st = document.querySelector("#run > div"); window.scrollTo(0, el.offsetTop + v * (el.offsetHeight - st.clientHeight)); }, OVER + 1.76 * SCN);
    for (let i = 0; i < 25; i++) { await pump(1); if (await p.evaluate(() => !!document.querySelector("[role=tab]"))) break; }
    await pump(6);
    const res = {};
    const tabs = await p.$$("#run [role=tab]");
    for (let i = 0; i < tabs.length; i++) {
      await tabs[i].click(); await pump(3);
      res[await tabs[i].textContent()] = await p.evaluate(checkSvg);
      if (name === "wide125") { const b = await p.evaluate(() => { const r = document.querySelector("#run section[aria-labelledby] figure").getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }); await p.screenshot({ path: `.playwright-mcp/wf-${i + 1}.png`, clip: b }); }
    }
    out[name] = res;
    await ctx.close();
  }
  return out;
}
