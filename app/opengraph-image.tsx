import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The link preview (LinkedIn, Slack, iMessage…): the canvas in miniature. The trigger node named Erin Nodland
// is wired through three project nodes into the Contact output, on the dotted ground. Rendered at build time.

export const alt = "Erin Nodland: a workflow canvas wiring a trigger node through Shopify automation, ASP.NET → Hono and Life-OS into Get in touch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  ground: "#eeefea", paper: "#ffffff", ink: "#1e1f24", muted: "#5e6158", line: "#c9cbc2",
  signal: "#d9481f", signalInk: "#b23a12", okTint: "#ddefe3",
};

const PORT = { x: 503, y: 300 };
const NODES = [
  { no: "02", title: "Shopify automation" },
  { no: "05", title: "ASP.NET → Hono" },
  { no: "06", title: "Life-OS" },
].map((n, i) => ({ ...n, y: 150 + i * 126 }));
const NODE_X = 580, NODE_W = 362, NODE_H = 78;
const OUT = { x: 984, y: 255, w: 192, h: 90 };
// The canvas's dot grid, drawn as circles (the renderer ignores CSS radial-gradient backgrounds).
const DOTS = Array.from({ length: 50 * 27 }, (_, k) => ({ x: 12 + (k % 50) * 24, y: 12 + Math.floor(k / 50) * 24 }));

export default async function Image() {
  const [regular, black] = await Promise.all(
    ["500", "900"].map((w) => readFile(join(process.cwd(), `assets/HankenGrotesk-${w}.ttf`))),
  );
  const outY = OUT.y + OUT.h / 2;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Hanken Grotesk",
          backgroundColor: C.ground, color: C.ink,
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {DOTS.map((d) => <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r="1.6" fill={C.line} />)}
          {NODES.map((n) => {
            const cy = n.y + NODE_H / 2;
            return (
              <g key={n.no}>
                <path d={`M${PORT.x} ${PORT.y} C 545 ${PORT.y}, 538 ${cy}, ${NODE_X} ${cy}`} fill="none" stroke={C.ink} strokeWidth="3" />
                <path d={`M${NODE_X + NODE_W} ${cy} C 966 ${cy}, 960 ${outY}, ${OUT.x} ${outY}`} fill="none" stroke={C.ink} strokeWidth="3" />
              </g>
            );
          })}
        </svg>

        <div style={{ position: "absolute", left: 70, top: 56, fontSize: 26, fontWeight: 900, display: "flex" }}>erin-nodland.workflow</div>

        <div
          style={{
            position: "absolute", left: 70, top: 215, width: 420, height: 170, borderRadius: 22, backgroundColor: C.ink,
            display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 34px",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 500, color: C.line, display: "flex" }}>Trigger</div>
          <div style={{ fontSize: 64, fontWeight: 900, color: C.paper, letterSpacing: -2.5, display: "flex" }}>Erin Nodland</div>
        </div>
        <div
          style={{
            position: "absolute", left: PORT.x - 14, top: PORT.y - 14, width: 28, height: 28, borderRadius: 14,
            backgroundColor: C.signal, border: `5px solid ${C.ground}`, display: "flex",
          }}
        />

        {NODES.map((n) => (
          <div
            key={n.no}
            style={{
              position: "absolute", left: NODE_X, top: n.y, width: NODE_W, height: NODE_H, borderRadius: 14,
              backgroundColor: C.paper, border: `3px solid ${C.ink}`, display: "flex", alignItems: "center", padding: "0 16px",
            }}
          >
            <div
              style={{
                width: 46, height: 46, borderRadius: 10, backgroundColor: C.okTint, fontSize: 19, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center", marginRight: 16,
              }}
            >
              {n.no}
            </div>
            <div style={{ fontSize: 27, fontWeight: 900, letterSpacing: -0.6, whiteSpace: "nowrap", display: "flex" }}>{n.title}</div>
          </div>
        ))}

        <div
          style={{
            position: "absolute", left: OUT.x, top: OUT.y, width: OUT.w, height: OUT.h, borderRadius: 14,
            backgroundColor: C.paper, border: `3px solid ${C.signalInk}`, display: "flex", flexDirection: "column",
            justifyContent: "center", padding: "0 16px",
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 500, color: C.muted, display: "flex" }}>Output</div>
          <div style={{ fontSize: 26, fontWeight: 900, whiteSpace: "nowrap", display: "flex" }}>Get in touch</div>
        </div>

        <div style={{ position: "absolute", left: 70, top: 508, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: -1.6, display: "flex" }}>AI workflows that ship</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: C.muted, display: "flex", marginTop: 4 }}>
            Agents and automation running in production
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Hanken Grotesk", data: regular, weight: 500, style: "normal" },
        { name: "Hanken Grotesk", data: black, weight: 900, style: "normal" },
      ],
    },
  );
}
