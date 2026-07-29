"use client";

import { motion } from "framer-motion";

const pressuredEasing: [number, number, number, number] = [0.4, 0, 0.6, 1];

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: pressuredEasing,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
