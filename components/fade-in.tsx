"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const pressuredEasing: [number, number, number, number] = [0.4, 0, 0.6, 1];

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export const FadeIn = memo(function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.7,
        ease: pressuredEasing,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
});
