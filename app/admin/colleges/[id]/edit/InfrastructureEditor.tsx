"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  GraduationCap,
  Hospital,
  Library,
  Loader2,
  Plus,
  Save,
  Trash2,
  Utensils,
  Wifi,
  X,
} from "lucide-react";

type FacilityKey =
  | "hostel"
  | "library"
  | "laboratories"
  | "sports"
  | "cafeteria"
  | "auditorium"
  | "medical"
  | "wifi"
  | "itInfrastructure"
  | "transportation"
  | "gym";

type Facility = {
  id?: string;
  name: string;
  description: string;
  available: boolean;
  sortOrder: number;
  isActive: boolean;
};

type InfrastructureData = {
  id?: string;
  campusArea: string;
  campusType: string;
  description: string;

  hostel: boolean;
  library: boolean;
  laboratories: boolean;
  sports: boolean;
  cafeteria: boolean;
  auditorium: boolean;
  medical: boolean;
  wifi: boolean;
  itInfrastructure: boolean;
  transportation: boolean;
  gym: boolean;

  otherFacilities: string;
  facilities: Facility[];
};

type InfrastructureEditorProps = {
  collegeId: string;
};

type StandardFacility = {
  key: FacilityKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const STANDARD_FACILITIES: StandardFacility[] = [
  {
    key: "hostel",
    label: "Hostel",
    description: "On-campus residential facilities for students",
    icon: Building2,
  },
  {
    key: "library",
    label: "Library",
    description: "Central and departmental library facilities",
    icon: Library,
  },
  {
    key: "laboratories",
    label: "Laboratories",
    description: "Academic and practical laboratories",
    icon: GraduationCap,
  },
  {
    key: "sports",
    label: "Sports",
    description: "Indoor and outdoor sports facilities",
    icon: Dumbbell,
  },
  {
    key: "cafeteria",
    label: "Cafeteria",
    description: "Food and refreshment facilities",
    icon: Utensils,
  },
  {
    key: "auditorium",
    label: "Auditorium",
    description: "Auditorium and event facilities",
    icon: Building2,
  },
  {
    key: "medical",
    label: "Medical Facility",
    description: "Medical and first-aid facilities",
    icon: Hospital,
  },
  {
    key: "wifi",
    label: "Wi-Fi",
    description: "Campus-wide internet connectivity",
    icon: Wifi,
  },
  {
    key: "itInfrastructure",
    label: "IT Infrastructure",
    description: "Computing and technology infrastructure",
    icon: GraduationCap,
  },
  {
    key: "transportation",
    label: "Transportation",
    description: "College transportation facilities",
    icon: Building2,
  },
  {
    key: "gym",
    label: "Gym",
    description: "Fitness and gym facilities",
    icon: Dumbbell,
  },
];

const EMPTY_DATA: InfrastructureData = {
  campusArea: "",
  campusType: "",
  description: "",

  hostel: false,
  library: false,
  laboratories: false,
  sports: false,
  cafeteria: false,
  auditorium: false,
  medical: false,
  wifi: false,
  itInfrastructure: false,
  transportation: false,
  gym: false,

  otherFacilities: "",
  facilities: [],
};

export default function InfrastructureEditor({
  collegeId,
}: InfrastructureEditorProps) {
  const [data, setData] = useState<InfrastructureData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCustomFacilities, setShowCustomFacilities] = useState(true);

  useEffect(() => {
    void loadInfrastructure();
  }, [collegeId]);

  async function loadInfrastructure() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/admin/api/admin/colleges/${collegeId}/infrastructure`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: {
        success?: boolean;
        infrastructure?: Partial<InfrastructureData> | null;
        message?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load infrastructure"
        );
      }

      if (!result.infrastructure) {
        setData(EMPTY_DATA);
        return;
      }

      const infrastructure = result.infrastructure;

      setData({
        campusArea: infrastructure.campusArea ?? "",
        campusType: infrastructure.campusType ?? "",
        description: infrastructure.description ?? "",

        hostel: infrastructure.hostel ?? false,
        library: infrastructure.library ?? false,
        laboratories: infrastructure.laboratories ?? false,
        sports: infrastructure.sports ?? false,
        cafeteria: infrastructure.cafeteria ?? false,
        auditorium: infrastructure.auditorium ?? false,
        medical: infrastructure.medical ?? false,
        wifi: infrastructure.wifi ?? false,
        itInfrastructure: infrastructure.itInfrastructure ?? false,
        transportation: infrastructure.transportation ?? false,
        gym: infrastructure.gym ?? false,

        otherFacilities: infrastructure.otherFacilities ?? "",
        facilities: (infrastructure.facilities ?? []).map(
          (facility) => ({
            id: facility.id,
            name: facility.name ?? "",
            description: facility.description ?? "",
            available: facility.available ?? true,
            sortOrder: facility.sortOrder ?? 0,
            isActive: facility.isActive ?? true,
          })
        ),
      });
    } catch (err) {
      console.error("Load infrastructure error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load infrastructure"
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof InfrastructureData>(
    field: K,
    value: InfrastructureData[K]
  ) {
    setData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  function toggleStandardFacility(key: FacilityKey) {
    setData((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    setMessage("");
    setError("");
  }

  function addFacility() {
    setData((previous) => ({
      ...previous,
      facilities: [
        ...previous.facilities,
        {
          name: "",
          description: "",
          available: true,
          sortOrder: previous.facilities.length + 1,
          isActive: true,
        },
      ],
    }));

    setShowCustomFacilities(true);
  }

  function updateFacility(
    index: number,
    field: keyof Facility,
    value: string | boolean | number
  ) {
    setData((previous) => ({
      ...previous,
      facilities: previous.facilities.map((facility, facilityIndex) =>
        facilityIndex === index
          ? {
              ...facility,
              [field]: value,
            }
          : facility
      ),
    }));

    setMessage("");
    setError("");
  }

  function removeFacility(index: number) {
    setData((previous) => ({
      ...previous,
      facilities: previous.facilities
        .filter((_, facilityIndex) => facilityIndex !== index)
        .map((facility, facilityIndex) => ({
          ...facility,
          sortOrder: facilityIndex + 1,
        })),
    }));
  }

  function moveFacility(index: number, direction: "up" | "down") {
    setData((previous) => {
      const facilities = [...previous.facilities];

      const newIndex =
        direction === "up" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= facilities.length) {
        return previous;
      }

      [facilities[index], facilities[newIndex]] = [
        facilities[newIndex],
        facilities[index],
      ];

      return {
        ...previous,
        facilities: facilities.map((facility, facilityIndex) => ({
          ...facility,
          sortOrder: facilityIndex + 1,
        })),
      };
    });
  }

  async function saveInfrastructure() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        campusArea: data.campusArea.trim() || null,
        campusType: data.campusType.trim() || null,
        description: data.description.trim() || null,

        hostel: data.hostel,
        library: data.library,
        laboratories: data.laboratories,
        sports: data.sports,
        cafeteria: data.cafeteria,
        auditorium: data.auditorium,
        medical: data.medical,
        wifi: data.wifi,
        itInfrastructure: data.itInfrastructure,
        transportation: data.transportation,
        gym: data.gym,

        otherFacilities: data.otherFacilities.trim() || null,

        facilities: data.facilities.map((facility, index) => ({
          name: facility.name.trim(),
          description: facility.description.trim() || null,
          available: facility.available,
          sortOrder: index + 1,
          isActive: facility.isActive,
        })),
      };

      const response = await fetch(
        `/admin/api/admin/colleges/${collegeId}/infrastructure`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save infrastructure"
        );
      }

      setMessage("Infrastructure saved successfully.");
      await loadInfrastructure();
    } catch (err) {
      console.error("Save infrastructure error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save infrastructure"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2
            size={20}
            className="animate-spin text-[#15945c]"
          />
          Loading infrastructure...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Building2
                size={22}
                className="text-[#15945c]"
              />

              <h2 className="text-xl font-semibold text-gray-900">
                Infrastructure
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              Manage campus information, standard facilities and
              additional infrastructure available at the college.
            </p>
          </div>

          <button
            type="button"
            onClick={saveInfrastructure}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117b4c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {saving ? "Saving..." : "Save Infrastructure"}
          </button>
        </div>

        {message && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <Check size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X size={17} />
            {error}
          </div>
        )}
      </div>

      {/* Campus Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900">
            Campus Information
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add basic information about the college campus.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="campusArea"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Campus Area
            </label>

            <input
              id="campusArea"
              type="text"
              value={data.campusArea}
              onChange={(event) =>
                updateField("campusArea", event.target.value)
              }
              placeholder="e.g. 150 Acres"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
            />
          </div>

          <div>
            <label
              htmlFor="campusType"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Campus Type
            </label>

            <select
              id="campusType"
              value={data.campusType}
              onChange={(event) =>
                updateField("campusType", event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
            >
              <option value="">Select campus type</option>
              <option value="Urban">Urban</option>
              <option value="Rural">Rural</option>
              <option value="Suburban">Suburban</option>
              <option value="Residential">Residential</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="infrastructureDescription"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Infrastructure Description
            </label>

            <textarea
              id="infrastructureDescription"
              rows={5}
              value={data.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe the overall infrastructure and campus facilities..."
              className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
            />
          </div>
        </div>
      </div>

      {/* Standard Facilities */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900">
            Standard Facilities
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Select the facilities available at this college.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STANDARD_FACILITIES.map((facility) => {
            const Icon = facility.icon;
            const enabled = data[facility.key];

            return (
              <button
                key={facility.key}
                type="button"
                onClick={() =>
                  toggleStandardFacility(facility.key)
                }
                className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                  enabled
                    ? "border-[#15945c] bg-[#15945c]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    enabled
                      ? "bg-[#15945c] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {facility.label}
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        enabled
                          ? "border-[#15945c] bg-[#15945c] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {enabled && <Check size={13} />}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {facility.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Other Facilities */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900">
            Other Facilities
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add additional infrastructure information that is not
            covered by the standard facilities.
          </p>
        </div>

        <textarea
          rows={4}
          value={data.otherFacilities}
          onChange={(event) =>
            updateField("otherFacilities", event.target.value)
          }
          placeholder="e.g. Bank, ATM, stationery shop, student activity centre..."
          className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
        />
      </div>

      {/* Custom Facilities */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() =>
            setShowCustomFacilities((previous) => !previous)
          }
          className="flex w-full items-center justify-between p-6 text-left"
        >
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Custom Facilities
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add detailed facilities with their own descriptions
              and status.
            </p>
          </div>

          {showCustomFacilities ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>

        {showCustomFacilities && (
          <div className="border-t border-gray-100 p-6">
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={addFacility}
                className="inline-flex items-center gap-2 rounded-xl border border-[#15945c] px-4 py-2.5 text-sm font-semibold text-[#15945c] transition hover:bg-[#15945c] hover:text-white"
              >
                <Plus size={17} />
                Add Facility
              </button>
            </div>

            {data.facilities.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center">
                <Building2
                  size={28}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No custom facilities added
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Click &quot;Add Facility&quot; to create one.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.facilities.map((facility, index) => (
                  <div
                    key={facility.id ?? `facility-${index}`}
                    className="rounded-xl border border-gray-200 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#15945c]/10 text-xs font-semibold text-[#15945c]">
                          {index + 1}
                        </span>

                        <span className="text-sm font-semibold text-gray-800">
                          Facility
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            moveFacility(index, "up")
                          }
                          disabled={index === 0}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Move facility up"
                        >
                          <ChevronUp size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveFacility(index, "down")
                          }
                          disabled={
                            index === data.facilities.length - 1
                          }
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Move facility down"
                        >
                          <ChevronDown size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFacility(index)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                          aria-label="Remove facility"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Facility Name
                        </label>

                        <input
                          type="text"
                          value={facility.name}
                          onChange={(event) =>
                            updateFacility(
                              index,
                              "name",
                              event.target.value
                            )
                          }
                          placeholder="e.g. Central Computer Centre"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Description
                        </label>

                        <input
                          type="text"
                          value={facility.description}
                          onChange={(event) =>
                            updateFacility(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                          placeholder="Brief facility description"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateFacility(
                            index,
                            "available",
                            !facility.available
                          )
                        }
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          facility.available
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                        }`}
                      >
                        {facility.available ? (
                          <Check size={14} />
                        ) : (
                          <X size={14} />
                        )}

                        {facility.available
                          ? "Available"
                          : "Unavailable"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateFacility(
                            index,
                            "isActive",
                            !facility.isActive
                          )
                        }
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          facility.isActive
                            ? "border-[#15945c]/20 bg-[#15945c]/5 text-[#15945c]"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                        }`}
                      >
                        {facility.isActive ? (
                          <Check size={14} />
                        ) : (
                          <X size={14} />
                        )}

                        {facility.isActive
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    {/* Bottom Save */}
<div className="flex justify-end">
  <button
    type="button"
    onClick={saveInfrastructure}
    disabled={saving}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15945c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#117b4c] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {saving ? (
      <Loader2 size={18} className="animate-spin" />
    ) : (
      <Save size={18} />
    )}

    {saving ? "Saving..." : "Save Infrastructure"}
  </button>
</div>
    </section>
  );
}