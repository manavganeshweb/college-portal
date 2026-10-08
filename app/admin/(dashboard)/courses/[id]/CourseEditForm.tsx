"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Course = {
  id: string;
  name: string;
  shortName: string | null;
  slug: string;
  degree: string | null;
  level: string;
  description: string | null;
  durationYears: number | null;
  eligibility: string | null;
  averageFees: number | null;
  careerOptions: string | null;
  categoryId: string;
  status: string;
};

type CourseEditFormProps = {
  course: Course;
  categories: Category[];
  navigationItems: NavigationItem[];
};
type NavigationItem = {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

export default function CourseEditForm({
  course,
  categories,
  navigationItems: initialNavigationItems,
}: CourseEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [navigationItems, setNavigationItems] =
  useState<NavigationItem[]>(
    initialNavigationItems
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );

const [navigationSaving, setNavigationSaving] =
  useState(false);

const [navigationMessage, setNavigationMessage] =
  useState("");

const [navigationError, setNavigationError] =
  useState("");

  const [form, setForm] = useState({
    name: course.name,
    shortName: course.shortName || "",
    slug: course.slug,
    degree: course.degree || "",
    level: course.level,
    description: course.description || "",
    durationYears:
      course.durationYears !== null
        ? String(course.durationYears)
        : "",
    eligibility: course.eligibility || "",
    averageFees:
      course.averageFees !== null
        ? String(course.averageFees)
        : "",
    careerOptions: course.careerOptions || "",
    categoryId: course.categoryId,
    status: course.status,
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
  const updateNavigationItem = (
  id: string,
  field: keyof NavigationItem,
  value: string | boolean
) => {
  setNavigationItems((items) =>
    items.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]: value,
          }
        : item
    )
  );
};

const moveNavigationItem = (
  index: number,
  direction: "up" | "down"
) => {
  setNavigationItems((items) => {
    const newItems = [...items];

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= newItems.length
    ) {
      return items;
    }

    [
      newItems[index],
      newItems[targetIndex],
    ] = [
      newItems[targetIndex],
      newItems[index],
    ];

    return newItems.map((item, itemIndex) => ({
      ...item,
      sortOrder: itemIndex + 1,
    }));
  });
};

const removeNavigationItem = (id: string) => {
  setNavigationItems((items) =>
    items
      .filter((item) => item.id !== id)
      .map((item, index) => ({
        ...item,
        sortOrder: index + 1,
      }))
  );
};

const addNavigationItem = () => {
  const newItem: NavigationItem = {
    id: `new-${Date.now()}`,
    title: "New Section",
    slug: "new-section",
    sortOrder: navigationItems.length + 1,
    isActive: true,
  };

  setNavigationItems((items) => [
    ...items,
    newItem,
  ]);
};

const saveNavigationItems = async () => {
  setNavigationSaving(true);
  setNavigationMessage("");
  setNavigationError("");

  try {
    const response = await fetch(
      `/admin/api/admin/courses/${course.id}/navigation`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          navigationItems:
            navigationItems.map((item, index) => ({
              title: item.title.trim(),
              slug: item.slug.trim().toLowerCase(),
              sortOrder: index + 1,
              isActive: item.isActive,
            })),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error ||
          "Failed to update course navigation"
      );
    }

    setNavigationItems(result.data);

    setNavigationMessage(
      "Course navigation updated successfully."
    );
  } catch (err) {
    setNavigationError(
      err instanceof Error
        ? err.message
        : "Failed to update course navigation"
    );
  } finally {
    setNavigationSaving(false);
  }
};

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/admin/api/admin/courses/${course.id}`,
        {
          method: "PUT",
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
          result.error || "Failed to update course"
        );
      }

      setMessage(
        "Course updated successfully."
      );
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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.name}"? This will also remove its college mappings.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/admin/api/admin/courses/${course.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to delete course"
        );
      }

      window.location.href = "/admin/courses";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete course"
      );

      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Course Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Course Name *
              </label>

              <input
                required
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Short Name
              </label>

              <input
                value={form.shortName}
                onChange={(event) =>
                  updateField(
                    "shortName",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Degree
              </label>

              <input
                value={form.degree}
                onChange={(event) =>
                  updateField(
                    "degree",
                    event.target.value
                  )
                }
                placeholder="e.g. B.Tech"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug *
              </label>

              <input
                required
                value={form.slug}
                onChange={(event) =>
                  updateField(
                    "slug",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>
        </section>

        {/* Classification */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Classification
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Level *
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
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

        {/* Details */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Details
          </h2>

          <div className="mt-6 space-y-5">
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
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

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
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

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
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>
        </section>

        {/* Course Navigation */}
<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">
        Course Navigation
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Manage the sections displayed in the course page
        navigation.
      </p>
    </div>

    <button
      type="button"
      onClick={addNavigationItem}
      disabled={navigationSaving}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Plus className="h-4 w-4" />
      Add Section
    </button>
  </div>

  {navigationMessage && (
    <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <CheckCircle2 className="h-4 w-4" />
      {navigationMessage}
    </div>
  )}

  {navigationError && (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {navigationError}
    </div>
  )}

  {navigationItems.length === 0 ? (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-medium text-slate-700">
        No navigation sections yet
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Add sections such as Overview, Eligibility,
        Admission, Fees, Placements, and more.
      </p>
    </div>
  ) : (
    <div className="mt-6 space-y-3">
      {navigationItems.map((item, index) => (
        <div
          key={item.id}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            {/* Position */}
            <div className="flex shrink-0 items-center gap-2 lg:pt-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                {index + 1}
              </span>

              <div className="flex lg:flex-col">
                <button
                  type="button"
                  onClick={() =>
                    moveNavigationItem(index, "up")
                  }
                  disabled={
                    index === 0 || navigationSaving
                  }
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Move section up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    moveNavigationItem(index, "down")
                  }
                  disabled={
                    index ===
                      navigationItems.length - 1 ||
                    navigationSaving
                  }
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Move section down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Title
                </label>

                <input
                  value={item.title}
                  onChange={(event) =>
                    updateNavigationItem(
                      item.id,
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Overview"
                  disabled={navigationSaving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Slug
                </label>

                <input
                  value={item.slug}
                  onChange={(event) =>
                    updateNavigationItem(
                      item.id,
                      "slug",
                      event.target.value
                    )
                  }
                  placeholder="e.g. overview"
                  disabled={navigationSaving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 lg:pt-7">
              <button
                type="button"
                onClick={() =>
                  updateNavigationItem(
                    item.id,
                    "isActive",
                    !item.isActive
                  )
                }
                disabled={navigationSaving}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  item.isActive
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                }`}
              >
                {item.isActive
                  ? "Visible"
                  : "Hidden"}
              </button>

              <button
                type="button"
                onClick={() =>
                  removeNavigationItem(item.id)
                }
                disabled={navigationSaving}
                className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Delete section"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
    </div>
    
  )}

  <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
    <button
      type="button"
      onClick={saveNavigationItems}
      disabled={navigationSaving}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {navigationSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving Navigation...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          Save Navigation
        </>
      )}
    </button>
  </div>
</section>

        {/* Status */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Status
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                updateField("status", "ACTIVE")
              }
              className={`rounded-xl border p-4 text-left ${
                form.status === "ACTIVE"
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200"
              }`}
            >
              <p className="font-medium text-slate-900">
                Active
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Visible on the public platform
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                updateField("status", "INACTIVE")
              }
              className={`rounded-xl border p-4 text-left ${
                form.status === "INACTIVE"
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200"
              }`}
            >
              <p className="font-medium text-slate-900">
                Inactive
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Hidden from the public platform
              </p>
            </button>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            {deleting
              ? "Deleting..."
              : "Delete Course"}
          </button>

          <button
            type="submit"
            disabled={loading || deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}