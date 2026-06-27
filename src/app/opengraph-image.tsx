import { ImageResponse } from "next/og";

export const alt = "Financing in Canada — Equipment Financing Across Canada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded default Open Graph / Twitter card, generated at the edge.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px",
          background: "linear-gradient(135deg, #0d2342 0%, #0a1c34 60%, #071425 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", color: "#c2a36a", fontSize: 28, letterSpacing: 6, marginBottom: 28 }}>
          EQUIPMENT FINANCE · CANADA
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
          Financing in Canada
        </div>
        <div style={{ display: "flex", fontSize: 40, color: "rgba(255,255,255,0.82)", marginTop: 30 }}>
          Fast approvals. Competitive rates. Canada-wide.
        </div>
        <div style={{ display: "flex", marginTop: 52, height: 8, width: 180, background: "#c2a36a", borderRadius: 4 }} />
      </div>
    ),
    { ...size }
  );
}
