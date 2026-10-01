"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  FileText,
  Plus,
  Search,
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

type ContentStatus = "DRAFT" | "PUBLISHED";

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  type: NewsType;
  status: ContentStatus;
  publishedAt: string | null;
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  } | null;
};

type NewsResponse = {
  success: boolean;
  data: NewsArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
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

function getTypeLabel(type: NewsType) {
  return (
    newsTypes.find((item) => item.value === type)?.label ?? type
  );
}

function formatDate(date: string | null) {
  if (!date) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      if (type) {
        params.set("type", type);
      }

      params.set("page", String(page));
      params.set("limit", "10");

      const response = await fetch(
        `/admin/api/admin/news?${params.toString()}`,
      );

      const result = (await response.json()) as NewsResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load news articles.",
        );
      }

      setArticles(result.data);
      setTotal(result.pagination.total);
      setTotalPages(
        Math.max(result.pagination.totalPages, 1),
      );
    } catch (err) {
      console.error("News fetch error:", err);

      setArticles([]);
      setTotal(0);
      setTotalPages(1);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load news articles.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status, type]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchNews();
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [fetchNews]);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  function changeType(value: string) {
    setType(value);
    setPage(1);
  }

  const publishedCount = articles.filter(
    (article) => article.status === "PUBLISHED",
  ).length;

  const draftCount = articles.filter(
    (article) => article.status === "DRAFT",
  ).length;

  const featuredCount = articles.filter(
    (article) => article.isFeatured,
  ).length;

  const trendingCount = articles.filter(
    (article) => article.isTrending,
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            News & Articles
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage education news, admission alerts, results and
            career updates.
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15945c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117b4c]"
        >
          <Plus className="h-4 w-4" />
          Create Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Articles"
          value={total}
          icon={<FileText className="h-5 w-5" />}
        />

        <StatCard
          label="Published"
          value={publishedCount}
          icon={<Eye className="h-5 w-5" />}
        />

        <StatCard
          label="Featured"
          value={featuredCount}
          icon={<Star className="h-5 w-5" />}
        />

        <StatCard
          label="Trending"
          value={trendingCount}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                changeSearch(event.target.value)
              }
              placeholder="Search articles..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              changeStatus(event.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#15945c]"
          >
            <option value="">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <select
            value={type}
            onChange={(event) =>
              changeType(event.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#15945c]"
          >
            <option value="">All Categories</option>

            {newsTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <TableHeading>Article</TableHeading>
                <TableHeading>Category</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading>Views</TableHeading>
                <TableHeading>Published</TableHeading>
                <TableHeading align="right">
                  Action
                </TableHeading>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <LoadingRows />
              ) : articles.length === 0 ? (
                <EmptyState />
              ) : (
                articles.map((article) => (
                  <NewsRow
                    key={article.id}
                    article={article}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && articles.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-medium text-slate-700">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) => current - 1)
                }
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#15945c] hover:text-[#15945c] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => current + 1)
                }
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#15945c] hover:text-[#15945c] disabled:pointer-events-none disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Small status information */}
      {!loading && articles.length > 0 && (
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span>
            Published on current page:{" "}
            <strong className="text-slate-700">
              {publishedCount}
            </strong>
          </span>

          <span>
            Drafts on current page:{" "}
            <strong className="text-slate-700">
              {draftCount}
            </strong>
          </span>

          <span>
            Trending on current page:{" "}
            <strong className="text-slate-700">
              {trendingCount}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-xl bg-[#15945c]/10 p-3 text-[#15945c]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-4 text-${align} text-xs font-semibold uppercase tracking-wide text-slate-500`}
    >
      {children}
    </th>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr
          key={index}
          className="animate-pulse border-b border-slate-100"
        >
          <td className="px-5 py-5">
            <div className="flex gap-3">
              <div className="h-14 w-20 rounded-lg bg-slate-200" />

              <div className="space-y-2">
                <div className="h-4 w-64 rounded bg-slate-200" />
                <div className="h-3 w-40 rounded bg-slate-200" />
              </div>
            </div>
          </td>

          <td className="px-5 py-5">
            <div className="h-6 w-24 rounded-full bg-slate-200" />
          </td>

          <td className="px-5 py-5">
            <div className="h-6 w-20 rounded-full bg-slate-200" />
          </td>

          <td className="px-5 py-5">
            <div className="h-4 w-12 rounded bg-slate-200" />
          </td>

          <td className="px-5 py-5">
            <div className="h-4 w-24 rounded bg-slate-200" />
          </td>

          <td className="px-5 py-5">
            <div className="ml-auto h-9 w-20 rounded bg-slate-200" />
          </td>
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={6} className="px-5 py-16 text-center">
        <FileText className="mx-auto h-10 w-10 text-slate-300" />

        <h3 className="mt-3 text-sm font-semibold text-slate-900">
          No articles found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your filters or create a new article.
        </p>

        <Link
          href="/admin/news/new"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#15945c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#117b4c]"
        >
          <Plus className="h-4 w-4" />
          Create Article
        </Link>
      </td>
    </tr>
  );
}

function NewsRow({
  article,
}: {
  article: NewsArticle;
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
      <td className="px-5 py-4">
        <div className="flex min-w-[330px] gap-3">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt=""
              className="h-14 w-20 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-[#15945c]/10">
              <FileText className="h-5 w-5 text-[#15945c]" />
            </div>
          )}

          <div className="min-w-0">
            <p className="line-clamp-2 font-semibold text-slate-900">
              {article.title}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              /news/{article.slug}
            </p>

            <div className="mt-1 flex flex-wrap gap-2">
              {article.isFeatured && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                  <Star className="h-3 w-3" />
                  Featured
                </span>
              )}

              {article.isTrending && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {getTypeLabel(article.type)}
        </span>
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            article.status === "PUBLISHED"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {article.status === "PUBLISHED"
            ? "Published"
            : "Draft"}
        </span>
      </td>

      <td className="px-5 py-4 text-sm font-medium text-slate-700">
        {article.views.toLocaleString("en-IN")}
      </td>

      <td className="px-5 py-4 text-sm text-slate-500">
        {formatDate(article.publishedAt)}
      </td>

      <td className="px-5 py-4 text-right">
        <Link
          href={`/admin/news/${article.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#15945c] hover:text-[#15945c]"
        >
          <Edit3 className="h-4 w-4" />
          Edit
        </Link>
      </td>
    </tr>
  );
}