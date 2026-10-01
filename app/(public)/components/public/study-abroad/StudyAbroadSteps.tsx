"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  FileSearch,
  GraduationCap,
  Route,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Explore",
    description:
      "Start by understanding destinations, universities and study options.",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Shortlist",
    description:
      "Narrow down your choices based on your academic and career goals.",
  },
  {
    number: "03",
    icon: Route,
    title: "Compare",
    description:
      "Evaluate your shortlisted options before making a decision.",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Plan",
    description:
      "Move forward with a clearer education journey and next steps.",
  },
];

export default function StudyAbroadSteps() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Your Journey
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
            From exploration to your next step
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                }}
                className="relative rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-emerald-100">
                    {step.number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-emerald-300 lg:block" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}