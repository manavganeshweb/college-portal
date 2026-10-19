"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

type CourseCollege = {
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
    collegeType: string | null;
    verified: boolean;
    establishedYear: number | null;
    state: { name: string } | null;
    city: { name: string } | null;
  };
};

type Course = {
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
  } | null;

  collegeCount: number;
  minimumCollegeFee: number | null;
  maximumCollegeFee: number | null;
  totalSeats: number | null;

  colleges: CourseCollege[];
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: Course[];
};

function currency(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function display(value: unknown) {
  return value === null ||
    value === undefined ||
    value === ""
    ? "Not available"
    : String(value);
}

function CourseTable({
  courses,
  rows,
}: {
  courses: Course[];
  rows: {
    label: string;
    value: (course: Course) => React.ReactNode;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-52 border-b border-r border-slate-200 bg-slate-50 px-5 py-4">
              Comparison
            </th>

            {courses.map((course) => (
              <th
                key={course.id}
                className="min-w-[230px] border-b border-r border-slate-200 bg-white px-5 py-4 align-top last:border-r-0"
              >
                <Link
                  href={`/courses/${String(
                    course.level
                  ).toLowerCase()}/${course.slug}`}
                  className="font-bold text-slate-900 hover:text-emerald-700"
                >
                  {course.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={
                index % 2 === 0
                  ? "bg-white"
                  : "bg-[#fafafa]"
              }
            >
              <th className="sticky left-0 z-10 border-b border-r border-slate-200 bg-inherit px-5 py-4 font-medium text-slate-600">
                {row.label}
              </th>

              {courses.map((course) => (
                <td
                  key={course.id}
                  className="border-b border-r border-slate-200 px-5 py-4 align-top text-slate-800 last:border-r-0"
                >
                  {row.value(course)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CompareCoursesPage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ids = Array.from(
    new Set(
      idsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    )
  );

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      setLoading(true);
      setError("");
      setCourses([]);

      if (ids.length < 3 || ids.length > 4) {
        setError(
          "Please select between 3 and 4 courses to compare."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/courses/compare?ids=${encodeURIComponent(
            ids.join(",")
          )}`,
          {
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as ApiResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Unable to load the selected courses."
          );
        }

        if (!result.data || result.data.length !== ids.length) {
          throw new Error(
            "Some selected courses could not be found."
          );
        }

        if (!cancelled) {
          const coursesById = new Map(
            result.data.map((course) => [
              course.id,
              course,
            ])
          );

          setCourses(
            ids
              .map((id) => coursesById.get(id))
              .filter(
                (course): course is Course =>
                  Boolean(course)
              )
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCourses();

    return () => {
      cancelled = true;
    };
  }, [idsParam]);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-20">
        <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Comparing courses
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Fetching your selected course details...
          </p>
        </div>
      </main>
    );
  }

  if (error || courses.length === 0) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-emerald-600" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Unable to compare courses
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error ||
              "Select at least three courses to compare."}
          </p>

          <Link
            href="/compare"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to comparison
          </Link>
        </div>
      </main>
    );
  }

  const sections = [
    {
      title: "Course information",
      icon: <BookOpen className="h-5 w-5" />,
      rows: [
        {
          label: "Degree",
          value: (c: Course) => display(c.degree),
        },
        {
          label: "Level",
          value: (c: Course) => display(c.level),
        },
        {
          label: "Category",
          value: (c: Course) =>
            display(c.category?.name),
        },
        {
          label: "Duration",
          value: (c: Course) =>
            c.durationYears == null
              ? "Not available"
              : `${c.durationYears} years`,
        },
        {
          label: "Eligibility",
          value: (c: Course) => display(c.eligibility),
        },
        {
          label: "Description",
          value: (c: Course) => (
            <p className="max-w-sm leading-6 text-slate-600">
              {c.description
                ? `${c.description.slice(0, 240)}${
                    c.description.length > 240
                      ? "…"
                      : ""
                  }`
                : "Not available"}
            </p>
          ),
        },
        {
          label: "Career options",
          value: (c: Course) => display(c.careerOptions),
        },
      ],
    },
    {
      title: "Fees",
      icon: <Wallet className="h-5 w-5" />,
      rows: [
        {
          label: "Average course fee",
          value: (c: Course) => (
            <span className="font-semibold">
              {currency(c.averageFees)}
            </span>
          ),
        },
        {
          label: "Lowest college-specific fee",
          value: (c: Course) => (
            <span className="font-semibold text-emerald-700">
              {currency(c.minimumCollegeFee)}
            </span>
          ),
        },
        {
          label: "Highest college-specific fee",
          value: (c: Course) =>
            currency(c.maximumCollegeFee),
        },
      ],
    },
    {
      title: "Availability",
      icon: <Building2 className="h-5 w-5" />,
      rows: [
        {
          label: "Colleges offering course",
          value: (c: Course) => (
            <span className="font-semibold">
              {c.collegeCount}
            </span>
          ),
        },
        {
          label: "Total listed seats",
          value: (c: Course) =>
            c.totalSeats == null
              ? "Not available"
              : c.totalSeats.toLocaleString("en-IN"),
        },
        {
          label: "Listed colleges",
          value: (c: Course) =>
            c.colleges.length ? (
              <ul className="space-y-4">
                {c.colleges.slice(0, 12).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/colleges/${item.college.slug}`}
                      className="font-semibold text-slate-800 hover:text-emerald-700"
                    >
                      {item.college.name}
                    </Link>

                    {item.college.verified && (
                      <CheckCircle2 className="ml-1 inline h-3.5 w-3.5 text-emerald-600" />
                    )}

                    <p className="mt-1 text-xs text-slate-500">
                      {[
                        item.college.city?.name,
                        item.college.state?.name,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Location unavailable"}
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">
                      Fees: {currency(item.fees)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Seats: {display(item.seats)}
                    </p>
                  </li>
                ))}

                {c.colleges.length > 12 && (
                  <li className="text-xs text-slate-500">
                    And {c.colleges.length - 12} more colleges
                  </li>
                )}
              </ul>
            ) : (
              "No college listings available"
            ),
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course selection
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              College Aadhar
            </p>

            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Compare Courses
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Compare eligibility, duration, fees, career
              options and colleges offering each course.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
              {courses.length} courses selected
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-900">
                    {course.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {course.category?.name || course.level}
                  </p>

                  <Link
                    href={`/courses/${String(
                      course.level
                    ).toLowerCase()}/${course.slug}`}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    View course details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {sections.map((section) => (
            <section
              key={section.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <span className="text-emerald-700">
                  {section.icon}
                </span>

                <h2 className="font-bold text-slate-900">
                  {section.title}
                </h2>
              </div>

              <CourseTable
                courses={courses}
                rows={section.rows}
              />
            </section>
          ))}
        </div>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Fees, eligibility, seats and duration depend on the
          information available in College Aadhar. Verify
          admission requirements and fees with the institution
          before applying.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Compare other courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}