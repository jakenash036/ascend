import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        <div style={{ color: "#e8e8e3", fontSize: "96px", fontWeight: 700, letterSpacing: "0.15em" }}>
          ASCEND
        </div>
        <div style={{ width: "120px", height: "1px", background: "#c0c0c0" }} />
        <div style={{ color: "#808080", fontSize: "32px", letterSpacing: "0.3em" }}>
          ESCAPE AVERAGE
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
