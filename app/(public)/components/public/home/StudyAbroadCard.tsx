"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, Plane } from "lucide-react";

export default function StudyAbroadCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative min-h-[270px] overflow-hidden rounded-2xl border border-emerald-100 bg-[#eaf8f1]"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-7 -top-8 text-emerald-700/10">
        <Globe2 className="h-40 w-40" />
      </div>

      <Plane className="pointer-events-none absolute left-10 top-10 h-8 w-8 rotate-[-20deg] text-emerald-600/20" />

      <div className="relative flex h-full min-h-[270px]">
        {/* Illustration */}
        <div className="relative flex w-[40%] shrink-0 items-end justify-center">
          <div className="absolute bottom-8 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl" />

          <div className="relative mb-4 h-[190px] w-[130px]">
            {/* Backpack */}
            <div className="absolute bottom-4 left-2 h-[105px] w-[45px] rounded-[18px] bg-emerald-800 shadow-sm">
              <div className="absolute left-1/2 top-2 h-3 w-5 -translate-x-1/2 rounded-full bg-emerald-950/40" />
              <div className="absolute right-[-5px] top-10 h-12 w-3 rounded-full bg-emerald-900" />
            </div>

            {/* Head */}
            <div className="absolute left-[52px] top-[30px] h-[45px] w-[45px] rounded-full bg-[#e8b28e]" />

            {/* Hair */}
            <div className="absolute left-[48px] top-[25px] h-[32px] w-[51px] rounded-t-full bg-slate-800" />

            {/* Body */}
            <div className="absolute bottom-[35px] left-[48px] h-[88px] w-[55px] rounded-t-[24px] bg-emerald-600" />

            {/* Arm */}
            <div className="absolute bottom-[70px] right-[20px] h-[48px] w-[12px] rotate-[-22deg] rounded-full bg-[#e8b28e]" />

            {/* Tablet */}
            <div className="absolute bottom-[80px] right-[3px] h-[42px] w-[28px] rotate-[-10deg] rounded-md border-2 border-slate-700 bg-white shadow-sm" />

            {/* Legs */}
            <div className="absolute bottom-1 left-[54px] h-[48px] w-[15px] rounded-b-xl bg-slate-700" />

            <div className="absolute bottom-1 left-[82px] h-[48px] w-[15px] rounded-b-xl bg-slate-700" />

            {/* Shoes */}
            <div className="absolute bottom-0 left-[48px] h-3 w-25 rounded-full bg-slate-900" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center pr-5">
          <h3 className="text-xl font-bold leading-tight text-emerald-950">
            Planning to Study
            <span className="block">Abroad?</span>
          </h3>

          <p className="mt-3 max-w-[220px] text-sm leading-5 text-slate-600">
            Explore global universities, courses,
            scholarships and more.
          </p>

          <Link
            href="/study-abroad"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Explore Study Abroad
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}