"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";

import student1 from "@/assets/student1.png";

const popularSearches = [
  "IIT",
  "NEET",
  "MBA",
  "B.Tech",
  "Study Abroad",
];

const searchCategories = [
  {
    label: "Colleges",
    value: "colleges",
  },
  {
    label: "Courses",
    value: "courses",
  },
  {
    label: "Exams",
    value: "exams",
  },
];

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#eaf8f1]">
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================== */}

      <motion.div
        className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute right-[30%] top-0 h-80 w-80 rounded-full bg-white/60 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* =========================================================
          MAIN HERO CONTAINER

          DESKTOP: ORIGINAL LAYOUT PRESERVED
      ========================================================== */}

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid min-h-[430px] lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* =====================================================
              LEFT / MAIN HERO
          ====================================================== */}

          <div className="relative overflow-hidden">
            {/* ---------------------------------------------------
                SOFT HERO BACKGROUND
            ---------------------------------------------------- */}

            <div className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute right-[8%] top-[15%] h-40 w-40 rounded-full bg-white/40 blur-2xl"
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.35, 0.6, 0.35],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* =================================================
                STUDENT IMAGE

                DESKTOP POSITION IS EXACTLY THE ORIGINAL:
                bottom-0 right-0 hidden h-full w-[75%] lg:block
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, x: 45 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="
                pointer-events-none
                absolute

                /* MOBILE */
                inset-0
                h-full
                w-full

                /* DESKTOP - ORIGINAL POSITION */
                lg:bottom-0
                lg:right-0
                lg:inset-auto
                lg:h-full
                lg:w-[75%]
                lg:block
              "
            >
              <Image
                src={student1}
                alt="Student exploring education opportunities"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 60vw"
                className="object-cover object-top"
              />

              {/* =================================================
                  MOBILE BLUE IMAGE OVERLAY

                  Hidden completely on desktop.
              ================================================== */}

              <div
                className="
                  absolute
                  inset-0

                  bg-gradient-to-r
                  from-[#eaf8f1]/96
                  via-[#eaf8f1]/78
                  to-blue-500/30

                  lg:hidden
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-blue-500/10
                  mix-blend-multiply
                  lg:hidden
                "
              />

              {/* =================================================
                  ORIGINAL DESKTOP IMAGE BLEND
              ================================================== */}

              <div className="absolute inset-y-0 left-0 hidden w-[42%] bg-gradient-to-r from-[#eaf8f1] via-[#eaf8f1]/55 to-transparent lg:block" />

              {/* Very light bottom blend */}
              <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#eaf8f1]/35 to-transparent" />

              {/* Floating message */}
              <motion.div
                animate={{
                  y: [0, -7, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-[7%] top-[17%] hidden xl:block"
              >
                <div className="relative top-75 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      size={17}
                      className="text-emerald-600"
                    />

                    <div>
                      <p className="text-[11px] font-bold text-slate-800">
                        Better Education
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Brighter Future
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* =================================================
                HERO CONTENT

                Desktop padding is kept exactly as original.
            ================================================== */}

            <div
              className="
                relative
                z-10
                mx-auto
                
                flex
                h-full
                max-w-[1080px]

                /* MOBILE */
                items-center
                px-4
                py-6

                /* TABLET */
                sm:px-8
                sm:py-18

                /* DESKTOP - ORIGINAL */
                lg:px-12
                lg:py-10

                xl:px-14
              "
            >
              <div className="w-full  max-w-[650px]">
                {/* =================================================
                    EYEBROW
                ================================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="mb-5 flex items-center gap-2 sm:mb-4"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />

                  <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-700 sm:text-xs sm:tracking-[0.16em]">
                    Your future starts here
                  </span>
                </motion.div>

                {/* =================================================
                    HEADING
                ================================================== */}

                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.08,
                    ease: "easeOut",
                  }}
                  className="
                    max-w-[670px]

                    /* MOBILE */
                    text-[30px]
                    leading-[1.05]

                    /* ORIGINAL DESKTOP */
                    sm:text-5xl
                    lg:text-[46px]
                    lg:leading-[1.08]
                    xl:text-[50px]

                    font-extrabold
                    tracking-[-0.035em]
                    text-[#102d27]
                  "
                >
                  Find the Right College,
                  <br className="hidden sm:block" />

                  <span className="text-emerald-700">
                    {" "}
                    Build the Career You Want
                  </span>
                </motion.h1>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}
<motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.55,
    delay: 0.18,
  }}
  className="mt-3 hidden max-w-[600px] sm:mt-5 sm:block"
>
  <p className="text-[12px] leading-5 text-slate-600 sm:text-[15px] sm:leading-6">
    Explore top colleges, courses, exams and career options.
  </p>

  <p className="text-[12px] leading-5 text-slate-600 sm:text-[15px] sm:leading-6">
    Get personalized recommendations and expert guidance.
  </p>
</motion.div>
                {/* =================================================
                    SEARCH
                ================================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 25,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.28,
                  }}
                  className="mt-4 max-w-[610px] sm:mt-6"
                >
                  <form
                    action="/colleges"
                    className="
                      flex
                      h-[46px]
                      overflow-hidden
                      rounded-xl
                      border
                      border-white
                      bg-white
                      shadow-[0_8px_30px_rgba(16,80,55,0.10)]

                      sm:h-[52px]
                    "
                  >
                    {/* -------------------------------------------------
                        CATEGORY

                        Original desktop behavior preserved.
                    -------------------------------------------------- */}

                    <div className="relative hidden shrink-0 items-center border-r border-slate-200 sm:flex">
                      <div className="flex items-center gap-2 px-4 text-sm font-medium text-slate-700">
                        <GraduationCap
                          size={16}
                          className="text-emerald-700"
                        />

                        <select
                          name="type"
                          defaultValue="colleges"
                          className="cursor-pointer appearance-none bg-transparent pr-5 outline-none"
                          aria-label="Search category"
                        >
                          {searchCategories.map((category) => (
                            <option
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={14}
                          className="pointer-events-none absolute right-2 text-slate-400"
                        />
                      </div>
                    </div>

                    {/* -------------------------------------------------
                        SEARCH INPUT
                    -------------------------------------------------- */}

                    <div className="flex min-w-0 flex-1 items-center">
                      <Search
                        size={18}
                        className="ml-3 shrink-0 text-slate-400 sm:ml-4"
                      />

                      <input
                        type="text"
                        name="search"
                        placeholder="Search for colleges, courses, exams..."
                        className="
                          h-full
                          min-w-0
                          flex-1
                          bg-transparent
                          px-2.5
                          text-xs
                          text-slate-800
                          outline-none
                          placeholder:text-slate-400

                          sm:px-3
                          sm:text-sm
                        "
                      />
                    </div>

                    {/* -------------------------------------------------
                        SEARCH BUTTON
                    -------------------------------------------------- */}

                    <button
                      type="submit"
                      className="
                        m-1
                        flex
                        w-[70px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-emerald-700
                        px-2
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-emerald-800

                        sm:w-[88px]
                        sm:px-3
                        sm:text-sm
                      "
                    >
                      Search
                    </button>
                  </form>
                </motion.div>

                {/* =================================================
                    POPULAR SEARCHES

                    MOBILE: ONE HORIZONTAL ROW
                    DESKTOP: ORIGINAL FLEX BEHAVIOR
                ================================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.42,
                  }}
                  className="
                    mt-3
                    flex
                    min-w-0
                    items-center
                    gap-1.5
                    overflow-x-auto
                    whitespace-nowrap
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden

                    sm:mt-4
                    sm:flex-wrap
                    sm:gap-2
                    sm:overflow-visible
                  "
                >
                  <span className="mr-0 shrink-0 text-[10px] font-semibold text-slate-600 sm:mr-1 sm:text-xs">
                    Popular Searches:
                  </span>

                  {popularSearches.map((search, index) => (
                    <motion.div
                      key={search}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.48 + index * 0.06,
                      }}
                      className="shrink-0"
                    >
                      <Link
                        href={`/colleges?search=${encodeURIComponent(
                          search
                        )}`}
                        className="
                          inline-flex
                          shrink-0
                          rounded-full
                          border
                          border-emerald-100
                          bg-white/80
                          px-2.5
                          py-1
                          text-[10px]
                          font-semibold
                          text-emerald-700
                          shadow-sm
                          transition
                          hover:-translate-y-0.5
                          hover:border-emerald-200
                          hover:bg-white

                          sm:px-3
                          sm:py-1.5
                          sm:text-[11px]
                        "
                      >
                        {search}
                      </Link>
                    </motion.div>
                  ))}
                  
                </motion.div>
                <button
  type="button"
  onClick={() => {
    window.dispatchEvent(new Event("open-journey-popup"));
  }}
  className="
    mt-4
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-[#15945c]
    px-5
    py-2.5
    text-sm
    font-bold
    text-white
    shadow-[0_8px_24px_rgba(21,148,92,0.18)]
    transition-all
    duration-200
    hover:-translate-y-0.5
    hover:bg-[#117c4d]
    hover:shadow-[0_10px_28px_rgba(21,148,92,0.24)]
    active:translate-y-0
    sm:px-6
  "
>
  Apply Now
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
</button>
              </div>
            </div>
          </div>

          {/* =========================================================
              DESKTOP SIDE JOURNEY PANEL

              COMPLETELY UNCHANGED
          ========================================================== */}

          <motion.aside
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
            className="hidden border-l border-white/80 bg-white/55 p-5 backdrop-blur-sm lg:block"
          >
            <div className="flex h-full flex-col justify-center gap-4">
              {/* =================================================
                  JOURNEY CARD
              ================================================== */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      My Education Journey
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Track your path to the right college
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <GraduationCap size={18} />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <JourneyItem
                    icon={<Search size={15} />}
                    title="Explore Colleges"
                    description="Discover your options"
                  />

                  <JourneyItem
                    icon={<BookOpen size={15} />}
                    title="Find Your Course"
                    description="Choose what fits you"
                  />

                  <JourneyItem
                    icon={<Sparkles size={15} />}
                    title="Plan Your Future"
                    description="Make an informed decision"
                  />
                </div>
              </div>

              {/* =================================================
                  QUIZ CTA
              ================================================== */}

              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-800 p-5 text-white shadow-lg shadow-emerald-100"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                    Not sure what to choose?
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    Discover your direction
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-emerald-50">
                    Explore courses, colleges and career paths
                    that match your interests.
                  </p>

                  <Link
                    href="/college-predictor"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Start Exploring
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   JOURNEY ITEM
================================================================ */

function JourneyItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href="/colleges"
      className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-emerald-100 hover:bg-emerald-50/60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-slate-800">
          {title}
        </span>

        <span className="mt-0.5 block text-[11px] text-slate-500">
          {description}
        </span>
      </span>

      <ArrowRight
        size={14}
        className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600"
      />
    </Link>
  );
}