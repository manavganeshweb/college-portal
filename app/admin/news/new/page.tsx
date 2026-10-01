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
  TrendingUp,
} from "lucide-react";

type NewsType =
  | "EXAM_ALERT"
  | "COLLEGE_ALERT"
  | "ADMISSION_ALERT"
  | "EDUCATION_NEWS"
  | "RESULT"
  | "CAREER";

const newsTypes: Array<{
  value: NewsType;
  label: string;
}> = [
  { value: "EXAM_ALERT", label: "Exam Alert" },
  { value: "COLLEGE_ALERT", label: "College Alert" },
  { value: "ADMISSION_ALERT", label: "Admission Alert" },
  { value: "EDUCATION_NEWS", label: "Education News" },
  { value: "RESULT", label: "Result" },
  { value: "CAREER", label: "Career" },
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewsForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [coverImage, setCoverImage] = useState("");
  const [type, setType] = useState<NewsType>("EDUCATION_NEWS");

  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const [status, setStatus] = useState<
    "DRAFT" | "PUBLISHED"
  >("DRAFT");

  const [publishedAt, setPublishedAt] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugManuallyEdited) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!content.trim()) {
      setError("Article content is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/admin/api/admin/news", {
        method: "POST",
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
          seoDescription: seoDescription.trim() || null,
          seoKeywords: seoKeywords.trim() || null,
          isFeatured,
          isTrending,
          status,
          publishedAt:
            status === "PUBLISHED"
              ? publishedAt || new Date().toISOString()
              : null,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: {
          id: string;
        };
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create article.",
        );
      }

      if (!result.data?.id) {
        throw new Error(
          "Article was created but no article ID was returned.",
        );
      }

      window.location.href = `/admin/news/${result.data.id}`;
    } catch (err) {
      console.error("Create news error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create article.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/news"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-[#15945c]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">
            Create News Article
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and publish a new education article.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            {status === "DRAFT" ? "Draft" : "Published"}
          </span>
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
            {/* Basic information */}
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
                    Main content and article details.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <Field label="Title" required>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      handleTitleChange(event.target.value)
                    }
                    placeholder="Enter article title"
                    className={inputClass}
                  />
                </Field>

                <Field label="Slug" required>
                  <input
                    type="text"
                    value={slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true);
                      setSlug(
                        createSlug(event.target.value),
                      );
                    }}
                    placeholder="article-url-slug"
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    URL: /news/{slug || "article-slug"}
                  </p>
                </Field>

                <Field label="Excerpt">
                  <textarea
                    value={excerpt}
                    onChange={(event) =>
                      setExcerpt(event.target.value)
                    }
                    rows={4}
                    placeholder="Short summary of the article..."
                    className={textareaClass}
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Recommended: 120–180 characters.
                  </p>
                </Field>

                <Field label="Content" required>
                  <textarea
                    value={content}
                    onChange={(event) =>
                      setContent(event.target.value)
                    }
                    rows={18}
                    placeholder="Write your article content here..."
                    className={`${textareaClass} min-h-[400px]`}
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Rich text editor can be added later without
                    changing the NewsArticle model.
                  </p>
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
                    placeholder="Example: NTA"
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
                    placeholder="https://example.com"
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* SEO */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="font-semibold text-slate-900">
                  SEO Settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Optimize the article for search engines.
                </p>
              </div>

              <div className="space-y-5">
                <Field label="SEO Title">
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(event) =>
                      setSeoTitle(event.target.value)
                    }
                    placeholder="SEO title"
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
                    placeholder="SEO description..."
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
                    placeholder="jee, admission, college, education"
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
                        event.target.value as
                          | "DRAFT"
                          | "PUBLISHED",
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15945c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#117b4c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {status === "PUBLISHED"
                        ? "Publish Article"
                        : "Save Draft"}
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

              <div className="mt-4">
                <select
                  value={type}
                  onChange={(event) =>
                    setType(
                      event.target.value as NewsType,
                    )
                  }
                  className={inputClass}
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
              </div>
            </section>

            {/* Cover image */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                Cover Image
              </h2>

              <div className="mt-4 space-y-4">
                <input
                  type="url"
                  value={coverImage}
                  onChange={(event) =>
                    setCoverImage(event.target.value)
                  }
                  placeholder="https://..."
                  className={inputClass}
                />

                {coverImage && (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
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
              </div>
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

            {/* Preview */}
            {title && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-slate-500" />

                  <h2 className="font-semibold text-slate-900">
                    Preview
                  </h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                  )}

                  <div className="p-4">
                    <span className="text-xs font-semibold uppercase text-[#15945c]">
                      {newsTypes.find(
                        (item) => item.value === type,
                      )?.label}
                    </span>

                    <h3 className="mt-2 line-clamp-3 font-bold text-slate-900">
                      {title}
                    </h3>

                    {excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                        {excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}
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
        className={`relative h-5 w-9 rounded-full transition ${
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