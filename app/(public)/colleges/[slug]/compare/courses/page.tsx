"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  GitCompareArrows,
} from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "college-aadhar-course-compare";

type CompareCourse = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
};

type CourseData = {
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
  careerOptions: string | null;
  createdAt: string;
  updatedAt: string;

  category: {
    id: string;
    name: string;
    slug: string;
  };

  collegeCount: number;
  minimumCollegeFee: number | null;
  maximumCollegeFee: number | null;
  totalSeats: number | null;

  colleges: {
    id: string;
    fees: number | null;
    seats: number | null;
    duration: number | null;

    college: {
      id: string;
      name: string;
      slug: string;
      shortName: string | null;
      logo: string | null;
      collegeType: string;
      verified: boolean;
      establishedYear: number | null;

      state: {
        name: string;
      };

      city: {
        name: string;
      };
    };
  }[];
};

export default function CourseComparePage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComparison = async () => {
      try {
        const stored = localStorage.getItem(
          STORAGE_KEY
        );

        if (!stored) {
          setError(
            "No courses selected for comparison."
          );
          setLoading(false);
          return;
        }

        const selected: CompareCourse[] =
          JSON.parse(stored);

        const ids = selected.map(
          (course) => course.id
        );

        if (ids.length < 3) {
          setError(
            "Please select at least 3 courses to compare."
          );
          setLoading(false);
          return;
        }

        if (ids.length > 4) {
          setError(
            "You can compare a maximum of 4 courses."
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/courses/compare?ids=${ids.join(",")}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load course comparison."
          );
        }

        /*
         * Keep the same order in which
         * the user selected the courses.
         */
        const orderedCourses = ids
          .map((id) =>
            result.data.find(
              (course: CourseData) =>
                course.id === id
            )
          )
          .filter(Boolean);

        setCourses(orderedCourses);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load comparison."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || courses.length < 3) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <GitCompareArrows className="h-7 w-7" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Select courses to compare
            </h1>

            <p className="mt-3 text-slate-500">
              {error ||
                "Please select at least three courses."}
            </p>

            <Link
              href="/courses"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Explore Courses
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <GitCompareArrows className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Compare Courses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Compare course details, fees, duration,
                colleges and career opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div
            className="min-w-[1180px]"
            style={{
              display: "grid",
              gridTemplateColumns: `220px repeat(${courses.length}, minmax(280px, 1fr))`,
            }}
          >
            {/* Header row */}
            <div className="border-b border-r border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Course
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-700">
                Comparison
              </p>
            </div>

            {courses.map((course) => (
              <CourseHeader
                key={course.id}
                course={course}
              />
            ))}

            {/* Basic */}
            <ComparisonSection
              title="Basic Information"
              columns={courses.length}
            />

            <ComparisonRow
              label="Degree"
              courses={courses}
              render={(course) =>
                course.degree || "—"
              }
            />

            <ComparisonRow
              label="Level"
              courses={courses}
              render={(course) =>
                formatLevel(course.level)
              }
            />

            <ComparisonRow
              label="Category"
              courses={courses}
              render={(course) =>
                course.category.name
              }
            />

            <ComparisonRow
              label="Duration"
              courses={courses}
              render={(course) =>
                course.durationYears !== null
                  ? `${course.durationYears} ${
                      course.durationYears === 1
                        ? "Year"
                        : "Years"
                    }`
                  : "—"
              }
            />

            {/* Fees */}
            <ComparisonSection
              title="Fees"
              columns={courses.length}
            />

            <ComparisonRow
              label="Average Course Fee"
              courses={courses}
              render={(course) =>
                formatCurrency(
                  course.averageFees
                )
              }
            />

            <ComparisonRow
              label="Minimum College Fee"
              courses={courses}
              render={(course) =>
                formatCurrency(
                  course.minimumCollegeFee
                )
              }
            />

            <ComparisonRow
              label="Maximum College Fee"
              courses={courses}
              render={(course) =>
                formatCurrency(
                  course.maximumCollegeFee
                )
              }
            />

            {/* Colleges */}
            <ComparisonSection
              title="Colleges"
              columns={courses.length}
            />

            <ComparisonRow
              label="Colleges Offering"
              courses={courses}
              render={(course) =>
                `${course.collegeCount} ${
                  course.collegeCount === 1
                    ? "college"
                    : "colleges"
                }`
              }
            />

            <ComparisonRow
              label="Total Seats"
              courses={courses}
              render={(course) =>
                course.totalSeats !== null
                  ? course.totalSeats.toLocaleString(
                      "en-IN"
                    )
                  : "—"
              }
            />

            {/* Eligibility */}
            <ComparisonSection
              title="Eligibility"
              columns={courses.length}
            />

            <ComparisonRow
              label="Eligibility"
              courses={courses}
              render={(course) =>
                course.eligibility || "Not available"
              }
            />

            {/* Career */}
            <ComparisonSection
              title="Career"
              columns={courses.length}
            />

            <ComparisonRow
              label="Career Options"
              courses={courses}
              render={(course) =>
                course.careerOptions ||
                "Not available"
              }
            />

            {/* Top Colleges */}
            <ComparisonSection
              title="Popular Colleges"
              columns={courses.length}
            />

            <ComparisonRow
              label="Available Colleges"
              courses={courses}
              render={(course) => (
                <div className="space-y-2 text-left">
                  {course.colleges
                    .slice(0, 5)
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={`/colleges/${item.college.slug}`}
                        className="group flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-emerald-50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                          {item.college.logo ? (
                            <Image
                              src={
                                item.college.logo
                              }
                              alt=""
                              width={32}
                              height={32}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-[9px] font-bold text-emerald-600">
                              {getInitials(
                                item.college.name
                              )}
                            </span>
                          )}
                        </div>

                        <span className="line-clamp-2 text-xs font-medium text-slate-700 group-hover:text-emerald-700">
                          {item.college.name}
                        </span>
                      </Link>
                    ))}

                  {course.colleges.length > 5 && (
                    <p className="text-xs text-slate-400">
                      +{course.colleges.length - 5} more
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------------------------------- */
/* Course Header */
/* ---------------------------------- */

function CourseHeader({
  course,
}: {
  course: CourseData;
}) {
  return (
    <div className="border-b border-slate-200 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <GitCompareArrows className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            {formatLevel(course.level)}
          </span>

          <h2 className="mt-2 line-clamp-2 text-base font-bold text-slate-900">
            {course.name}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {course.category.name}
          </p>

          <Link
            href={`/courses/${course.category.slug}/${course.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View Course
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Section */
/* ---------------------------------- */

function ComparisonSection({
  title,
  columns,
}: {
  title: string;
  columns: number;
}) {
  return (
    <>
      <div className="border-b border-r border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          {title}
        </h2>
      </div>

      <div
        className="border-b border-slate-200 bg-slate-50"
        style={{
          gridColumn: `span ${columns}`,
        }}
      />
    </>
  );
}

/* ---------------------------------- */
/* Row */
/* ---------------------------------- */

function ComparisonRow({
  label,
  courses,
  render,
}: {
  label: string;
  courses: CourseData[];
  render: (
    course: CourseData
  ) => React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-r border-slate-100 bg-white px-5 py-4 text-sm font-semibold text-slate-600">
        {label}
      </div>

      {courses.map((course) => (
        <div
          key={course.id}
          className="border-b border-r border-slate-100 px-5 py-4 text-center text-sm leading-6 text-slate-700 last:border-r-0"
        >
          {render(course)}
        </div>
      ))}
    </>
  );
}

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

function formatLevel(level: string) {
  switch (level) {
    case "UG":
      return "Undergraduate";

    case "PG":
      return "Postgraduate";

    case "DIPLOMA":
      return "Diploma";

    case "PHD":
      return "PhD";

    case "CERTIFICATE":
      return "Certificate";

    default:
      return level;
  }
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return "—";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="h-10 w-72 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="grid grid-cols-4">
            {Array.from({ length: 12 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse border-b border-r border-slate-100 bg-slate-50"
                />
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}