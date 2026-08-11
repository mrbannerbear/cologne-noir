import { ImageResponse } from "next/og";

export const alt = "Cologne Noir — Perfume Decants & Full Bottles. Bangladesh · COD · verified";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#F6F4EF",
          color: "#181818",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 10, height: 10, backgroundColor: "#181818" }} />
          <span style={{ fontSize: 22, letterSpacing: 4, color: "#6E6B64" }}>
            COLOGNE NOIR
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, letterSpacing: -2 }}>
            Perfume decants, presented with a <em>quieter</em> kind of luxury.
          </div>
          <div style={{ fontSize: 24, color: "#6E6B64", marginTop: 16 }}>
            Bangladesh · Cash on Delivery · Verified by WhatsApp
          </div>
        </div>
      </div>
    ),
    size
  );
}