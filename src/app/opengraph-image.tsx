import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Performance Lab — Core Web Vitals 計測ツール";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 700, marginBottom: 16 }}>Performance Lab</div>
      <div style={{ fontSize: 28, color: "#94a3b8" }}>Core Web Vitals を計測し、改善提案を取得</div>
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 48,
        }}
      >
        {["LCP", "CLS", "INP", "FCP", "TTFB"].map((metric) => (
          <div
            key={metric}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 12,
              background: "rgba(255,255,255,0.1)",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {metric}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
