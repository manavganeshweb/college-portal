"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  Save,
  Users,
} from "lucide-react";

type CourseOption = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  degree: string | null;
  level: string;
  averageFees: number | null;
  category: {
    id: string;
    name: string;
  } | null;
};

type AddCollegeCourseFormProps = {
  collegeId: string;
  courses: CourseOption[];
};

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

function formatFees(value: number | null) {
  if (value === null) return "Not specified";

  return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

export default function AddCollegeCourseForm({
  collegeId,
  courses,
}: AddCollegeCourseFormProps) {
  const router = useRouter();

  const [courseId, setCourseId] = useState("");
  const [fees, setFees] = useState("");
  const [seats, setSeats] = useState("");
  const [duration, setDuration] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === courseId),
    [courses, courseId]
  );

  function handleCourseChange(value: string) {
    setCourseId(value);
    setError("");

    const course = courses.find((item) => item.id === value);

    if (course?.averageFees !== null && course?.averageFees !== undefined) {
      setFees(String(course.averageFees));
    } else {
      setFees("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!courseId) {
      setError("Please select a course.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/colleges/${collegeId}/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            fees: fees === "" ? null : Number(fees),
            seats: seats === "" ? null : Number(seats),
            duration: duration === "" ? null : Number(duration),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to add course"
        );
      }

      router.push(`/admin/colleges/${collegeId}`);
      router.refresh();
    } catch (error) {
      console.error("Add college course error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to add course"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Course Selection */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Select Course
              </h2>

              <p className="text-xs text-slate-500">
                Choose an existing active course.
              </p>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Course <span className="text-red-500">*</span>
            </span>

            <select
              value={courseId}
              onChange={(event) =>
                handleCourseChange(event.target.value)
              }
              className="form-input"
              required
            >
              <option value="">Select a course</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                  {course.shortName
                    ? ` (${course.shortName})`
                    : ""}
                </option>
              ))}
            </select>
          </label>

          {/* Selected Course Preview */}
          {selectedCourse && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">
                  {selectedCourse.name}
                </span>

                <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-emerald-700">
                  {formatLevel(selectedCourse.level)}
                </span>

                {selectedCourse.category && (
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600">
                    {selectedCourse.category.name}
                  </span>
                )}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Degree
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedCourse.degree || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Course Average Fee
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatFees(selectedCourse.averageFees)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Slug
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-slate-800">
                    {selectedCourse.slug}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* College-specific details */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              College Course Details
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              These values apply specifically to this college.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {/* Fees */}
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <IndianRupee className="h-4 w-4 text-slate-400" />
                Fees
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={fees}
                onChange={(event) => setFees(event.target.value)}
                placeholder="e.g. 125000"
                className="form-input"
              />

              <span className="mt-1 block text-xs text-slate-400">
                Annual or applicable course fee
              </span>
            </label>

            {/* Seats */}
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Users className="h-4 w-4 text-slate-400" />
                Seats
              </span>

              <input
                type="number"
                min="0"
                step="1"
                value={seats}
                onChange={(event) => setSeats(event.target.value)}
                placeholder="e.g. 120"
                className="form-input"
              />

              <span className="mt-1 block text-xs text-slate-400">
                Approved intake for this course
              </span>
            </label>

            {/* Duration */}
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock3 className="h-4 w-4 text-slate-400" />
                Duration
              </span>

              <input
                type="number"
                min="0.1"
                step="0.1"
                value={duration}
                onChange={(event) =>
                  setDuration(event.target.value)
                }
                placeholder="e.g. 4"
                className="form-input"
              />

              <span className="mt-1 block text-xs text-slate-400">
                Duration in years
              </span>
            </label>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-red-700">
                Unable to add course
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              router.push(`/admin/colleges/${collegeId}`)
            }
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !courseId}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding Course...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Add Course
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}