async (page) => {
  // Retina-like context: blur from bitmap upscaling shows clearly at DPR 2, as on the user's screen.
  const ctx = await page.context().browser().newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const pump = async (n) => { for (let i = 0; i < n; i++) await p.screenshot(); };
  await p.goto("http://localhost:3000"); await p.waitForSelector("#run"); await p.waitForTimeout(1500);
  // Scroll in small steps from the overview into node 01's zoom, as a visitor would (the layer is rasterised mid-animation).
  for (const prog of [0.1, 0.13, 0.15, 0.16, 0.17, 0.175, 0.177]) {
    await p.evaluate((v) => { const el = document.getElementById("run"); const st = document.querySelector("#run > div"); window.scrollTo(0, el.offsetTop + v * (el.offsetHeight - st.clientHeight)); }, prog);
    await pump(2);
  }
  await p.waitForTimeout(600); await pump(2);
  const box = await p.evaluate(() => {
    const t = [...document.querySelectorAll("#run span")].find((s) => s.textContent === "Figma → spec agent");
    const r = t.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await p.screenshot({ path: ".playwright-mcp/blur-title.png", clip: box });
  const willChange = await p.evaluate(() => getComputedStyle(document.querySelector("#run > div > div[aria-hidden='true']:not([data-dots])")).willChange);
  await ctx.close();
  return { box, willChange };
}
