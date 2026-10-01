"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  ChevronRight,
  GraduationCap,
  Headphones,
  Medal,
  Search,
  Scale,
  ScrollText,
} from "lucide-react";
import type { ElementType, ReactNode } from "react";

/* =========================================================
   TYPES
========================================================= */

type ProgramCategory = {
  label: string;
  href: string;
};

type ExploreCardType =
  | "ranking"
  | "colleges"
  | "compare"
  | "exams"
  | "predictor"
  | "courses";

type ExploreCard = {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  type: ExploreCardType;
  chips?: string[];
};

/* =========================================================
   QUICK FEATURE CARDS
========================================================= */

const features = [
  {
    title: "College Search",
    description: "Explore colleges and courses",
    href: "/colleges",
    icon: Building2,
    exploreType: "colleges" as ExploreCardType,
  },
  {
    title: "Course Finder",
    description: "Find the right course for you",
    href: "/courses",
    icon: GraduationCap,
    exploreType: "courses" as ExploreCardType,
  },
  {
    title: "College Predictor",
    description: "Know your admission chances",
    href: "/college-predictor",
    icon: BarChart3,
    exploreType: "predictor" as ExploreCardType,
  },
  {
    title: "Compare Colleges",
    description: "Make informed decisions",
    href: "/compare",
    icon: Search,
    exploreType: "compare" as ExploreCardType,
  },
  {
    title: "Ranking",
    description: "College ranked based on real data",
    href: "/rankings",
    icon: Medal,
    exploreType: "ranking" as ExploreCardType,
  },
];
/* =========================================================
   EXPLORE PROGRAM CARDS
========================================================= */

const cards: ExploreCard[] = [
  {
    title: "Find Colleges",
    description: "Discover colleges via preferences",
    href: "/colleges",
    icon: Building2,
    type: "colleges",
    chips: [
      "Best MBA colleges in India",
      "Best BTech colleges in India",
    ],
  },

  {
    title: "Compare Colleges",
    description: "Compare on the basis of rank, fees, etc.",
    href: "/compare",
    icon: Scale,
    type: "compare",
  },

  {
    title: "Exams",
    description: "Know more about your exams",
    href: "/exams",
    icon: ScrollText,
    type: "exams",
    chips: [
      "B.Com",
      "B.Sc",
      "B.Sc (Nursing)",
      "BA",
      "BBA/BMS",
      "BCA",
      "BE/B.Tech",
    ],
  },

  {
    title: "College Predictor",
    description: "Know your college admission chances",
    href: "/college-predictor",
    icon: GraduationCap,
    type: "predictor",
    chips: [
      "JEE Main",
      "JEE Advanced",
      "CUET",
      "TS EAMCET",
      "CAT",
      "NEET",
      "GATE",
    ],
  },

  {
    title: "Course Finder",
    description: "Discover top courses in Indian Colleges 2026",
    href: "/courses",
    icon: Search,
    type: "courses",
    chips: [
      "BE/B.Tech - 973",
      "MBA/PGDM - 1095",
      "ME/M.Tech - 1227",
      "B.Sc - 1050",
    ],
  },
  {
  title: "Ranking",
  description: "College ranked based on real data",
  href: "/rankings",
  icon: Medal,
  type: "ranking",
  chips: [
    "Collegedunia - 3879",
    "Indiatoday - 1965",
    "IIRF - 2067",
    "Outlook - 1472",
  ],
},
];

/* =========================================================
   GET RELATED EXPLORE CARD
========================================================= */

function getExploreCard(type: ExploreCardType | null) {
  if (!type) return null;

  return cards.find((card) => card.type === type) ?? null;
}

/* =========================================================
   CARD ILLUSTRATIONS
========================================================= */

function CardIllustration({
  type,
}: {
  type: ExploreCardType;
}) {
  const common =
    "absolute right-4 top-4 flex h-[88px] w-[145px] items-center justify-center overflow-hidden rounded-[45%] bg-white/75 sm:right-5 sm:top-5 sm:h-[92px] sm:w-[155px]";

  /* -------------------------
     RANKING
  ------------------------- */

  if (type === "ranking") {
    return (
      <div className={common}>
        <div className="relative flex items-end gap-1">
          <div className="h-7 w-7 rounded-t-md bg-green-300" />
          <div className="h-12 w-8 rounded-t-md bg-green-400" />
          <div className="h-9 w-8 rounded-t-md bg-green-100" />

          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <motion.div
              animate={{
                y: [0, -3, 0],
                rotate: [0, 3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-white shadow-sm"
            >
              <Medal size={20} />
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-5 top-5"
        >
          <GraduationCap
            size={31}
            strokeWidth={1.7}
            className="text-slate-700"
          />
        </motion.div>
      </div>
    );
  }

  /* -------------------------
     FIND COLLEGES
  ------------------------- */

  if (type === "colleges") {
    return (
      <div className={common}>
        <motion.div
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <Building2
            size={60}
            strokeWidth={1.35}
            className="text-green-400"
          />

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <Search
              size={22}
              strokeWidth={2}
              className="text-green-900"
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* -------------------------
     COMPARE COLLEGES
  ------------------------- */

  if (type === "compare") {
    return (
      <div className={common}>
        <div className="relative flex items-end gap-2">
          <motion.div
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="h-10 w-12 rounded-t-lg border-2 border-green-300 bg-green-100"
          />

          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.15,
            }}
            className="h-14 w-14 rounded-t-lg border-2 border-green-400 bg-green-100"
          />

          <div className="absolute -bottom-1 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-blue-900 text-[9px] font-bold text-white">
            VS
          </div>
        </div>

        <div className="absolute right-4 top-4">
          <GraduationCap
            size={28}
            strokeWidth={1.6}
            className="text-slate-800"
          />
        </div>
      </div>
    );
  }

  /* -------------------------
     EXAMS
  ------------------------- */

  if (type === "exams") {
    return (
      <div className={common}>
        <div className="relative h-14 w-20 rotate-[-8deg] rounded-md border border-green-200 bg-white shadow-sm">
          <div className="absolute left-3 top-3 h-1.5 w-10 rounded-full bg-green-200" />
          <div className="absolute left-3 top-7 h-1.5 w-7 rounded-full bg-green-100" />
          <div className="absolute left-3 top-11 h-1.5 w-9 rounded-full bg-slate-100" />

          <motion.div
            animate={{
              rotate: [-8, 0, -8],
              x: [0, 3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-3 -top-4"
          >
            <BookOpen
              size={35}
              strokeWidth={1.7}
              className="text-green-800"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  /* -------------------------
     COLLEGE PREDICTOR
  ------------------------- */

  if (type === "predictor") {
    return (
      <div className={common}>
        <div className="relative flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-700 bg-green-100">
            <GraduationCap
              size={25}
              strokeWidth={1.7}
              className="text-slate-800"
            />
          </div>

          <div className="mt-1 h-6 w-16 rounded-t-full bg-green-800" />

          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            className="absolute -right-6 bottom-0"
          >
            <BarChart3
              size={27}
              strokeWidth={1.7}
              className="text-green-500"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  /* -------------------------
     COURSE FINDER
  ------------------------- */

  return (
    <div className={common}>
      <div className="relative flex h-14 w-11 items-center justify-center rounded-md border-2 border-green-300 bg-white">
        <div className="absolute left-2 top-3 h-1.5 w-6 rounded-full bg-green-200" />
        <div className="absolute left-2 top-7 h-1.5 w-7 rounded-full bg-slate-200" />
        <div className="absolute left-2 top-11 h-1.5 w-4 rounded-full bg-slate-100" />

        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-7 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Search
            size={22}
            strokeWidth={2}
            className="text-green-900"
          />
        </motion.div>
      </div>
    </div>
  );
}

/* =========================================================
   CHIP
========================================================= */

function Chip({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] leading-none text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:px-4 sm:text-sm">
      {children}
    </span>
  );
}

/* =========================================================
   COMPARE ROW
========================================================= */

function CompareRow({
  left,
  leftCourse,
  right,
  rightCourse,
}: {
  left: string;
  leftCourse: string;
  right: string;
  rightCourse: string;
}) {
  return (
    <Link
      href="/compare"
      className="group/compare flex items-center gap-1.5 border-b border-dashed border-slate-200 py-2.5 last:border-0 sm:gap-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[8px] font-bold text-slate-500 sm:h-8 sm:w-8 sm:text-[9px]">
          IIT
        </div>

        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-slate-600 sm:text-[14px]">
            {left}
          </p>

          <p className="truncate text-[11px] text-sky-500 sm:text-[13px]">
            {leftCourse}
          </p>
        </div>
      </div>

      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[7px] font-bold text-white sm:h-6 sm:w-6 sm:text-[8px]">
        VS
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-right sm:gap-2">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-slate-600 sm:text-[14px]">
            {right}
          </p>

          <p className="truncate text-[11px] text-sky-500 sm:text-[13px]">
            {rightCourse}
          </p>
        </div>

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[8px] font-bold text-slate-500 sm:h-8 sm:w-8 sm:text-[9px]">
          IIT
        </div>
      </div>

      <ChevronRight
        size={14}
        className="shrink-0 text-slate-400 transition-transform duration-200 group-hover/compare:translate-x-1"
      />
    </Link>
  );
}

/* =========================================================
   EXPLORE CARD CONTENT
========================================================= */

function ExploreCardContent({
  card,
}: {
  card: ExploreCard;
}) {
  if (card.type === "compare") {
    return (
      <div className="mt-1">
        <CompareRow
          left="IIT Madras"
          leftCourse="BE/B.Tech"
          right="IIT Delhi"
          rightCourse="BE/B.Tech"
        />

        <CompareRow
          left="IIT Madras"
          leftCourse="BE/B.Tech"
          right="IIT Bombay"
          rightCourse="BE/B.Tech"
        />
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {card.chips?.map((chip) => (
        <Chip key={chip}>{chip}</Chip>
      ))}
    </div>
  );
}

/* =========================================================
   EXPLORE CARD
========================================================= */

function ExploreCard({
  card,
}: {
  card: ExploreCard;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="absolute left-0 right-0 top-[calc(100%+12px)] z-50"
    >
      <motion.article
        initial={{
          opacity: 0,
          scale: 0.97,
          y: -5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.16)]"
      >
        {/* Header */}

        <div className="relative min-h-[132px] overflow-hidden bg-[#f3fcf5] px-5 py-5 sm:px-7">
          <div className="relative z-10 max-w-[64%]">
            <h3 className="text-[21px] font-bold tracking-[-0.5px] text-[#26354d] sm:text-[24px]">
              {card.title}
            </h3>

            <p className="mt-1 text-[13px] leading-5 text-slate-600 sm:text-[15px] sm:leading-6">
              {card.description}
            </p>
          </div>

          <CardIllustration type={card.type} />

          <div className="absolute -right-10 -top-14 h-32 w-32 rounded-full bg-white/50 blur-2xl" />
        </div>

        {/* Body */}

        <div className="px-5 pb-5 pt-3">
          <ExploreCardContent card={card} />

          <Link
            href={card.href}
            className="group/cta mt-5 flex items-center gap-2 text-[14px] font-medium text-slate-800 transition-colors hover:text-emerald-700 sm:text-[16px]"
          >
            <span>
              {card.type === "ranking" &&
                "Top Ranked Colleges in India"}

              {card.type === "colleges" &&
                "Discover Top Colleges in India"}

              {card.type === "compare" &&
                "Compare Colleges"}

              {card.type === "exams" &&
                "Check All Entrance Exams in India"}

              {card.type === "predictor" &&
                "Find Where you may get Admission"}

              {card.type === "courses" &&
                "Get Top Courses in Indian Colleges"}
            </span>

            <ArrowRight
              size={17}
              className="shrink-0 transition-transform duration-200 group-hover/cta:translate-x-1"
            />
          </Link>
        </div>
      </motion.article>
    </motion.div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  feature,
}: {
  feature: (typeof features)[number];
}) {
  const Icon = feature.icon;
  const exploreCard = getExploreCard(feature.exploreType);

  return (
    <div className="group relative h-full overflow-visible">
      <Link
        href={feature.href}
        className="group relative flex min-h-[112px] items-center gap-4 px-5 py-5 transition-colors duration-300 hover:bg-emerald-50/50"
      >
        {/* Icon */}

        <motion.div
          whileHover={{
            scale: 1.08,
            rotate: 2,
          }}
          transition={{
            duration: 0.2,
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-100"
        >
          <Icon
            size={21}
            strokeWidth={1.9}
          />
        </motion.div>

        {/* Text */}

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
            {feature.title}
          </h2>

          <p className="mt-1 text-[11px] leading-4 text-slate-500">
            {feature.description}
          </p>
        </div>

        {/* Arrow */}

        <ArrowRight
          size={15}
          className="shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-600"
        />

        {/* Hover line */}

        <span className="absolute bottom-0 left-5 right-5 h-0.5 origin-left scale-x-0 rounded-full bg-emerald-500 transition-transform duration-300 group-hover:scale-x-100" />
      </Link>

      {/* =================================================
          RELATED EXPLORE CARD
          Hidden by default.
          Appears when feature is hovered.
      ================================================= */}

      {exploreCard && (
        <div className="pointer-events-none absolute left-0 right-0 top-full z-50 pt-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
          <ExploreCard card={exploreCard} />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HomeFeatureStrip() {
  return (
    <section className="relative z-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            QUICK FEATURES
        ================================================== */}

        <div className="relative overflow-visible rounded-2xl border border-emerald-100 bg-white shadow-[0_8px_30px_rgba(16,80,55,0.08)]">
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5 lg:divide-y-0">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                }}
                className="relative overflow-visible"
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* =================================================
            EXPLORE PROGRAMS
        ================================================== */}

      </div>
    </section>
  );
}