import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0b08",
          borderRadius: 14,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 900,
            backgroundImage: "linear-gradient(135deg, #d6a840 0%, #ecd89d 50%, #c8952e 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          A
        </div>
      </div>
    ),
    size,
  );
}
