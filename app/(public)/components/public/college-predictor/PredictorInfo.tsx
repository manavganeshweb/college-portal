"use client";

import { motion } from "framer-motion";
import {
  Database,
  GitCompare,
  ShieldCheck,
} from "lucide-react";

const items = [
  {
    icon: Database,
    title: "Cutoff-based",
    text: "Predictions are generated from available college cutoff records.",
  },
  {
    icon: GitCompare,
    title: "Compare options",
    text: "See multiple colleges that match the selected criteria.",
  },
  {
    icon: ShieldCheck,
    title: "Use as guidance",
    text: "Predictions are indicative and should be verified with official sources.",
  },
];

export default function PredictorInfo() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <Icon className="h-6 w-6 text-emerald-600" />

                <h3 className="mt-4 font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}