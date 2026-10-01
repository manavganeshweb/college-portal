"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "college-aadhar-course-compare";
const EVENT_NAME = "course-compare-updated";
const MAX_COURSES = 4;

export type CompareCourse = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
};

type CourseCompareButtonProps = {
  course: CompareCourse;
};

export default function CourseCompareButton({
  course,
}: CourseCompareButtonProps) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return;

    try {
      const courses: CompareCourse[] = JSON.parse(stored);

      setSelected(
        courses.some((item) => item.id === course.id)
      );
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [course.id]);

  const toggleCompare = () => {
    const stored = localStorage.getItem(STORAGE_KEY);

    let courses: CompareCourse[] = [];

    if (stored) {
      try {
        courses = JSON.parse(stored);
      } catch {
        courses = [];
      }
    }

    const alreadySelected = courses.some(
      (item) => item.id === course.id
    );

    if (alreadySelected) {
      courses = courses.filter(
        (item) => item.id !== course.id
      );

      setSelected(false);
    } else {
      if (courses.length >= MAX_COURSES) {
        window.dispatchEvent(
          new CustomEvent("course-compare-limit", {
            detail: {
              message:
                "You can compare up to 4 courses at a time.",
            },
          })
        );

        return;
      }

      courses = [...courses, course];

      setSelected(true);
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(courses)
    );

    window.dispatchEvent(new Event(EVENT_NAME));
  };

  return (
    <button
      type="button"
      onClick={toggleCompare}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
        selected
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
      }`}
    >
      {selected ? (
        <>
          <Check className="h-4 w-4" />
          Added to Compare
        </>
      ) : (
        <>
          <GitCompareArrows className="h-4 w-4" />
          Compare
        </>
      )}
    </button>
  );
}