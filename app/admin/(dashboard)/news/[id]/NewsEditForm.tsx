"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Eye,
  FileText,
  Globe2,
  Loader2,
  Save,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";

type NewsType =
  | "EXAM_ALERT"
  | "COLLEGE_ALERT"
  | "ADMISSION_ALERT"
  | "EDUCATION_NEWS"
  | "RESULT"
  | "CAREER";

type ContentStatus = "DRAFT" | "PUBLISHED";

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  type: NewsType;
  sourceName: string | null;
  sourceUrl: string | null;
  publishedAt: string | null;
  status: ContentStatus;
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: string;
  updatedAt: string;
};

const newsTypes: Array<{
  value: NewsType;
  label: string;
}> = [
  {
    value: "EXAM_ALERT",
    label: "Exam Alert",
  },
  {
    value: "COLLEGE_ALERT",
    label: "College Alert",
  },
  {
    value: "ADMISSION_ALERT",
    label: "Admission Alert",
  },
  {
    value: "EDUCATION_NEWS",
    label: "Education News",
  },
  {
    value: "RESULT",
    label: "Result",
  },
  {
    value: "CAREER",
    label: "Career",
  },
];

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}

export default function NewsEditForm({
  article,
}: {
  article: NewsArticle;
}) {
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [excerpt, setExcerpt] = useState(
    article.excerpt ?? "",
  );
  const [content, setContent] = useState(article.content);

  const [coverImage, setCoverImage] = useState(
    article.coverImage ?? "",
  );

  const [type, setType] = useState<NewsType>(article.type);

  const [sourceName, setSourceName] = useState(
    article.sourceName ?? "",
  );

  const [sourceUrl, setSourceUrl] = useState(
    article.sourceUrl ?? "",
  );

  const [seoTitle, setSeoTitle] = useState(
    article.seoTitle ?? "",
  );

  const [seoDescription, setSeoDescription] =
    useState(article.seoDescription ?? "");

  const [seoKeywords, setSeoKeywords] = useState(
    article.seoKeywords ?? "",
  );

  const [isFeatured, setIsFeatured] = useState(
    article.isFeatured,
  );

  const [isTrending, setIsTrending] = useState(
    article.isTrending,
  );

  const [status, setStatus] = useState<ContentStatus>(
    article.status,
  );

  const [publishedAt, setPublishedAt] = useState(
    toDateTimeLocal(article.publishedAt),
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/admin/api/admin/news/${article.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim() || null,
            content,
            coverImage: coverImage.trim() || null,
            type,
            sourceName: sourceName.trim() || null,
            sourceUrl: sourceUrl.trim() || null,
            seoTitle: seoTitle.trim() || null,
            seoDescription:
              seoDescription.trim() || null,
            seoKeywords:
              seoKeywords.trim() || null,
            isFeatured,
            isTrending,
            status,
            publishedAt:
              status === "PUBLISHED"
                ? publishedAt ||
                  new Date().toISOString()
                : null,
          }),
        },
      );

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update article.",
        );
      }

      window.location.reload();
    } catch (err) {
      console.error("Update news error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update article.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this article?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/admin/api/admin/news/${article.id}`,
        {
          method: "DELETE",
        },
      );

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete article.",
        );
      }

      window.location.href = "/admin/news";
    } catch (err) {
      console.error("Delete news error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete article.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/admin/news"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-[#15945c]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">
            Edit News Article
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update article content, SEO and publishing
            settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/news/${article.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            View Article
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#15945c]/10 p-2.5 text-[#15945c]">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Article Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Main article content and details.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <Field label="Title" required>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Slug" required>
                  <input
                    type="text"
                    value={slug}
                    onChange={(event) =>
                      setSlug(event.target.value)
                    }
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    /news/{slug}
                  </p>
                </Field>

                <Field label="Excerpt">
                  <textarea
                    value={excerpt}
                    onChange={(event) =>
                      setExcerpt(event.target.value)
                    }
                    rows={4}
                    className={textareaClass}
                  />
                </Field>

                <Field label="Content" required>
                  <textarea
                    value={content}
                    onChange={(event) =>
                      setContent(event.target.value)
                    }
                    rows={18}
                    className={`${textareaClass} min-h-[400px]`}
                  />
                </Field>
              </div>
            </section>

            {/* Source */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <Globe2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Source
                  </h2>

                  <p className="text-sm text-slate-500">
                    Optional source attribution.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Source Name">
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(event) =>
                      setSourceName(event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Source URL">
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(event) =>
                      setSourceUrl(event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* SEO */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="font-semibold text-slate-900">
                SEO Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search engine metadata for this article.
              </p>

              <div className="mt-5 space-y-5">
                <Field label="SEO Title">
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(event) =>
                      setSeoTitle(event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="SEO Description">
                  <textarea
                    value={seoDescription}
                    onChange={(event) =>
                      setSeoDescription(event.target.value)
                    }
                    rows={3}
                    className={textareaClass}
                  />
                </Field>

                <Field label="SEO Keywords">
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(event) =>
                      setSeoKeywords(event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Publishing */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Publishing
              </h2>

              <div className="mt-5 space-y-5">
                <Field label="Status">
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value as ContentStatus,
                      )
                    }
                    className={inputClass}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">
                      Published
                    </option>
                  </select>
                </Field>

                {status === "PUBLISHED" && (
                  <Field label="Published At">
                    <input
                      type="datetime-local"
                      value={publishedAt}
                      onChange={(event) =>
                        setPublishedAt(
                          event.target.value,
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15945c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#117b4c] disabled:opacity-60"
                >
                  {saving ? (
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
            </section>

            {/* Category */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Category
              </h2>

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as NewsType,
                  )
                }
                className={`${inputClass} mt-4`}
              >
                {newsTypes.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </section>

            {/* Cover image */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Cover Image
              </h2>

              <input
                type="url"
                value={coverImage}
                onChange={(event) =>
                  setCoverImage(event.target.value)
                }
                placeholder="https://..."
                className={`${inputClass} mt-4`}
              />

              {coverImage && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="aspect-video w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              )}
            </section>

            {/* Visibility */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Visibility
              </h2>

              <div className="mt-4 space-y-3">
                <Toggle
                  checked={isFeatured}
                  onChange={setIsFeatured}
                  icon={<Star className="h-4 w-4" />}
                  title="Featured Article"
                  description="Show in featured news."
                />

                <Toggle
                  checked={isTrending}
                  onChange={setIsTrending}
                  icon={
                    <TrendingUp className="h-4 w-4" />
                  }
                  title="Trending Article"
                  description="Show in trending news."
                />
              </div>
            </section>

            {/* Stats */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Article Stats
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Views
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {article.views.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {article.status}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-xs text-slate-400">
                <p>
                  Created:{" "}
                  {formatDateTime(article.createdAt)}
                </p>

                <p>
                  Updated:{" "}
                  {formatDateTime(article.updatedAt)}
                </p>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  icon,
  title,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
        checked
          ? "border-[#15945c]/30 bg-[#15945c]/5"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      <span
        className={`rounded-lg p-2 ${
          checked
            ? "bg-[#15945c] text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-800">
          {title}
        </span>

        <span className="mt-0.5 block text-xs text-slate-500">
          {description}
        </span>
      </span>

      <span
        className={`relative h-5 w-9 rounded-full ${
          checked ? "bg-[#15945c]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10";

const textareaClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10";