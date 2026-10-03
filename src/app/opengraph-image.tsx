import { ImageResponse } from "next/og";

export const alt = "TimeWorkCalc — Time & Work-Hours Calculators";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#ffffff",
          backgroundImage:
            "linear-gradient(135deg, #eff6ff 0%, #ffffff 55%, #f4f4f5 100%)",
          padding: "80px 96px",
          fontFamily: "sans-serif",
          color: "#18181b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontSize: 28,
            padding: "10px 24px",
            borderRadius: 9999,
            marginBottom: 40,
          }}
        >
          TimeWorkCalc
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 28,
            maxWidth: 1000,
          }}
        >
          Time &amp; Work-Hours Calculators
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#52525b",
            marginBottom: 48,
            maxWidth: 1000,
          }}
        >
          Add time, find elapsed hours, build time cards, and estimate
          overtime — 11 free calculators.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#2563eb",
            fontWeight: 600,
          }}
        >
          timeworkcalc.com · Runs entirely in your browser
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
