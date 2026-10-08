"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";

type CollegeCourse = {
  id: string;
  fees: number | null;
  seats: number | null;
  duration: number | null;
  course: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    degree: string | null;
    level: string;
    status: string;
    averageFees: number | null;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
};

type Props = {
  collegeId: string;
  collegeCourse: CollegeCourse;
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

function formatCurrency(value: number | null) {
  if (value === null) return "Not available";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CollegeCourseEditForm({
  collegeId,
  collegeCourse,
}: Props) {
  const router = useRouter();

  const [fees, setFees] = useState(
    collegeCourse.fees !== null
      ? String(collegeCourse.fees)
      : ""
  );

  const [seats, setSeats] = useState(
    collegeCourse.seats !== null
      ? String(collegeCourse.seats)
      : ""
  );

  const [duration, setDuration] = useState(
    collegeCourse.duration !== null
      ? String(collegeCourse.duration)
      : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const parsedFees = fees.trim() === "" ? null : Number(fees);
    const parsedSeats = seats.trim() === "" ? null : Number(seats);
    const parsedDuration =
      duration.trim() === "" ? null : Number(duration);

    if (
      parsedFees !== null &&
      (!Number.isFinite(parsedFees) || parsedFees < 0)
    ) {
      setError("Fees must be a valid non-negative number.");
      return;
    }

    if (
      parsedSeats !== null &&
      (!Number.isInteger(parsedSeats) || parsedSeats < 0)
    ) {
      setError("Seats must be a valid non-negative integer.");
      return;
    }

    if (
      parsedDuration !== null &&
      (!Number.isFinite(parsedDuration) || parsedDuration <= 0)
    ) {
      setError("Duration must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/colleges/${collegeId}/courses/${collegeCourse.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fees: parsedFees,
            seats: parsedSeats,
            duration: parsedDuration,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update college course."
        );
      }

      router.push(`/admin/colleges/${collegeId}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Course information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <BookOpen className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {collegeCourse.course.name}
              </h2>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                {collegeCourse.course.status}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>
                {collegeCourse.course.shortName ||
                  collegeCourse.course.degree ||
                  "Course"}
              </span>

              <span>
                {formatLevel(collegeCourse.course.level)}
              </span>

              {collegeCourse.course.category && (
                <span>
                  {collegeCourse.course.category.name}
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-400">
              /courses/{collegeCourse.course.slug}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            College-specific details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            These values apply only to this course at this
            college.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Fees */}
          <div>
            <label
              htmlFor="fees"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Fees
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                ₹
              </span>

              <input
                id="fees"
                type="number"
                min="0"
                step="0.01"
                value={fees}
                onChange={(event) => setFees(event.target.value)}
                placeholder="e.g. 125000"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-8 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {collegeCourse.course.averageFees !== null && (
              <p className="mt-2 text-xs text-gray-400">
                Global average fee:{" "}
                {formatCurrency(
                  collegeCourse.course.averageFees
                )}
              </p>
            )}
          </div>

          {/* Seats */}
          <div>
            <label
              htmlFor="seats"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Seats
            </label>

            <input
              id="seats"
              type="number"
              min="0"
              step="1"
              value={seats}
              onChange={(event) => setSeats(event.target.value)}
              placeholder="e.g. 120"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Duration
            </label>

            <div className="relative">
              <input
                id="duration"
                type="number"
                min="0.1"
                step="0.1"
                value={duration}
                onChange={(event) =>
                  setDuration(event.target.value)
                }
                placeholder="e.g. 4"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                years
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              router.push(`/admin/colleges/${collegeId}`)
            }
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success information */}
      <div className="flex gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

        <div>
          <p className="text-sm font-medium text-green-900">
            Course relationship
          </p>

          <p className="mt-1 text-sm text-green-700">
            Editing these fields changes only this course at
            this college. The global course record remains
            unchanged.
          </p>
        </div>
      </div>
    </div>
  );
}