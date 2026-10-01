"use client";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

export default function ExamFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  const conductingBody =
    searchParams.get("conductingBody") ?? "";

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    updateParams("search", search.trim());
  }

  function clearFilters() {
    setSearch("");
    router.push(pathname);
  }

  const hasFilters =
    Boolean(searchParams.get("search")) ||
    Boolean(conductingBody);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal
          size={18}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-900">
          Find an Entrance Exam
        </h2>
      </div>

      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search exams..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </form>

      <div className="mt-4">
        <input
          type="text"
          value={conductingBody}
          onChange={(event) =>
            updateParams(
              "conductingBody",
              event.target.value
            )
          }
          placeholder="Filter by conducting body..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
        >
          <X size={15} />
          Clear filters
        </button>
      )}
    </div>
  );
}