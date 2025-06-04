"use client";
import { motion } from "motion/react";
import React from "react";
import { HeroHighlight } from "./HeroHighlight";

export const AnimationBackground = ({ children }) => {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className=" "
      >
        {children}
      </motion.h1>
    </HeroHighlight>
  );
};
