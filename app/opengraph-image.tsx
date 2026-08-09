import { ImageResponse } from "next/og";

export const alt = "NEXUS-7 Autonomous Operations Lab";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#090b10",
          color: "#f7f8fb",
          padding: 72,
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", position: "absolute", inset: 0, opacity: 0.65, background: "radial-gradient(circle at 75% 20%, #5f46c9 0, transparent 42%), radial-gradient(circle at 15% 85%, #0f7589 0, transparent 38%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
          <div style={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #9b7cff", borderRadius: 16, color: "#9b7cff", fontSize: 28 }}>N</div>
          <div style={{ fontSize: 30, letterSpacing: 8, fontWeight: 700 }}>NEXUS-7</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", position: "relative", width: 900 }}>
          <div style={{ fontSize: 22, color: "#6ee7f2", letterSpacing: 5, marginBottom: 22 }}>AUTONOMOUS OPERATIONS LAB</div>
          <div style={{ fontSize: 76, lineHeight: 1.04, fontWeight: 760 }}>See the whole system. Act inside the boundary.</div>
        </div>
        <div style={{ display: "flex", gap: 34, fontSize: 20, color: "#b8bdca", position: "relative" }}>
          <span>INCIDENTS</span><span>WORKFLOWS</span><span>DEPLOYMENTS</span><span>COST</span><span>AUDIT</span>
        </div>
      </div>
    ),
    size,
  );
}
