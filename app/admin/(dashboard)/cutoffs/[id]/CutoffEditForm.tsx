"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Cutoff = {
  id: string;
  collegeId: string;
  examId: string;
  year: number;
  category: string;
  gender: string | null;
  course: string | null;
  openingRank: number | null;
  closingRank: number | null;
};

type Props = {
  cutoff: Cutoff;
};

export default function CutoffEditForm({
  cutoff,
}: Props) {
  const router = useRouter();

  const [year, setYear] = useState(
    cutoff.year.toString()
  );
  const [category, setCategory] = useState(
    cutoff.category
  );
  const [gender, setGender] = useState(
    cutoff.gender ?? ""
  );
  const [course, setCourse] = useState(
    cutoff.course ?? ""
  );
  const [openingRank, setOpeningRank] = useState(
    cutoff.openingRank?.toString() ?? ""
  );
  const [closingRank, setClosingRank] = useState(
    cutoff.closingRank?.toString() ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!year) {
      setError("Year is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/admin/api/admin/exam-cutoffs/${cutoff.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collegeId: cutoff.collegeId,
            examId: cutoff.examId,
            year: Number(year),
            category: category.trim(),
            gender: gender || null,
            course: course.trim() || null,
            openingRank: openingRank
              ? Number(openingRank)
              : null,
            closingRank: closingRank
              ? Number(closingRank)
              : null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update cutoff."
        );
      }

      setSuccess("Cutoff updated successfully.");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this cutoff? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleting(true);

    try {
      const response = await fetch(
        `/admin/api/admin/exam-cutoffs/${cutoff.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete cutoff."
        );
      }

      router.push("/admin/cutoffs");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete cutoff."
      );
      setDeleting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Cutoff
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the cutoff information below.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Year */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Year
            </label>

            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(event) =>
                setYear(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              placeholder="e.g. General, OBC, SC"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Gender
            </label>

            <input
              type="text"
              value={gender}
              onChange={(event) =>
                setGender(event.target.value)
              }
              placeholder="Gender"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Course */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Course
            </label>

            <input
              type="text"
              value={course}
              onChange={(event) =>
                setCourse(event.target.value)
              }
              placeholder="e.g. B.Tech CSE"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Opening Rank */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Opening Rank
            </label>

            <input
              type="number"
              min="0"
              value={openingRank}
              onChange={(event) =>
                setOpeningRank(event.target.value)
              }
              placeholder="e.g. 1200"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Closing Rank */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Closing Rank
            </label>

            <input
              type="number"
              min="0"
              value={closingRank}
              onChange={(event) =>
                setClosingRank(event.target.value)
              }
              placeholder="e.g. 8500"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting || saving}
          className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Cutoff"}
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/cutoffs")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || deleting}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}