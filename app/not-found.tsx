"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Home,
  Search,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-white px-6 py-20">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-green-50 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />

        <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-emerald-300" />
        <div className="absolute right-[16%] top-[25%] h-3 w-3 rounded-full bg-emerald-200" />
        <div className="absolute bottom-[22%] left-[20%] h-2.5 w-2.5 rounded-full bg-green-200" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* 404 illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto mb-8 flex w-fit items-center justify-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-emerald-100 bg-white shadow-xl shadow-emerald-100/50"
          >
            <div className="absolute inset-3 rounded-[1.4rem] bg-emerald-50" />

            <GraduationCap className="relative z-10 h-14 w-14 text-emerald-600" />

            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-emerald-600 text-sm font-bold text-white shadow-lg"
            >
              ?
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 404 */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600"
        >
          Error 404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          Looks like you took a
          <span className="block text-emerald-600">wrong turn.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg"
        >
          The page you&apos;re looking for doesn&apos;t exist, may have moved,
          or the link might be outdated. Don&apos;t worry — there&apos;s plenty
          more to explore.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/colleges"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:w-auto"
          >
            Explore Colleges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-12 grid max-w-lg grid-cols-2 gap-3"
        >
          <Link
            href="/courses"
            className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-left transition-all hover:border-emerald-100 hover:bg-emerald-50/60"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                Find Courses
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Explore programs
              </p>
            </div>

            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
          </Link>

          <Link
            href="/search"
            className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-left transition-all hover:border-emerald-100 hover:bg-emerald-50/60"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
              <Search className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                Search
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Find what you need
              </p>
            </div>

            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to previous page
          </button>
        </motion.div>
      </div>
    </main>
  );
}