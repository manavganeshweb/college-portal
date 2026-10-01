"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Search,
} from "lucide-react";

export default function StudyAbroadHero() {
  return (
    <section className="relative overflow-hidden bg-[#e8f7ef]">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-white/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Globe2 className="h-4 w-4" />
              Study Abroad
            </div>

            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Turn your global
              <span className="block text-emerald-700">
                education dream into a plan.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore international study opportunities, understand
              your options and make informed decisions about studying
              abroad.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {[
                "Explore destinations",
                "Compare opportunities",
                "Plan your journey",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#explore"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Explore Study Abroad
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/qna"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Get Guidance
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-square max-w-[440px]">
              <div className="absolute inset-8 rounded-full bg-white/70 shadow-sm" />

              <div className="absolute inset-16 rounded-full border border-emerald-200" />

              <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-700 shadow-xl">
                <Globe2 className="h-24 w-24 text-white" />
              </div>

              <div className="absolute right-8 top-16 rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg">
                <Search className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="absolute bottom-20 left-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="absolute bottom-8 right-16 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg">
                Your Global Journey
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}