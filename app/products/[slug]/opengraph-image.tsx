import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamic = "force-dynamic";

export const alt = "Cologne Noir product — decants and full bottles. Banglaesh · COD · verified";type OgImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  const blobBase = process.env.BLOB || "";
  const coverImage = product?.images?.[0];
  const imageSrc = coverImage
    ? coverImage.startsWith("http")
      ? coverImage
      : `${blobBase}${coverImage}`
    : null;

  const alt = product ? `${product.brand} ${product.name}` : "Cologne Noir";
  const brand = product?.brand ?? "Cologne Noir";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#F6F4EF",
          color: "#181818",
          fontFamily: "serif",
        }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={alt}
            style={{ width: "60%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 48,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, backgroundColor: "#181818" }} />
            <span style={{ fontSize: 20, letterSpacing: 4, color: "#6E6B64" }}>
              COLOGNE NOIR
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 28, color: "#6E6B64", letterSpacing: 1 }}>
              {brand.toUpperCase()}
            </div>
          <div style={{ display: "flex", fontSize: 52, lineHeight: 1.05, letterSpacing: -1 }}>
            {product?.name ?? "Perfume decants & full bottles"}
          </div>
            <div style={{ fontSize: 20, color: "#6E6B64", marginTop: 12 }}>
              Chittagong · Cash on Delivery · Verified by WhatsApp
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}