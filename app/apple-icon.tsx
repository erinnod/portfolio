import { ImageResponse } from "next/og";

// Home-screen icon (iOS takes no SVG): the same mark as icon.svg, the trigger node and its orange port.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1e1f24" }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: "#d9481f", border: "14px solid #ffffff", display: "flex" }} />
      </div>
    ),
    size,
  );
}
