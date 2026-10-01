"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CourseFiltersProps = {
  categories: Category[];
};
const popularCourses = [
  {
    name: "MBBS Courses",
    categorySlug: "mbbs",
  },
  {
    name: "B.Sc Courses",
    categorySlug: "bsc",
  },
  {
    name: "B.Com Courses",
    categorySlug: "bcom",
  },
  {
    name: "BA Courses",
    categorySlug: "ba",
  },
  {
    name: "MBA / PGDM Courses",
    categorySlug: "mba",
  },
];

export default function CourseFilters({
  categories,
}: CourseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? "",
  );

  const selectedCategory =
    searchParams.get("categoryId") ?? "";

  const selectedLevel =
    searchParams.get("level") ?? "";

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateParams(
    key: string,
    value: string,
    resetPage = true,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (resetPage) {
      params.delete("page");
    }

    const query = params.toString();

    router.push(
      query ? `${pathname}?${query}` : pathname,
      {
        scroll: false,
      },
    );
  }

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    updateParams("search", search.trim());
  }

  function clearFilters() {
    setSearch("");

    router.push(pathname, {
      scroll: false,
    });
  }

  const hasFilters =
    Boolean(searchParams.get("search")) ||
    Boolean(selectedCategory) ||
    Boolean(selectedLevel);

  return (
    <div className="mt-6 border-t border-emerald-100/80 pt-4 sm:mt-7 sm:pt-5">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search
            size={17}
            strokeWidth={2}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search courses..."
            aria-label="Search courses"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11"
          />
        </div>
      </form>

      {/* Popular courses */}
      <div className="mt-3">
  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
    {popularCourses.map((course) => (
      <Link
        key={course.categorySlug}
        href={`/courses/${course.categorySlug}`}
        className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 sm:px-4 sm:py-2 sm:text-sm"
      >
        {course.name}
      </Link>
    ))}
  </div>
</div>

      {/* Category + Level */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <select
          value={selectedCategory}
          onChange={(event) =>
            updateParams(
              "categoryId",
              event.target.value,
            )
          }
          aria-label="Filter by category"
          className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:w-[190px] sm:text-sm"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(event) =>
            updateParams(
              "level",
              event.target.value,
            )
          }
          aria-label="Filter by level"
          className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:w-[170px] sm:text-sm"
        >
          <option value="">All Levels</option>
          <option value="UG">Undergraduate</option>
          <option value="PG">Postgraduate</option>
          <option value="DIPLOMA">Diploma</option>
          <option value="PHD">PhD</option>
          <option value="CERTIFICATE">
            Certificate
          </option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="col-span-2 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:col-span-1 sm:ml-auto"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}