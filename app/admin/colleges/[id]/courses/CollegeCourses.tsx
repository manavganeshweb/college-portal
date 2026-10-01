"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock3,
  IndianRupee,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

type CollegeCourse = {
  id: string;
  fees: number | null;
  seats: number | null;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    degree: string | null;
    level: string;
    status: string;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
};

type CollegeCoursesProps = {
  collegeId: string;
};

function formatFees(value: number | null) {
  if (value === null) return "Not specified";

  return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

function formatDuration(value: number | null) {
  if (value === null) return "Not specified";

  return `${value} ${value === 1 ? "Year" : "Years"}`;
}

function formatLevel(level: string) {
  const levels: Record<string, string> = {
    UG: "Undergraduate",
    PG: "Postgraduate",
    DIPLOMA: "Diploma",
    PHD: "PhD",
    CERTIFICATE: "Certificate",
  };

  return levels[level] ?? level;
}

export default function CollegeCourses({
  collegeId,
}: CollegeCoursesProps) {
  const [courses, setCourses] = useState<CollegeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCourses() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/colleges/${collegeId}/courses`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      setCourses(data.courses);
    } catch (error) {
      console.error("Fetch college courses error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, [collegeId]);

  async function handleDelete(courseRelationId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this course from the college?"
    );

    if (!confirmed) return;

    // Delete API will be added in the next step.
    console.log("Remove college course:", courseRelationId);
  }

  return (
    <section className="mt-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Courses Offered
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage the courses offered by this college.
          </p>
        </div>

        <Link
          href={`/admin/colleges/${collegeId}/courses/add`}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading courses...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchCourses}
            className="mt-3 text-sm font-semibold text-red-700 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && courses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <BookOpen className="h-5 w-5 text-emerald-600" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-900">
            No courses added yet
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Add the courses offered by this college along with
            their fees, seats, and duration.
          </p>

          <Link
            href={`/admin/colleges/${collegeId}/courses/add`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add First Course
          </Link>
        </div>
      )}

      {/* Course cards */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {courses.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">
                    {item.course.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {item.course.shortName && (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        {item.course.shortName}
                      </span>
                    )}

                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      {formatLevel(item.course.level)}
                    </span>

                    {item.course.category && (
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {item.course.category.name}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.course.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.course.status}
                </span>
              </div>

              {/* Details */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <IndianRupee className="h-4 w-4" />

                    <span className="text-xs font-medium">
                      Fees
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatFees(item.fees)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="h-4 w-4" />

                    <span className="text-xs font-medium">
                      Seats
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {item.seats ?? "Not specified"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock3 className="h-4 w-4" />

                    <span className="text-xs font-medium">
                      Duration
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatDuration(item.duration)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <Link
                  href={`/courses/${item.course.slug}`}
                  target="_blank"
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  View Course
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/colleges/${collegeId}/courses/${item.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}