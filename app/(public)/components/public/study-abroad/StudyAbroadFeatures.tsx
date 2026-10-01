"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  CircleDollarSign,
  FileCheck2,
  GraduationCap,
  MapPinned,
} from "lucide-react";

const features = [
  {
    icon: MapPinned,
    title: "Explore Destinations",
    description:
      "Discover international study destinations and understand what each option offers.",
  },
  {
    icon: Building2,
    title: "Discover Universities",
    description:
      "Explore universities and programs that match your academic goals.",
  },
  {
    icon: BookOpen,
    title: "Find the Right Course",
    description:
      "Understand courses, degrees and career-focused study options.",
  },
  {
    icon: CircleDollarSign,
    title: "Understand Costs",
    description:
      "Compare tuition, living expenses and other important study costs.",
  },
  {
    icon: FileCheck2,
    title: "Understand Requirements",
    description:
      "Learn about admission requirements and application considerations.",
  },
  {
    icon: GraduationCap,
    title: "Plan Your Journey",
    description:
      "Move from exploration to a structured international education plan.",
  },
];

export default function StudyAbroadFeatures() {
  return (
    <section id="explore" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Everything you need to start exploring
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Build a clearer picture of your international education
            options before making your next decision.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}