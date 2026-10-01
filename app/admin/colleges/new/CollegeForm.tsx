"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  Loader2,
} from "lucide-react";

type City = {
  id: string;
  name: string;
  slug: string;
};

type State = {
  id: string;
  name: string;
  slug: string;
  cities: City[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  states: State[];
  categories: Category[];
};

export default function CollegeForm({
  states,
  categories,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedState, setSelectedState] = useState("");

  const [form, setForm] = useState({
    name: "",
    shortName: "",
    slug: "",
    description: "",
    establishedYear: "",
    collegeType: "PRIVATE",
    website: "",
    email: "",
    phone: "",
    address: "",
    stateId: "",
    cityId: "",
    logo: "",
    coverImage: "",
    verified: false,
    seoTitle: "",
    seoDescription: "",
  });

  const cities = useMemo(() => {
    const state = states.find(
      (item) => item.id === selectedState
    );

    return state?.cities ?? [];
  }, [states, selectedState]);

  function updateField(
    field: string,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleStateChange(stateId: string) {
    setSelectedState(stateId);

    setForm((previous) => ({
      ...previous,
      stateId,
      cityId: "",
    }));
  }

  function generateSlug() {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    updateField("slug", slug);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/colleges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          establishedYear: form.establishedYear
            ? Number(form.establishedYear)
            : null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create college"
        );
      }

      setSuccess("College created successfully.");

      if (result.data?.id) {
        window.location.href = `/admin/colleges/${result.data.id}`;
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Basic Information
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Main information displayed on the college profile.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              College Name *
            </label>

            <input
              required
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="e.g. Maharshi Dayanand University"
              className="form-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
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
              placeholder="e.g. MDU"
              className="form-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Slug *
            </label>

            <div className="flex gap-2">
              <input
                required
                value={form.slug}
                onChange={(event) =>
                  updateField(
                    "slug",
                    event.target.value
                  )
                }
                placeholder="maharshi-dayanand-university"
                className="form-input"
              />

              <button
                type="button"
                onClick={generateSlug}
                className="shrink-0 rounded-xl border border-gray-200 px-3 text-xs font-semibold text-gray-600 hover:border-[#15945c] hover:text-[#15945c]"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              College Type *
            </label>

            <select
              required
              value={form.collegeType}
              onChange={(event) =>
                updateField(
                  "collegeType",
                  event.target.value
                )
              }
              className="form-input"
            >
              <option value="GOVERNMENT">
                Government
              </option>
              <option value="PRIVATE">
                Private
              </option>
              <option value="PUBLIC">
                Public
              </option>
              <option value="DEEMED">
                Deemed
              </option>
              <option value="AUTONOMOUS">
                Autonomous
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Established Year
            </label>

            <input
              type="number"
              min="1000"
              max={new Date().getFullYear()}
              value={form.establishedYear}
              onChange={(event) =>
                updateField(
                  "establishedYear",
                  event.target.value
                )
              }
              placeholder="e.g. 1976"
              className="form-input"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
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
              placeholder="Write a clear description of the college..."
              className="form-input resize-y"
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Location
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Select the state first, then choose its city.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              State *
            </label>

            <select
              required
              value={selectedState}
              onChange={(event) =>
                handleStateChange(event.target.value)
              }
              className="form-input"
            >
              <option value="">Select state</option>

              {states.map((state) => (
                <option
                  key={state.id}
                  value={state.id}
                >
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              City *
            </label>

            <select
              required
              value={form.cityId}
              disabled={!selectedState}
              onChange={(event) =>
                updateField(
                  "cityId",
                  event.target.value
                )
              }
              className="form-input disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {selectedState
                  ? "Select city"
                  : "Select state first"}
              </option>

              {cities.map((city) => (
                <option
                  key={city.id}
                  value={city.id}
                >
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </label>

            <textarea
              rows={3}
              value={form.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              placeholder="Full college address"
              className="form-input resize-y"
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Contact Information
          </h2>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Website
            </label>

            <input
              type="url"
              value={form.website}
              onChange={(event) =>
                updateField(
                  "website",
                  event.target.value
                )
              }
              placeholder="https://example.edu"
              className="form-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value
                )
              }
              placeholder="info@example.edu"
              className="form-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
              placeholder="+91..."
              className="form-input"
            />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Images
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Add public image URLs for now. Secure media
            upload will be added later.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Logo URL
            </label>

            <input
              type="url"
              value={form.logo}
              onChange={(event) =>
                updateField("logo", event.target.value)
              }
              placeholder="/colleges/mdu-logo.jpg"
              className="form-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Cover Image URL
            </label>

            <input
              type="url"
              value={form.coverImage}
              onChange={(event) =>
                updateField(
                  "coverImage",
                  event.target.value
                )
              }
              placeholder="/colleges/mdu.jpg"
              className="form-input"
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            SEO
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Search-engine metadata for the college page.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              SEO Title
            </label>

            <input
              value={form.seoTitle}
              onChange={(event) =>
                updateField(
                  "seoTitle",
                  event.target.value
                )
              }
              placeholder="Maharshi Dayanand University - Courses, Fees & Admissions"
              className="form-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              SEO Description
            </label>

            <textarea
              rows={3}
              value={form.seoDescription}
              onChange={(event) =>
                updateField(
                  "seoDescription",
                  event.target.value
                )
              }
              placeholder="Explore courses, fees, admissions, placements and more..."
              className="form-input resize-y"
            />
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <h2 className="font-semibold text-gray-900">
              Verification
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Mark this college as verified only after the
              information has been checked against a trusted
              source.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "verified",
                !form.verified
              )
            }
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
              form.verified
                ? "border-[#15945c] bg-[#15945c] text-white"
                : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
            aria-label="Toggle verification"
          >
            <Check size={20} />
          </button>
        </div>
      </section>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/colleges"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#117a4b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Creating...
            </>
          ) : (
            <>
              <Building2 size={17} />
              Create College
            </>
          )}
        </button>
      </div>
    </form>
  );
}