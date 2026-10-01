"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ExamFormData = {
  name: string;
  shortName: string;
  slug: string;
  description: string;
  conductingBody: string;
  examType: string;
  eligibility: string;
  applicationFee: string;
  website: string;
};

const initialForm: ExamFormData = {
  name: "",
  shortName: "",
  slug: "",
  description: "",
  conductingBody: "",
  examType: "",
  eligibility: "",
  applicationFee: "",
  website: "",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ExamForm() {
  const router = useRouter();

  const [form, setForm] = useState<ExamFormData>(initialForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "name" && !slugEdited) {
      setForm((current) => ({
        ...current,
        name: value,
        slug: createSlug(value),
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Exam name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
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

      const response = await fetch("/admin/api/admin/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          shortName: form.shortName.trim() || null,
          slug: form.slug.trim(),
          description: form.description.trim() || null,
          conductingBody: form.conductingBody.trim() || null,
          examType: form.examType.trim() || null,
          eligibility: form.eligibility.trim() || null,
          applicationFee: form.applicationFee
            ? Number(form.applicationFee)
            : null,
          website: form.website.trim() || null,
        }),
      });

      const result: {
        success?: boolean;
        data?: {
          id: string;
        };
        error?: string;
      } = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || "Failed to create exam.");
      }

      router.push(`/admin/exams/${result.data.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter the basic details of the exam.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Exam Name <span className="text-red-500">*</span>
            </label>

            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Joint Entrance Examination"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
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
              placeholder="e.g. JEE Main"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Slug <span className="text-red-500">*</span>
            </label>

            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={(event) => {
                setSlugEdited(true);

                setForm((current) => ({
                  ...current,
                  slug: event.target.value,
                }));
              }}
              placeholder="joint-entrance-examination"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Used for the public exam URL.
            </p>
          </div>
        </div>
      </section>

      {/* Exam Details */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Exam Details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add information students need to understand the exam.
        </p>

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
              placeholder="e.g. National Testing Agency"
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
              placeholder="e.g. Engineering Entrance"
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
              placeholder="e.g. 1000"
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
              placeholder="https://example.com"
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
              value={form.eligibility}
              onChange={handleChange}
              rows={4}
              placeholder="Enter eligibility requirements..."
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
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Write a detailed description about the exam..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/exams"
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Exam"}
        </button>
      </div>
    </form>
  );
}