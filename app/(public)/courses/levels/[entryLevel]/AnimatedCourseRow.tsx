"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type AnimatedCourseRowProps = {
  course: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    level: string;
    durationYears: number | null;
    averageFees: number | null;
    eligibility: string | null;
    category: {
      name: string;
      slug: string;
    } | null;
  };
};

export default function AnimatedCourseRow({
  course,
}: AnimatedCourseRowProps) {
  return (
    <motion.tr
      initial={{
        opacity: 0,
        y: 35,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group transition-colors hover:bg-emerald-50/40"
    >
      {/* Keep your existing <td> contents here */}
    </motion.tr>
  );
}