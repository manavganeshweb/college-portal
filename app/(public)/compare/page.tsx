"use client";

import Link from "next/link";
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  GitCompareArrows,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import CollegeCard from "../components/public/CollegeCard";
import CourseCard from "../components/public/CourseCard";

type CompareType = "college" | "course";

type College = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  coverImage?: string | null;
  shortName?: string | null;
  collegeType?: string | null;
  verified?: boolean;
  establishedYear?: number | null;
  state?: { name: string } | null;
  city?: { name: string } | null;
};
type Course = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  degree?: string | null;
  level?: string | null;
  category?: {
    id?: string;
    name: string;
    slug: string;
  } | null;
};

type CollegeResponse = {
  success: boolean;
  data: {
    data: College[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};;

type CourseResponse = {
  success: boolean;
  data: {
    courses: Course[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const COLLEGE_STORAGE_KEY = "college-aadhar-compare";
const COURSE_STORAGE_KEY = "college-aadhar-course-compare";

const MAX_COMPARE = 4;
const MIN_COMPARE = 3;

export default function ComparePage() {
  const [type, setType] = useState<CompareType>("college");

  const [colleges, setColleges] = useState<College[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [selectedCollegeIds, setSelectedCollegeIds] = useState<string[]>(
    []
  );

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(
    []
  );

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Load existing selections from localStorage.
   *
   * This keeps the page compatible with:
   * - CompareCollegeButton
   * - CourseCompareButton
   * - CompareBar
   * - CourseCompareBar
   */
  useEffect(() => {
    try {
      const storedColleges = localStorage.getItem(
        COLLEGE_STORAGE_KEY
      );

      if (storedColleges) {
        const parsed = JSON.parse(storedColleges) as {
          id: string;
        }[];

        setSelectedCollegeIds(
          parsed.map((college) => college.id)
        );
      }

      const storedCourses = localStorage.getItem(
        COURSE_STORAGE_KEY
      );

      if (storedCourses) {
        const parsed = JSON.parse(storedCourses) as {
          id: string;
        }[];

        setSelectedCourseIds(
          parsed.map((course) => course.id)
        );
      }
    } catch {
      setSelectedCollegeIds([]);
      setSelectedCourseIds([]);
    }
  }, []);

  /*
   * Fetch colleges/courses from the existing listing APIs.
   */
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(page),
          limit: "12",
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const endpoint =
          type === "college"
            ? `/api/colleges?${params.toString()}`
            : `/api/courses?${params.toString()}`;

        const response = await fetch(endpoint, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch comparison data.");
        }

        if (type === "college") {
          const result =
            (await response.json()) as CollegeResponse;

          if (!result.success) {
            throw new Error("Failed to fetch colleges.");
          }
setColleges(result.data.data);
setTotalPages(result.data.pagination.totalPages);
        } else {
          const result =
            (await response.json()) as CourseResponse;

          if (!result.success) {
            throw new Error("Failed to fetch courses.");
          }

          setCourses(result.data.courses);
          setTotalPages(result.data.totalPages);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error(err);
        setError(
          type === "college"
            ? "Failed to load colleges."
            : "Failed to load courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [type, page, search]);

  /*
   * Change between College and Course comparison.
   */
  const changeType = (nextType: CompareType) => {
    setType(nextType);
    setSearch("");
    setPage(1);
    setError("");
  };

  /*
   * College selection.
   */
  const toggleCollege = (college: College) => {
    const exists = selectedCollegeIds.includes(college.id);

    let updated: string[];

    if (exists) {
      updated = selectedCollegeIds.filter(
        (id) => id !== college.id
      );
    } else {
      if (selectedCollegeIds.length >= MAX_COMPARE) {
        return;
      }

      updated = [
        ...selectedCollegeIds,
        college.id,
      ];
    }

    setSelectedCollegeIds(updated);

    /*
     * Keep the same storage structure used by CompareCollegeButton.
     */
    const stored = localStorage.getItem(
      COLLEGE_STORAGE_KEY
    );

    let existing: College[] = [];

    if (stored) {
      try {
        existing = JSON.parse(stored) as College[];
      } catch {
        existing = [];
      }
    }

    if (exists) {
      existing = existing.filter(
        (item) => item.id !== college.id
      );
    } else {
      existing = [...existing, college];
    }

    localStorage.setItem(
      COLLEGE_STORAGE_KEY,
      JSON.stringify(existing)
    );

    window.dispatchEvent(
      new Event("college-compare-updated")
    );
  };

  /*
   * Course selection.
   */
  const toggleCourse = (course: Course) => {
    const exists = selectedCourseIds.includes(course.id);

    let updated: string[];

    if (exists) {
      updated = selectedCourseIds.filter(
        (id) => id !== course.id
      );
    } else {
      if (selectedCourseIds.length >= MAX_COMPARE) {
        return;
      }

      updated = [
        ...selectedCourseIds,
        course.id,
      ];
    }

    setSelectedCourseIds(updated);

    /*
     * Keep the same storage structure used by CourseCompareButton.
     */
    const stored = localStorage.getItem(
      COURSE_STORAGE_KEY
    );

    let existing: Course[] = [];

    if (stored) {
      try {
        existing = JSON.parse(stored) as Course[];
      } catch {
        existing = [];
      }
    }

    if (exists) {
      existing = existing.filter(
        (item) => item.id !== course.id
      );
    } else {
      existing = [...existing, course];
    }

    localStorage.setItem(
      COURSE_STORAGE_KEY,
      JSON.stringify(existing)
    );

    window.dispatchEvent(
      new Event("course-compare-updated")
    );
  };

  /*
   * Clear current comparison selection.
   */
  const clearSelection = () => {
    if (type === "college") {
      localStorage.removeItem(COLLEGE_STORAGE_KEY);

      setSelectedCollegeIds([]);

      window.dispatchEvent(
        new Event("college-compare-updated")
      );
    } else {
      localStorage.removeItem(COURSE_STORAGE_KEY);

      setSelectedCourseIds([]);

      window.dispatchEvent(
        new Event("course-compare-updated")
      );
    }
  };

  const selectedCount =
    type === "college"
      ? selectedCollegeIds.length
      : selectedCourseIds.length;

  const canCompare =
    selectedCount >= MIN_COMPARE &&
    selectedCount <= MAX_COMPARE;

  const compareHref =
    type === "college"
      ? `/compare/colleges?ids=${selectedCollegeIds.join(",")}`
      : `/compare/courses?ids=${selectedCourseIds.join(",")}`;

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <GitCompareArrows className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Compare
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Compare colleges and courses side by side.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => changeType("college")}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                type === "college"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Colleges
            </button>

            <button
              type="button"
              onClick={() => changeType("course")}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                type === "course"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Courses
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Search + selection summary */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {type === "college"
                ? "Select Colleges to Compare"
                : "Select Courses to Compare"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select 3 to 4{" "}
              {type === "college"
                ? "colleges"
                : "courses"}{" "}
              for comparison.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
              {selectedCount}/{MAX_COMPARE} selected
            </div>

            {selectedCount > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-6">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={
                type === "college"
                  ? "Search colleges..."
                  : "Search courses..."
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <LoadingGrid />
        ) : type === "college" ? (
         <CollegeGrid colleges={colleges} />
        ) : (
         <CourseGrid courses={courses} />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm font-medium text-slate-600">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* Bottom comparison action */}
      {selectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-10px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
            <div>
              <p className="text-sm font-bold text-slate-900">
                {selectedCount}{" "}
                {type === "college"
                  ? "colleges"
                  : "courses"}{" "}
                selected
              </p>

              <p className="text-xs text-slate-500">
                {canCompare
                  ? "Ready to compare."
                  : `Select ${
                      MIN_COMPARE - selectedCount
                    } more ${
                      type === "college"
                        ? "college"
                        : "course"
                    }.`}
              </p>
            </div>

            {canCompare ? (
              <Link
                href={compareHref}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <GitCompareArrows className="h-4 w-4" />

                Compare{" "}
                {type === "college"
                  ? "Colleges"
                  : "Courses"}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-xl bg-slate-200 px-5 py-3 text-sm font-bold text-slate-400"
              >
                <GitCompareArrows className="h-4 w-4" />

                Compare{" "}
                {type === "college"
                  ? "Colleges"
                  : "Courses"}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/* ============================================================
   COLLEGE GRID
============================================================ */
function CollegeGrid({
  colleges,
}: {
  colleges: College[];
}) {
  if (colleges.length === 0) {
    return (
      <EmptyState
        title="No colleges found"
        description="Try changing your search."
      />
    );
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {colleges.map((college) => (
        <CollegeCard
          key={college.id}
          college={{
            id: college.id,
            name: college.name,
            slug: college.slug,
            shortName: college.shortName ?? null,
            logo: college.logo,
            coverImage: college.coverImage ?? null,
            collegeType: college.collegeType ?? "College",
            verified: college.verified ?? false,
            establishedYear: college.establishedYear ?? null,
            state: {
              name: college.state?.name ?? "State not available",
            },
            city: college.city
              ? {
                  name: college.city.name,
                }
              : null,
          }}
        />
      ))}
    </div>
  );
}
/* ============================================================
   COURSE GRID
============================================================ */
function CourseGrid({
  courses,
}: {
  courses: Course[];
}) {
  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses found"
        description="Try changing your search."
      />
    );
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={{
            id: course.id,
            name: course.name,
            slug: course.slug,
            shortName: course.shortName,
            degree: course.degree ?? null,
            level: course.level ?? "UG",
            description: null,
            durationYears: null,
            eligibility: null,
            averageFees: null,
            category: {
              id: course.category?.id ?? "",
              name: course.category?.name ?? "General",
              slug: course.category?.slug ?? "general",
            },
            _count: {
              colleges: 0,
            },
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingGrid() {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <GitCompareArrows className="mx-auto h-8 w-8 text-slate-300" />

      <h3 className="mt-4 text-sm font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function getInitials(name: string) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatCollegeType(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatLevel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}