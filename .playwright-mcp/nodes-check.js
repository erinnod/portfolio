async (page) => {
  const BASE = "http://localhost:3007";
  const ctx = await page.context().browser().newContext({ viewport: { width: 1720, height: 1280 } });
  const p = await ctx.newPage();
  const pump = async (n) => { for (let i = 0; i < n; i++) { await p.screenshot(); await p.waitForTimeout(50); } };
  const go = async (v) => { await p.evaluate((v) => { const el = document.getElementById("run"); const st = document.querySelector("#run > div"); window.scrollTo(0, el.offsetTop + v * (el.offsetHeight - st.clientHeight)); }, v); await pump(6); };
  const settle = async () => { for (let i = 0; i < 120; i++) { await pump(1); const moving = await p.evaluate(() => new Promise((r) => { const y = scrollY; setTimeout(() => r(scrollY !== y), 80); })); if (!moving && i > 4) break; } await pump(4); };
  const out = {};
  await p.goto(BASE); await p.waitForSelector("#run"); await p.waitForTimeout(1500);

  // A. Node cards: title on one line, nothing spilling out of the card (overview).
  await go(0.12);
  out.A_fit = await p.evaluate(() => {
    const cards = [...document.querySelectorAll("[data-node]")];
    if (!cards.length) return { pass: false, why: "no [data-node] cards" };
    const bad = [];
    for (const c of cards) {
      const r = c.getBoundingClientRect();
      const title = c.querySelector("[data-node-title]");
      const lh = parseFloat(getComputedStyle(title).lineHeight) || 20;
      const tr = title.getBoundingClientRect();
      const kids = [...c.querySelectorAll("*")].map((e) => e.getBoundingClientRect()).filter((b) => b.width && b.height);
      const spill = kids.some((b) => b.bottom > r.bottom + 0.5 || b.right > r.right + 0.5);
      const cut = title.scrollWidth > title.clientWidth + 1 || [...c.querySelectorAll('.truncate')].some((e) => e.scrollWidth > e.clientWidth + 1);
      if (tr.height > lh * 1.5 || spill || cut) bad.push(title.textContent);
    }
    return { cards: cards.length, bad, pass: bad.length === 0 };
  });

  // B. Clicking a project node opens that project.
  await go(0.12);
  try { await p.click("[data-node='4']", { timeout: 3000 }); } catch {}
  await settle();
  out.B_click05 = await p.evaluate(() => ({ status: document.querySelector("[aria-live=polite]")?.textContent, title: [...document.querySelectorAll("#run section[aria-labelledby]")].pop()?.querySelector("h2")?.textContent }));
  out.B_click05.pass = out.B_click05.status === "Executing node 05" && /Hono/.test(out.B_click05.title || "");

  // C. Clicking the Contact node opens the finish.
  await go(0.12);
  try { await p.click("[data-contact]", { timeout: 3000 }); } catch {}
  await settle();
  out.C_contact = await p.evaluate(() => ({ status: document.querySelector("[aria-live=polite]")?.textContent }));
  out.C_contact.pass = out.C_contact.status === "Workflow finished";

  // D. While a panel covers the graph, its node buttons are out of reach (inert).
  await go(0.15 + 2.76 * (0.7 / 6));
  out.D_inert = await p.evaluate(() => { const n = document.querySelector("[data-node]"); return { inert: !!n?.closest("[inert]") }; });
  out.D_inert.pass = out.D_inert.inert;

  await ctx.close();
  out.allPass = Object.values(out).every((v) => v.pass);
  return out;
}
