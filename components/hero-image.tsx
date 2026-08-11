"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type HeroImageProps = {
  src: string;
  alt: string;
};

/* Quiet load-in for the hero photograph: a slow fade with a barely-there
   scale settle (1.03 → 1). No bounce, no overshoot. With reduced motion,
   a plain opacity cross-fade — no transform at all. */
export function HeroImage({ src, alt }: HeroImageProps) {
  const reduceMotion = useReducedMotion();

  const imageMotion = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1 };

  return (
    <motion.div
      className="absolute inset-0"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
      animate={imageMotion}
      transition={{
        duration: reduceMotion ? 0.4 : 1,
        ease: "easeOut",
      }}
    >
      <Image
        priority
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        src={src}
        alt={alt}
        className="object-cover"
      />
    </motion.div>
  );
}