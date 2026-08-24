"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { forwardRef, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const distance = 24;

function getVariants(direction: Direction, reduce: boolean): Variants {
  if (reduce) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.3 } },
    };
  }
  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }[direction];

  return {
    hidden: { opacity: 0, ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "section" | "article" | "li" | "aside";
}) {
  const reduce = useReducedMotion() ?? false;
  const variants = getVariants(direction, reduce);
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Stagger children. Each direct child should be a `<RevealChild>`.
 */
export const Stagger = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    delayChildren?: number;
    staggerChildren?: number;
    className?: string;
  }
>(function Stagger(
  { children, delayChildren = 0, staggerChildren = 0.07, className = "" },
  ref
) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : staggerChildren,
            delayChildren: reduce ? 0 : delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
});

export function StaggerChild({
  children,
  className = "",
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div className={className} variants={getVariants(direction, reduce)}>
      {children}
    </motion.div>
  );
}
