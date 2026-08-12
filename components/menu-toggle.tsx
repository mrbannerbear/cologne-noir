"use client";

import { motion, useReducedMotion } from "framer-motion";

const lineTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] } as const;

type MenuToggleProps = {
  open: boolean;
};

/* Hamburger → cross. Under reduced motion, cross-fades between the two
   glyphs instead of transforming. */
export function MenuToggle({ open }: MenuToggleProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <span className="relative block h-3.5 w-4.5" aria-hidden="true">
        <span
          className="absolute inset-0 flex flex-col justify-between transition-opacity duration-150"
          style={{ opacity: open ? 0 : 1 }}
        >
          <span className="h-[1.5px] w-full bg-current" />
          <span className="h-[1.5px] w-full bg-current" />
          <span className="h-[1.5px] w-full bg-current" />
        </span>
        <span
          className="absolute inset-0 transition-opacity duration-150"
          style={{ opacity: open ? 1 : 0 }}
        >
          <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-45 bg-current" />
          <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 -rotate-45 bg-current" />
        </span>
      </span>
    );
  }

  return (
    <span className="relative block h-3.5 w-4.5" aria-hidden="true">
      <motion.span
        className="absolute left-0 top-0 h-[1.5px] w-full bg-current"
        initial={false}
        animate={{ y: open ? "6.25px" : 0, rotate: open ? 45 : 0 }}
        transition={lineTransition}
      />
      <motion.span
        className="absolute left-0 top-[6.25px] h-[1.5px] w-full bg-current"
        style={{ transformOrigin: "center" }}
        initial={false}
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute left-0 top-[12.5px] h-[1.5px] w-full bg-current"
        initial={false}
        animate={{ y: open ? "-6.25px" : 0, rotate: open ? -45 : 0 }}
        transition={lineTransition}
      />
    </span>
  );
}