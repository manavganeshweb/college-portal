"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ExamData = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  description: string | null;
  conductingBody: string | null;
  examType: string | null;
  eligibility: string | null;
  applicationFee: number | null;
  website: string | null;
};

type Props = {
  exam: ExamData;
};

export default function ExamEditForm({ exam }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: exam.name,
    slug: exam.slug,
    shortName: exam.shortName ?? "",
    description: exam.description ?? "",
    conductingBody: exam.conductingBody ?? "",
    examType: exam.examType ?? "",
    eligibility: exam.eligibility ?? "",
    applicationFee:
      exam.applicationFee !== null
        ? String(exam.applicationFee)
        : "",
    website: exam.website ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.name.trim() || !form.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }

    if (
      form.applicationFee &&
      (Number.isNaN(Number(form.applicationFee)) ||
        Number(form.applicationFee) < 0)
    ) {
      setError("Application fee must be a valid non-negative number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/admin/api/admin/exams/${exam.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            slug: form.slug.trim(),
            shortName: form.shortName.trim() || null,
            description: form.description.trim() || null,
            conductingBody: form.conductingBody.trim() || null,
            examType: form.examType.trim() || null,
            eligibility: form.eligibility.trim() || null,
            applicationFee: form.applicationFee
              ? Number(form.applicationFee)
              : null,
            website: form.website.trim() || null,
          }),
        }
      );

      const result: {
        success?: boolean;
        error?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update exam.");
      }

      setMessage("Exam updated successfully.");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${exam.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/admin/api/admin/exams/${exam.id}`,
        {
          method: "DELETE",
        }
      );

      const result: {
        success?: boolean;
        error?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete exam.");
      }

      router.push("/admin/exams");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete exam."
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

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Exam Name *
            </label>

            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="shortName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Short Name
            </label>

            <input
              id="shortName"
              name="shortName"
              value={form.shortName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Slug *
            </label>

            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Exam Details
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="conductingBody"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Conducting Body
            </label>

            <input
              id="conductingBody"
              name="conductingBody"
              value={form.conductingBody}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="examType"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Exam Type
            </label>

            <input
              id="examType"
              name="examType"
              value={form.examType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="applicationFee"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Application Fee
            </label>

            <input
              id="applicationFee"
              name="applicationFee"
              type="number"
              min="0"
              step="0.01"
              value={form.applicationFee}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Official Website
            </label>

            <input
              id="website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="eligibility"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Eligibility
            </label>

            <textarea
              id="eligibility"
              name="eligibility"
              rows={4}
              value={form.eligibility}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              value={form.description}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting || loading}
          className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Exam"}
        </button>

        <button
          type="submit"
          disabled={loading || deleting}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}