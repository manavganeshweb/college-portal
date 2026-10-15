"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

type State = {
  id: string;
  name: string;
  slug: string;
};

type City = {
  id: string;
  name: string;
  slug: string;
  stateId: string;
};

type CollegeFiltersProps = {
  states: State[];
  cities: City[];
};

const collegeTypes = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "PRIVATE", label: "Private" },
  { value: "PUBLIC", label: "Public" },
  { value: "DEEMED", label: "Deemed" },
  { value: "AUTONOMOUS", label: "Autonomous" },
];

export default function CollegeFilters({
  states,
  cities,
}: CollegeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStateId = searchParams.get("stateId") ?? "";
  const currentCityId = searchParams.get("cityId") ?? "";
  const currentCollegeType = searchParams.get("collegeType") ?? "";
  const currentVerified = searchParams.get("verified") ?? "";

  const [search, setSearch] = useState(currentSearch);

  const filteredCities = useMemo(() => {
    if (!currentStateId) {
      return cities;
    }

    return cities.filter((city) => city.stateId === currentStateId);
  }, [cities, currentStateId]);

  function updateFilters(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Always return to first page when filters change.
    params.delete("page");

    router.push(`/colleges?${params.toString()}`);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateFilters({
      search: search.trim(),
    });
  }

  function handleStateChange(value: string) {
    updateFilters({
      stateId: value,
      cityId: "",
    });
  }

  function clearFilters() {
    setSearch("");
    router.push("/colleges");
  }

  const hasFilters =
    currentSearch ||
    currentStateId ||
    currentCityId ||
    currentCollegeType ||
    currentVerified;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    {/* Search */}
<form onSubmit={handleSearch}>
  <div className="relative">
    <Search
      size={17}
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      type="search"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search colleges..."
      aria-label="Search colleges"
      className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11"
    />
  </div>
</form>

{/* Filters */}
<div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
  <select
    value={currentStateId}
    onChange={(event) => handleStateChange(event.target.value)}
    aria-label="Filter by state"
    className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:min-w-[160px] sm:text-sm"
  >
    <option value="">All States</option>

    {states.map((state) => (
      <option key={state.id} value={state.id}>
        {state.name}
      </option>
    ))}
  </select>

  <select
    value={currentCityId}
    onChange={(event) =>
      updateFilters({ cityId: event.target.value })
    }
    disabled={!currentStateId}
    aria-label="Filter by city"
    className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:h-11 sm:min-w-[150px] sm:text-sm"
  >
    <option value="">
      {currentStateId ? "All Cities" : "Select State First"}
    </option>

    {filteredCities.map((city) => (
      <option key={city.id} value={city.id}>
        {city.name}
      </option>
    ))}
  </select>

  <select
    value={currentCollegeType}
    onChange={(event) =>
      updateFilters({ collegeType: event.target.value })
    }
    aria-label="Filter by college type"
    className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:min-w-[170px] sm:text-sm"
  >
    <option value="">All College Types</option>
    <option value="GOVERNMENT">Government</option>
    <option value="PRIVATE">Private</option>
    <option value="PUBLIC">Public</option>
    <option value="DEEMED">Deemed</option>
    <option value="AUTONOMOUS">Autonomous</option>
  </select>

  <select
    value={currentVerified}
    onChange={(event) =>
      updateFilters({ verified: event.target.value })
    }
    aria-label="Filter by verification status"
    className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:min-w-[150px] sm:text-sm"
  >
    <option value="">All Colleges</option>
    <option value="true">Verified Only</option>
    <option value="false">Unverified</option>
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