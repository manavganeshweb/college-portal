"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CourseFormProps = {
  categories: Category[];
};

export default function CourseForm({
  categories,
}: CourseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    shortName: "",
    slug: "",
    degree: "",
    level: "UG",
    description: "",
    durationYears: "",
    eligibility: "",
    averageFees: "",
    careerOptions: "",
    categoryId: "",
    status: "ACTIVE",
  });

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    updateField("slug", slug);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/admin/api/admin/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            shortName: form.shortName,
            slug: form.slug,
            degree: form.degree,
            level: form.level,
            description: form.description,
            durationYears: form.durationYears,
            eligibility: form.eligibility,
            averageFees: form.averageFees,
            careerOptions: form.careerOptions,
            categoryId: form.categoryId,
            status: form.status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to create course"
        );
      }

      window.location.href = `/admin/courses/${result.data.id}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/courses"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <BookOpen className="h-5 w-5" />
            </span>

            Add Course
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a new course for the education discovery
            platform.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the basic details students will see about
              this course.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Course Name *
              </label>

              <input
                type="text"
                required
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="e.g. Bachelor of Technology in Computer Science"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Short Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Short Name
              </label>

              <input
                type="text"
                value={form.shortName}
                onChange={(event) =>
                  updateField(
                    "shortName",
                    event.target.value
                  )
                }
                placeholder="e.g. B.Tech CSE"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Degree
              </label>

              <input
                type="text"
                value={form.degree}
                onChange={(event) =>
                  updateField(
                    "degree",
                    event.target.value
                  )
                }
                placeholder="e.g. B.Tech"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug *
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      event.target.value
                    )
                  }
                  placeholder="btech-computer-science-engineering"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={generateSlug}
                  className="rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Course Classification */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Course Classification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define the course category and academic level.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category *
              </label>

              <select
                required
                value={form.categoryId}
                onChange={(event) =>
                  updateField(
                    "categoryId",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Course Level *
              </label>

              <select
                required
                value={form.level}
                onChange={(event) =>
                  updateField(
                    "level",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="UG">
                  Undergraduate (UG)
                </option>

                <option value="PG">
                  Postgraduate (PG)
                </option>

                <option value="DIPLOMA">
                  Diploma
                </option>

                <option value="PHD">
                  PhD
                </option>

                <option value="CERTIFICATE">
                  Certificate
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Course Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Provide information that helps students
              understand the course.
            </p>
          </div>

          <div className="space-y-5">
            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={5}
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the course..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Duration */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Duration (Years)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.durationYears}
                  onChange={(event) =>
                    updateField(
                      "durationYears",
                      event.target.value
                    )
                  }
                  placeholder="e.g. 4"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Average Fees */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Average Fees (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.averageFees}
                  onChange={(event) =>
                    updateField(
                      "averageFees",
                      event.target.value
                    )
                  }
                  placeholder="e.g. 250000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Eligibility
              </label>

              <textarea
                rows={3}
                value={form.eligibility}
                onChange={(event) =>
                  updateField(
                    "eligibility",
                    event.target.value
                  )
                }
                placeholder="e.g. 10+2 with Physics, Chemistry and Mathematics"
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Career Options */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Career Options
              </label>

              <textarea
                rows={3}
                value={form.careerOptions}
                onChange={(event) =>
                  updateField(
                    "careerOptions",
                    event.target.value
                  )
                }
                placeholder="e.g. Software Developer, Data Analyst, Cloud Engineer"
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Publishing
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Control whether this course is visible on
              the platform.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                updateField("status", "ACTIVE")
              }
              className={`rounded-xl border p-4 text-left transition ${
                form.status === "ACTIVE"
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className={`h-5 w-5 ${
                    form.status === "ACTIVE"
                      ? "text-green-600"
                      : "text-slate-400"
                  }`}
                />

                <div>
                  <p className="font-medium text-slate-900">
                    Active
                  </p>

                  <p className="text-xs text-slate-500">
                    Course is available publicly
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                updateField("status", "INACTIVE")
              }
              className={`rounded-xl border p-4 text-left transition ${
                form.status === "INACTIVE"
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-5 w-5 rounded-full border-2 ${
                    form.status === "INACTIVE"
                      ? "border-green-600"
                      : "border-slate-400"
                  }`}
                />

                <div>
                  <p className="font-medium text-slate-900">
                    Inactive
                  </p>

                  <p className="text-xs text-slate-500">
                    Course remains hidden
                  </p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/courses"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                Create Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}