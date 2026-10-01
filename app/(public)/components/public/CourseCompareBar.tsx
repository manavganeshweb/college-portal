"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  GitCompareArrows,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "college-aadhar-course-compare";
const EVENT_NAME = "course-compare-updated";

type CompareCourse = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
};

export default function CourseCompareBar() {
  const [courses, setCourses] = useState<CompareCourse[]>([]);
  const [visible, setVisible] = useState(false);

  const loadCourses = () => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      setCourses([]);
      setVisible(false);
      return;
    }

    try {
      const parsed: CompareCourse[] = JSON.parse(stored);

      setCourses(parsed);
      setVisible(parsed.length > 0);
    } catch {
      localStorage.removeItem(STORAGE_KEY);

      setCourses([]);
      setVisible(false);
    }
  };

  useEffect(() => {
    loadCourses();

    window.addEventListener(EVENT_NAME, loadCourses);

    return () => {
      window.removeEventListener(EVENT_NAME, loadCourses);
    };
  }, []);

  const removeCourse = (id: string) => {
    const updated = courses.filter(
      (course) => course.id !== id
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    setCourses(updated);
    setVisible(updated.length > 0);

    window.dispatchEvent(new Event(EVENT_NAME));
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);

    setCourses([]);
    setVisible(false);

    window.dispatchEvent(new Event(EVENT_NAME));
  };

  if (!visible) {
    return null;
  }

  const remaining = 3 - courses.length;
  const canCompare = courses.length >= 3;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-10px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex">
              <GitCompareArrows className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Compare Courses
              </p>

              <p className="text-xs text-slate-500">
                {canCompare
                  ? "Your courses are ready to compare."
                  : `Select ${remaining} more ${
                      remaining === 1
                        ? "course"
                        : "courses"
                    } to compare.`}
              </p>
            </div>
          </div>

          {/* Selected courses */}
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 lg:justify-center">
            {courses.map((course) => {
              const initials = course.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={course.id}
                  className="relative flex min-w-[190px] max-w-[230px] shrink-0 items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-white">
                    <span className="text-xs font-bold text-emerald-700">
                      {initials}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {course.name}
                    </p>

                    <p className="text-xs text-emerald-600">
                      Selected
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeCourse(course.id)
                    }
                    aria-label={`Remove ${course.name}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            {/* Empty slots */}
            {Array.from({
              length: Math.max(0, 3 - courses.length),
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="hidden h-[58px] min-w-[150px] shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs font-medium text-slate-400 md:flex"
              >
                Select Course
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              Clear
            </button>

            {canCompare ? (
              <Link
                href="/compare/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" />
                Compare Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-400"
              >
                <GitCompareArrows className="h-4 w-4" />
                Compare Courses
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}