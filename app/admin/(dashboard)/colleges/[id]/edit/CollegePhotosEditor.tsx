"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

type CollegePhoto = {
  id?: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
};

type CollegePhotosEditorProps = {
  collegeId: string;
};

const PHOTO_CATEGORIES = [
  "CAMPUS",
  "LIBRARY",
  "HOSTEL",
  "LABORATORY",
  "SPORTS",
  "AUDITORIUM",
  "CAFETERIA",
  "CLASSROOM",
  "OTHER",
];

const EMPTY_PHOTO: CollegePhoto = {
  imageUrl: "",
  title: "",
  description: "",
  category: "CAMPUS",
  sortOrder: 1,
  isActive: true,
};

export default function CollegePhotosEditor({
  collegeId,
}: CollegePhotosEditorProps) {
  const [photos, setPhotos] = useState<CollegePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadPhotos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/admin/api/admin/colleges/${collegeId}/photos`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = (await response.json()) as {
          success?: boolean;
          message?: string;
          photos?: CollegePhoto[];
        };

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load photos");
        }

        setPhotos(result.photos ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load photos"
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPhotos();
  }, [collegeId]);

  function addPhoto() {
    setPhotos((current) => [
      ...current,
      {
        ...EMPTY_PHOTO,
        sortOrder: current.length + 1,
      },
    ]);

    setSuccess("");
  }

  function updatePhoto(
    index: number,
    field: keyof CollegePhoto,
    value: string | boolean | number
  ) {
    setPhotos((current) =>
      current.map((photo, photoIndex) =>
        photoIndex === index
          ? {
              ...photo,
              [field]: value,
            }
          : photo
      )
    );

    setSuccess("");
  }

  function removePhoto(index: number) {
    setPhotos((current) =>
      current
        .filter((_, photoIndex) => photoIndex !== index)
        .map((photo, photoIndex) => ({
          ...photo,
          sortOrder: photoIndex + 1,
        }))
    );

    setSuccess("");
  }

  function movePhoto(index: number, direction: "up" | "down") {
    setPhotos((current) => {
      const newPhotos = [...current];

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= newPhotos.length) {
        return current;
      }

      [newPhotos[index], newPhotos[targetIndex]] = [
        newPhotos[targetIndex],
        newPhotos[index],
      ];

      return newPhotos.map((photo, photoIndex) => ({
        ...photo,
        sortOrder: photoIndex + 1,
      }));
    });

    setSuccess("");
  }

  async function savePhotos() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        photos: photos.map((photo, index) => ({
          imageUrl: photo.imageUrl.trim(),
          title: photo.title.trim() || null,
          description: photo.description.trim() || null,
          category: photo.category.trim() || null,
          sortOrder: index + 1,
          isActive: photo.isActive,
        })),
      };

      const response = await fetch(
        `/admin/api/admin/colleges/${collegeId}/photos`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        photos?: CollegePhoto[];
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save photos");
      }

      setPhotos(result.photos ?? []);
      setSuccess("College photos saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save photos"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading college photos...
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <Camera
                className="h-5 w-5"
                style={{ color: "#15945c" }}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                College Photos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage campus and facility photos displayed on the college
                page.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={addPhoto}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-green-200 hover:bg-green-50"
          >
            <ImagePlus className="h-4 w-4" />
            Add Photo
          </button>

          <button
            type="button"
            onClick={() => void savePhotos()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "#15945c" }}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Photos"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div className="px-6 pt-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && !error && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {photos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
              <Camera
                className="h-7 w-7"
                style={{ color: "#15945c" }}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No college photos yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
              Add campus, library, hostel, laboratory, sports and other
              college photos.
            </p>

            <button
              type="button"
              onClick={addPhoto}
              className="mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: "#15945c" }}
            >
              <ImagePlus className="h-4 w-4" />
              Add First Photo
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {photos.map((photo, index) => (
              <div
                key={photo.id ?? `new-photo-${index}`}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row">
                  {/* Preview */}
                  <div className="w-full shrink-0 lg:w-56">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white">
                      {photo.imageUrl ? (
                        <img
                          src={photo.imageUrl}
                          alt={photo.title || "College photo"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-400">
                          <Camera className="h-8 w-8" />
                          <span className="mt-2 text-xs">
                            Image preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-semibold text-gray-600 shadow-sm">
                          {index + 1}
                        </span>

                        <span className="text-sm font-semibold text-gray-900">
                          Photo {index + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => movePhoto(index, "up")}
                          disabled={index === 0}
                          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => movePhoto(index, "down")}
                          disabled={index === photos.length - 1}
                          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="rounded-lg border border-red-200 bg-white p-2 text-red-500 transition hover:bg-red-50"
                          title="Remove photo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Image URL */}
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Image URL
                        </label>

                        <input
                          type="url"
                          value={photo.imageUrl}
                          onChange={(event) =>
                            updatePhoto(
                              index,
                              "imageUrl",
                              event.target.value
                            )
                          }
                          placeholder="https://example.com/campus.jpg"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                      </div>

                      {/* Title */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Title
                        </label>

                        <input
                          type="text"
                          value={photo.title}
                          onChange={(event) =>
                            updatePhoto(
                              index,
                              "title",
                              event.target.value
                            )
                          }
                          placeholder="Main Campus"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Category
                        </label>

                        <select
                          value={photo.category}
                          onChange={(event) =>
                            updatePhoto(
                              index,
                              "category",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        >
                          {PHOTO_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Description
                        </label>

                        <textarea
                          value={photo.description}
                          onChange={(event) =>
                            updatePhoto(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                          placeholder="Describe this college facility or campus area..."
                          rows={3}
                          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                    </div>

                    {/* Active */}
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Display this photo
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Inactive photos will not appear on the public
                          college page.
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={photo.isActive}
                        onClick={() =>
                          updatePhoto(
                            index,
                            "isActive",
                            !photo.isActive
                          )
                        }
                        className="relative h-6 w-11 rounded-full transition"
                        style={{
                          backgroundColor: photo.isActive
                            ? "#15945c"
                            : "#d1d5db",
                        }}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            photo.isActive
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom save */}
      {photos.length > 0 && (
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={() => void savePhotos()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "#15945c" }}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Photos"}
          </button>
        </div>
      )}
    </section>
  );
}