import Image from "next/image";

type HeroImageProps = {
  src: string;
  alt: string;
};

/* Server-rendered hero photograph. Rendered fully visible in the HTML (no
   opacity:0), so the LCP candidate paints the moment the image arrives.
   The gentle scale settle (1.03 → 1) is pure CSS — it needs no JS, runs on
   the compositor, and is disabled under prefers-reduced-motion. */
export function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <div className="hero-image absolute inset-0">
      <Image
        preload
        fetchPriority="high"
        loading="eager"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        src={src}
        alt={alt}
        className="object-cover"
      />
    </div>
  );
}
