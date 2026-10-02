"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  GripVertical,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import InfrastructureEditor from "./InfrastructureEditor";
import CollegePhotosEditor from "./CollegePhotosEditor";
import { CollegeType } from "@/src/generated/prisma/enums";
type City = {
  id: string;
  name: string;
};

type State = {
  id: string;
  name: string;
  cities: City[];
};

type NavigationItem = {
  id: string;
  label: string;
  slug: string;
  sectionId: string;
  sortOrder: number;
  isActive: boolean;
};

type College = {
  id: string;
  name: string;
  shortName: string | null;
  slug: string;
  description: string | null;

  establishedYear: number | null;
  collegeType: CollegeType;

  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;

  stateId: string;
  cityId: string | null;

  logo: string | null;
  coverImage: string | null;

  verified: boolean;
  status: "ACTIVE" | "INACTIVE";

  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;

  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;

  navigationItems?: NavigationItem[];
};

type Props = {
  college: College;
  states: State[];
};

const DEFAULT_NAVIGATION_ITEMS: Omit<
  NavigationItem,
  "id"
>[] = [
  {
    label: "Overview",
    slug: "overview",
    sectionId: "overview",
    sortOrder: 1,
    isActive: true,
  },
  {
    label: "Courses & Fees",
    slug: "courses-fees",
    sectionId: "courses-fees",
    sortOrder: 2,
    isActive: true,
  },
  {
    label: "Admission",
    slug: "admission",
    sectionId: "admission",
    sortOrder: 3,
    isActive: true,
  },
  {
    label: "Placements",
    slug: "placements",
    sectionId: "placements",
    sortOrder: 4,
    isActive: true,
  },
  {
    label: "Cut-off",
    slug: "cutoff",
    sectionId: "cutoff",
    sortOrder: 5,
    isActive: true,
  },
  {
    label: "Rankings",
    slug: "rankings",
    sectionId: "rankings",
    sortOrder: 6,
    isActive: true,
  },
  {
    label: "Infrastructure",
    slug: "infrastructure",
    sectionId: "infrastructure",
    sortOrder: 7,
    isActive: true,
  },
  {
    label: "Faculty",
    slug: "faculty",
    sectionId: "faculty",
    sortOrder: 8,
    isActive: true,
  },
  {
    label: "Reviews",
    slug: "reviews",
    sectionId: "reviews",
    sortOrder: 9,
    isActive: true,
  },
  {
    label: "Q&A",
    slug: "qna",
    sectionId: "qna",
    sortOrder: 10,
    isActive: true,
  },
];

export default function CollegeEditForm({
  college,
  states,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: college.name,
    shortName: college.shortName ?? "",
    slug: college.slug,
    description: college.description ?? "",

    establishedYear: college.establishedYear
      ? String(college.establishedYear)
      : "",

    collegeType: college.collegeType,

    website: college.website ?? "",
    email: college.email ?? "",
    phone: college.phone ?? "",
    address: college.address ?? "",

    stateId: college.stateId,
    cityId: college.cityId ?? "",

    logo: college.logo ?? "",
    coverImage: college.coverImage ?? "",

    verified: college.verified,
    status: college.status,

    seoTitle: college.seoTitle ?? "",
    seoDescription: college.seoDescription ?? "",
    seoKeywords: college.seoKeywords ?? "",

    canonicalUrl: college.canonicalUrl ?? "",
    ogTitle: college.ogTitle ?? "",
    ogDescription: college.ogDescription ?? "",
    ogImage: college.ogImage ?? "",
  });

  const [navigationItems, setNavigationItems] =
    useState<NavigationItem[]>(() => {
      if (
        college.navigationItems &&
        college.navigationItems.length > 0
      ) {
        return [...college.navigationItems].sort(
          (a, b) => a.sortOrder - b.sortOrder
        );
      }

      return DEFAULT_NAVIGATION_ITEMS.map(
        (item, index) => ({
          ...item,
          id: `new-${item.slug}-${index}`,
          sortOrder: index + 1,
        })
      );
    });

  const [loading, setLoading] = useState(false);
  const [navigationLoading, setNavigationLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedState = useMemo(
    () =>
      states.find(
        (state) => state.id === form.stateId
      ),
    [states, form.stateId]
  );

  const cities = selectedState?.cities ?? [];

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleStateChange(stateId: string) {
    const state = states.find(
      (item) => item.id === stateId
    );

    const firstCity = state?.cities[0];

    setForm((previous) => ({
      ...previous,
      stateId,
      cityId: firstCity?.id ?? "",
    }));
  }

  function updateNavigationItem(
    id: string,
    field: keyof NavigationItem,
    value: string | number | boolean
  ) {
    setNavigationItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function moveNavigationItem(
    index: number,
    direction: "up" | "down"
  ) {
    setNavigationItems((previous) => {
      const next = [...previous];

      const targetIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= next.length
      ) {
        return previous;
      }

      [
        next[index],
        next[targetIndex],
      ] = [
        next[targetIndex],
        next[index],
      ];

      return next.map((item, itemIndex) => ({
        ...item,
        sortOrder: itemIndex + 1,
      }));
    });
  }

  function removeNavigationItem(id: string) {
    setNavigationItems((previous) =>
      previous
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          sortOrder: index + 1,
        }))
    );
  }

  function addNavigationItem() {
    const nextOrder =
      navigationItems.length + 1;

    const newItem: NavigationItem = {
      id: `new-navigation-${Date.now()}`,
      label: `New Section ${nextOrder}`,
      slug: `new-section-${nextOrder}`,
      sectionId: `new-section-${nextOrder}`,
      sortOrder: nextOrder,
      isActive: true,
    };

    setNavigationItems((previous) => [
      ...previous,
      newItem,
    ]);
  }

 async function saveNavigationItems() {
  setNavigationLoading(true);

  try {
    const payload = {
      navigationItems: navigationItems.map((item, index) => ({
        label: item.label.trim(),
        slug: item.slug.trim().toLowerCase(),
        sectionId: item.sectionId.trim(),
        sortOrder: index + 1,
        isActive: item.isActive,
      })),
    };

    console.log("🟡 SAVING NAVIGATION");
    console.log("URL:", `/admin/api/admin/colleges/${college.id}/navigation`);
    console.log("Payload:", payload);

    const response = await fetch(
      `/admin/api/admin/colleges/${college.id}/navigation`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log("🟢 NAVIGATION RESPONSE STATUS:", response.status);
    console.log("🟢 NAVIGATION RESPONSE:", result);

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to update navigation items."
      );
    }

    if (Array.isArray(result.data)) {
      setNavigationItems(result.data);
    }

    return true;
  } catch (error) {
    console.error("❌ NAVIGATION UPDATE ERROR:", error);
    throw error;
  } finally {
    setNavigationLoading(false);
  }
}
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("College name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!form.stateId) {
      setError("State is required.");
      return;
    }

    if (!form.cityId) {
      setError("City is required.");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "🟢 SAVING COLLEGE:",
        college.id
      );

      /*
       * =====================================================
       * 1. SAVE NORMAL COLLEGE FIELDS
       * =====================================================
       */

      const collegeResponse = await fetch(
        `/api/admin/colleges/${college.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),

            shortName:
              form.shortName.trim() || null,

            slug: form.slug.trim(),

            description:
              form.description.trim() || null,

            establishedYear:
              form.establishedYear
                ? Number(form.establishedYear)
                : null,

            collegeType: form.collegeType,

            website:
              form.website.trim() || null,

            email:
              form.email.trim() || null,

            phone:
              form.phone.trim() || null,

            address:
              form.address.trim() || null,

            stateId: form.stateId,

            cityId: form.cityId,

            logo:
              form.logo.trim() || null,

            coverImage:
              form.coverImage.trim() || null,

            verified: form.verified,

            status: form.status,

            seoTitle:
              form.seoTitle.trim() || null,

            seoDescription:
              form.seoDescription.trim() || null,

            seoKeywords:
              form.seoKeywords.trim() || null,

            canonicalUrl:
              form.canonicalUrl.trim() || null,

            ogTitle:
              form.ogTitle.trim() || null,

            ogDescription:
              form.ogDescription.trim() || null,

            ogImage:
              form.ogImage.trim() || null,
          }),
        }
      );

      const collegeResult =
        await collegeResponse.json();

      console.log(
        "🟢 COLLEGE RESPONSE:",
        collegeResult
      );

      if (
        !collegeResponse.ok ||
        !collegeResult.success
      ) {
        throw new Error(
          collegeResult.message ||
            "Failed to update college."
        );
      }

      /*
       * =====================================================
       * 2. SAVE NAVIGATION ITEMS
       * =====================================================
       */

      await saveNavigationItems();

      /*
       * =====================================================
       * 3. EVERYTHING SAVED
       * =====================================================
       */

      setSuccess(
        "College and navigation updated successfully."
      );

      router.refresh();

      setTimeout(() => {
        router.push(
          `/admin/colleges/${college.id}`
        );
      }, 700);
    } catch (error) {
      console.error(
        "❌ COLLEGE UPDATE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const isSaving =
    loading || navigationLoading;

  return (
    <div className="min-h-screen bg-[#f7faf8]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/colleges/${college.id}`
                  )
                }
                className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#15945c]"
              >
                <ArrowLeft size={16} />
                Back to College
              </button>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Edit College
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Update college information,
                navigation and SEO settings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/colleges/${college.id}`
                  )
                }
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="college-edit-form"
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#117a4b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <Check size={17} />
            {success}
          </div>
        )}

        <form
          id="college-edit-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic information about the college.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              {/* College Name */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  College Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Enter college name"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* Short Name */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                  placeholder="e.g. LPU"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* Slug */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Slug
                </label>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      event.target.value
                    )
                  }
                  placeholder="college-slug"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* Description */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  rows={6}
                  placeholder="Enter college description"
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* Established Year */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Established Year
                </label>

                <input
                  type="number"
                  value={form.establishedYear}
                  onChange={(event) =>
                    updateField(
                      "establishedYear",
                      event.target.value
                    )
                  }
                  placeholder="e.g. 2005"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* College Type */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  College Type
                </label>

                <select
                  value={form.collegeType}
                  onChange={(event) =>
                    updateField(
                      "collegeType",
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
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
            </div>
          </section>

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                Contact Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                College website and contact details.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                  placeholder="https://example.com"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
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
                  placeholder="admissions@example.com"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone
                </label>

                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="+91..."
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address
                </label>

                <input
                  type="text"
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="College address"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              LOCATION
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                Location
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select the state and city of the
                college.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  State
                </label>

                <select
                  value={form.stateId}
                  onChange={(event) =>
                    handleStateChange(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                >
                  <option value="">
                    Select state
                  </option>

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
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  City
                </label>

                <select
                  value={form.cityId ?? ""}
                  onChange={(event) =>
                    updateField(
                      "cityId",
                      event.target.value
                    )
                  }
                  disabled={!form.stateId}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  <option value="">
                    Select city
                  </option>

                  {cities.map((city) => (
                    <option
                      key={city.id}
                      value={city.id ?? ""}
                    >
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* =================================================
              MEDIA
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                Media
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                College logo and cover image URLs.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Logo URL
                </label>

                <input
                  type="text"
                  value={form.logo}
                  onChange={(event) =>
                    updateField(
                      "logo",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Cover Image URL
                </label>

                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(event) =>
                    updateField(
                      "coverImage",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              COLLEGE NAVIGATION
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  College Navigation
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage the sections shown on the
                  public college page.
                </p>
              </div>

              <button
                type="button"
                onClick={addNavigationItem}
                disabled={isSaving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#15945c]/30 bg-[#15945c]/5 px-4 text-sm font-semibold text-[#15945c] transition hover:bg-[#15945c]/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                Add Section
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {navigationItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
                  <p className="text-sm font-medium text-gray-600">
                    No navigation items.
                  </p>

                  <button
                    type="button"
                    onClick={addNavigationItem}
                    className="mt-3 text-sm font-semibold text-[#15945c] hover:underline"
                  >
                    Add navigation item
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {navigationItems.map(
                    (item, index) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 transition hover:border-[#15945c]/30"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                          {/* Drag / Order */}

                          <div className="flex items-center gap-3 lg:w-32">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400">
                              <GripVertical
                                size={18}
                              />
                            </div>

                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                Order
                              </p>

                              <p className="text-sm font-bold text-gray-900">
                                #{index + 1}
                              </p>
                            </div>
                          </div>

                          {/* Fields */}

                          <div className="grid flex-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Label */}

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                Label
                              </label>

                              <input
                                type="text"
                                value={item.label}
                                onChange={(
                                  event
                                ) =>
                                  updateNavigationItem(
                                    item.id,
                                    "label",
                                    event.target
                                      .value
                                  )
                                }
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                              />
                            </div>

                            {/* Slug */}

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                Slug
                              </label>

                              <input
                                type="text"
                                value={item.slug}
                                onChange={(
                                  event
                                ) =>
                                  updateNavigationItem(
                                    item.id,
                                    "slug",
                                    event.target
                                      .value
                                  )
                                }
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                              />
                            </div>

                            {/* Section ID */}

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                Section ID
                              </label>

                              <input
                                type="text"
                                value={
                                  item.sectionId
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateNavigationItem(
                                    item.id,
                                    "sectionId",
                                    event.target
                                      .value
                                  )
                                }
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                              />
                            </div>

                            {/* Active */}

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                                Visibility
                              </label>

                              <button
                                type="button"
                                onClick={() =>
                                  updateNavigationItem(
                                    item.id,
                                    "isActive",
                                    !item.isActive
                                  )
                                }
                                className={`flex h-10 w-full items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                                  item.isActive
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-gray-200 bg-white text-gray-500"
                                }`}
                              >
                                {item.isActive
                                  ? "Visible"
                                  : "Hidden"}
                              </button>
                            </div>
                          </div>

                          {/* Controls */}

                          <div className="flex items-center gap-2 lg:pt-6">
                            <button
                              type="button"
                              onClick={() =>
                                moveNavigationItem(
                                  index,
                                  "up"
                                )
                              }
                              disabled={
                                index === 0 ||
                                isSaving
                              }
                              title="Move up"
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-[#15945c]/30 hover:text-[#15945c] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ArrowUp
                                size={17}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                moveNavigationItem(
                                  index,
                                  "down"
                                )
                              }
                              disabled={
                                index ===
                                  navigationItems.length -
                                    1 ||
                                isSaving
                              }
                              title="Move down"
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-[#15945c]/30 hover:text-[#15945c] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ArrowDown
                                size={17}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeNavigationItem(
                                  item.id
                                )
                              }
                              disabled={isSaving}
                              title="Delete"
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2
                                size={17}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Navigation Save Status */}

              {navigationLoading && (
                <div className="mt-4 rounded-xl bg-[#15945c]/5 px-4 py-3 text-sm font-medium text-[#15945c]">
                  Saving navigation...
                </div>
              )}
            </div>
          </section>
{/* =================================================
    INFRASTRUCTURE
================================================= */}

<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
    <h2 className="text-lg font-bold text-gray-900">
      Infrastructure
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Manage campus facilities, amenities and other infrastructure details.
    </p>
  </div>

  <div className="p-5 sm:p-6">
    <InfrastructureEditor collegeId={college.id} />
  </div>
</section>
          {/* =================================================
              PUBLISHING
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                Publishing
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Control the college visibility and
                verification status.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              {/* Status */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Verified */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Verification
                </label>

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "verified",
                      !form.verified
                    )
                  }
                  className={`flex h-11 w-full items-center justify-between rounded-xl border px-4 text-sm font-semibold transition ${
                    form.verified
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  <span>
                    {form.verified
                      ? "Verified College"
                      : "Not Verified"}
                  </span>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      form.verified
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {form.verified && (
                      <Check size={14} />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* =================================================
              SEO
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                SEO
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search engine and social sharing
                metadata.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              {/* SEO Title */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  SEO Title
                </label>

                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(event) =>
                    updateField(
                      "seoTitle",
                      event.target.value
                    )
                  }
                  placeholder="SEO title"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* SEO Description */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  SEO Description
                </label>

                <textarea
                  value={form.seoDescription}
                  onChange={(event) =>
                    updateField(
                      "seoDescription",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="SEO description"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* Keywords */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  SEO Keywords
                </label>

                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(event) =>
                    updateField(
                      "seoKeywords",
                      event.target.value
                    )
                  }
                  placeholder="college, university, courses, admission"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* Canonical */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Canonical URL
                </label>

                <input
                  type="text"
                  value={form.canonicalUrl}
                  onChange={(event) =>
                    updateField(
                      "canonicalUrl",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* OG Title */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  OG Title
                </label>

                <input
                  type="text"
                  value={form.ogTitle}
                  onChange={(event) =>
                    updateField(
                      "ogTitle",
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* OG Image */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  OG Image
                </label>

                <input
                  type="text"
                  value={form.ogImage}
                  onChange={(event) =>
                    updateField(
                      "ogImage",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>

              {/* OG Description */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  OG Description
                </label>

                <textarea
                  value={form.ogDescription}
                  onChange={(event) =>
                    updateField(
                      "ogDescription",
                      event.target.value
                    )
                  }
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#15945c] focus:ring-4 focus:ring-[#15945c]/10"
                />
              </div>
            </div>
          </section>


<CollegePhotosEditor collegeId={college.id} />

          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Ready to save?
              </p>

              <p className="mt-1 text-xs text-gray-500">
                College information and navigation
                items will be saved together.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/colleges/${college.id}`
                  )
                }
                disabled={isSaving}
                className="h-11 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-6 text-sm font-semibold text-white hover:bg-[#117a4b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}