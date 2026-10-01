"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function StudyAbroadCTA() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-[#075c3a] px-6 py-12 sm:px-10 lg:px-14"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                <MessageCircle className="h-4 w-4" />
                Need help deciding?
              </div>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Make your study abroad decision with more confidence.
              </h2>

              <p className="mt-4 text-sm leading-6 text-emerald-50/80 sm:text-base">
                Explore your options first, then connect with guidance
                when you need help understanding your next step.
              </p>
            </div>

            <Link
              href="/qna"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Get Expert Guidance
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}