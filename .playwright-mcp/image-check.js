async (page) => {
  // A project screenshot must show whole (rendered box has the image's own aspect: nothing cropped) and never be
  // drawn wider than its source pixels (no CSS upscaling).
  const pump = async (n) => { for (let i = 0; i < n; i++) await page.screenshot(); };
  const out = [];
  for (const [name, w, h] of [["desktop", 1440, 900], ["wide", 1720, 1280], ["phone", 390, 844]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("http://localhost:3001"); await page.waitForSelector("#run"); await page.waitForTimeout(1200);
    for (const [label, p] of [["figma", 0.15 + 0.76 * 0.14], ["shopify", 0.15 + 1.76 * 0.14]]) {
      await page.evaluate((v) => { const el = document.getElementById("run"); const st = document.querySelector("#run > div"); window.scrollTo(0, el.offsetTop + v * (el.offsetHeight - st.clientHeight)); }, p);
      await pump(3); await page.waitForTimeout(600); await pump(3);
      const r = await page.evaluate(() => {
        const img = document.querySelector("#run section[aria-labelledby] img");
        if (!img) return null;
        const b = img.getBoundingClientRect();
        const fit = getComputedStyle(img).objectFit;
        const natural = Number(img.getAttribute("width")); // source pixel width declared to next/image
        const nAspect = Number(img.getAttribute("width")) / Number(img.getAttribute("height"));
        const boxAspect = b.width / b.height;
        const cropped = fit === "cover" && Math.abs(boxAspect - nAspect) / nAspect > 0.01;
        return { fit, boxW: Math.round(b.width), boxH: Math.round(b.height), sourceW: natural, cropped, upscaled: b.width > natural + 1 };
      });
      out.push({ name, label, ...r, pass: !!r && !r.cropped && !r.upscaled });
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  return { out, allPass: out.every((o) => o.pass) };
}
