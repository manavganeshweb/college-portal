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
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 lg:flex-row"
      >
        <div className="flex flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search colleges by name..."
            className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
        <SlidersHorizontal className="h-4 w-4 text-emerald-600" />

        <span className="text-sm font-semibold text-slate-700">
          Filters
        </span>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* State */}
        <select
          value={currentStateId}
          onChange={(event) => handleStateChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
        >
          <option value="">All States</option>

          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={currentCityId}
          onChange={(event) =>
            updateFilters({
              cityId: event.target.value,
            })
          }
          disabled={!currentStateId}
          className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
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

        {/* College Type */}
        <select
          value={currentCollegeType}
          onChange={(event) =>
            updateFilters({
              collegeType: event.target.value,
            })
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
        >
          <option value="">All College Types</option>

          {collegeTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Verification */}
        <select
          value={currentVerified}
          onChange={(event) =>
            updateFilters({
              verified: event.target.value,
            })
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
        >
          <option value="">All Colleges</option>
          <option value="true">Verified Only</option>
          <option value="false">Unverified</option>
        </select>
      </div>
    </div>
  );
}