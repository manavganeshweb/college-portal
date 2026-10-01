"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  HeartPulse,
  Scale,
} from "lucide-react";

type CoursePreview = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
};

type TopCoursesCardProps = {
  courses: CoursePreview[];
};

const courseIcons = [
  GraduationCap,
  BriefcaseBusiness,
  HeartPulse,
  Code2,
  Scale,
];

export default function TopCoursesCard({
  courses,
}: TopCoursesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Top Courses
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Find the best courses for your dream career.
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="mt-4">
          {courses.slice(0, 5).map((course, index) => {
            const Icon =
              courseIcons[index % courseIcons.length];

            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-b-0"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
                  <Icon className="h-3.5 w-3.5" />
                </span>

                <span className="flex-1 truncate text-xs font-medium text-slate-700 transition group-hover:text-emerald-700">
                  {course.shortName || course.name}
                </span>

                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-6 text-center">
          <p className="text-xs text-slate-500">
            Courses will appear here once they are available.
          </p>
        </div>
      )}

      <Link
        href="/courses"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
      >
        View All Courses
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}