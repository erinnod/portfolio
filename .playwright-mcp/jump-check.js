async (page) => {
  // A jump must cut straight to the target: the status line may only ever show where you started and where you
  // land, never the scenes in between.
  const ctx = await page.context().browser().newContext({ viewport: { width: 1720, height: 1280 } });
  const p = await ctx.newPage();
  const pump = async (n) => { for (let i = 0; i < n; i++) { await p.screenshot(); await p.waitForTimeout(40); } };
  await p.goto("http://localhost:3007"); await p.waitForSelector("#run"); await p.waitForTimeout(1500);
  const out = {};
  const run = async (label, startP, click) => {
    await p.evaluate((v) => { const el = document.getElementById("run"); const st = document.querySelector("#run > div"); window.scrollTo(0, el.offsetTop + v * (el.offsetHeight - st.clientHeight)); }, startP);
    await pump(6);
    await p.evaluate(() => {
      window.__seen = [];
      const s = document.querySelector("[aria-live=polite]");
      window.__seen.push(s.textContent);
      new MutationObserver(() => { const t = s.textContent; if (window.__seen[window.__seen.length - 1] !== t) window.__seen.push(t); }).observe(s, { childList: true, characterData: true, subtree: true });
    });
    await click();
    for (let i = 0; i < 60; i++) { await pump(1); }
    out[label] = await p.evaluate(() => window.__seen);
  };
  await run("overview→05", 0.12, () => p.click("[data-node='4']"));
  await run("overview→contact", 0.12, () => p.click("[data-contact]"));
  await run("rail 01→04", 0.15 + 0.76 * (0.7 / 6), () => p.click("nav[aria-label='Jump to a node'] button[aria-label^='Jump to 04']"));
  await ctx.close();
  const ok = (seen, end) => seen.length <= 2 && seen[seen.length - 1] === end;
  out.pass = ok(out["overview→05"], "Executing node 05") && ok(out["overview→contact"], "Workflow finished") && ok(out["rail 01→04"], "Executing node 04");
  return out;
}
