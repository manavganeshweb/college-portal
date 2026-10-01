
"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
} from "lucide-react";

import CourseCompareButton from "./CourseCompareButton";

type CourseCardProps = {
  course: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    degree: string | null;
    level: string;
    description: string | null;
    durationYears: number | null;
    eligibility: string | null;
    averageFees: number | null;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    _count: {
      colleges: number;
    };
  };
};

function formatFees(value: number | null) {
  if (value === null) {
    return "Fees not available";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatLevel(level: string) {
  return level.replace("_", " ");
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-100">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/30 blur-2xl" />

        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
          <GraduationCap size={24} />
        </div>

        <div className="absolute bottom-4 left-5">
          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
            {formatLevel(course.level)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="mb-1 text-sm font-medium text-emerald-600">
          {course.category.name}
        </p>

        <h2 className="line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
          {course.name}
        </h2>

        {course.degree && (
          <p className="mt-1 text-sm text-slate-500">
            {course.degree}
          </p>
        )}

        {course.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
            {course.description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <Clock
              size={16}
              className="text-emerald-600"
            />

            <div>
              <p className="text-xs text-slate-400">
                Duration
              </p>

              <p className="text-sm font-medium text-slate-700">
                {course.durationYears
                  ? `${course.durationYears} Years`
                  : "Varies"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen
              size={16}
              className="text-emerald-600"
            />

            <div>
              <p className="text-xs text-slate-400">
                Colleges
              </p>

              <p className="text-sm font-medium text-slate-700">
                {course._count.colleges}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400">
              Average Fees
            </p>

            <p className="text-sm font-bold text-slate-800">
              {formatFees(course.averageFees)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/courses/${course.category.slug}/${course.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              Explore
              <ArrowRight size={15} />
            </Link>

            <CourseCompareButton
              course={{
                id: course.id,
                name: course.name,
                slug: course.slug,
                shortName: course.shortName,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}