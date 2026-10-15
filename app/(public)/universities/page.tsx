import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

import CollegeFilters from "../components/public/CollegeFilters";
import CollegeCard from "../components/public/CollegeCard";

import { getColleges } from "@/services/college.service";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

type UniversitiesPageProps = {
  searchParams: Promise<{
    search?: string;
    stateId?: string;
    cityId?: string;
    collegeType?: string;
    verified?: string;
    page?: string;
  }>;
};

async function getLocations() {
  const [states, cities] = await Promise.all([
    prisma.state.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.city.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        stateId: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return { states, cities };
}

export default async function UniversitiesPage({
  searchParams,
}: UniversitiesPageProps) {
  const params = await searchParams;

  const search = params.search || undefined;
  const stateId = params.stateId || undefined;
  const cityId = params.cityId || undefined;
  const collegeType = params.collegeType || undefined;

  const verified =
    params.verified === "true"
      ? true
      : params.verified === "false"
        ? false
        : undefined;

  const pageNumber = Number(params.page || "1");

  const page =
    Number.isInteger(pageNumber) && pageNumber > 0
      ? pageNumber
      : 1;

  const [{ data: universities, pagination }, locations] =
    await Promise.all([
getColleges({
  search,
  state: stateId,
  city: cityId,
  collegeType,
  institutionKind: "UNIVERSITY",
  verified,
  page,
  limit: 12,
}),
      getLocations(),
    ]);

  function createPageUrl(pageNumber: number) {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (stateId) query.set("stateId", stateId);
    if (cityId) query.set("cityId", cityId);
    if (collegeType) query.set("collegeType", collegeType);

    if (params.verified) {
      query.set("verified", params.verified);
    }

    if (pageNumber > 1) {
      query.set("page", String(pageNumber));
    }

    const queryString = query.toString();

    return queryString
      ? `/universities?${queryString}`
      : "/universities";
  }

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(stateId) ||
    Boolean(cityId) ||
    Boolean(collegeType) ||
    Boolean(params.verified);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#e8f7ef]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-emerald-700 backdrop-blur">
              <CheckCircle2 className="h-4 w-4" />
              University Discovery
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find the right university
              <span className="block text-emerald-700">
                for your future
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore universities across India, compare
              institutions, discover courses, and make
              informed decisions about your education
              with College Aadhar.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                University information
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Course details
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Compare universities
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        {/* FILTERS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-emerald-600" />

                <h2 className="text-lg font-bold text-slate-900">
                  Find universities
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Search and filter universities based on
                your preferences.
              </p>
            </div>

            {hasActiveFilters && (
              <Link
                href="/universities"
                className="hidden text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 sm:block"
              >
                Clear filters
              </Link>
            )}
          </div>

          <CollegeFilters
            states={locations.states}
            cities={locations.cities}
          />

          {hasActiveFilters && (
            <div className="mt-4 sm:hidden">
              <Link
                href="/universities"
                className="text-sm font-semibold text-emerald-700"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>

        {/* RESULTS HEADER */}
        <div className="mb-7 mt-12 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              University Directory
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {search
                ? `Results for "${search}"`
                : "Explore universities"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Discover institutions, explore their courses,
              and learn about their locations.
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {pagination.total}{" "}
            {pagination.total === 1
              ? "university"
              : "universities"}{" "}
            found
          </div>
        </div>

        {/* RESULTS */}
        {universities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <SlidersHorizontal className="h-6 w-6 text-emerald-600" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No universities found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any universities matching
              your current search or filters. Try changing
              your selection.
            </p>

            <Link
              href="/universities"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              View all universities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {universities.map((university) => (
                <CollegeCard
                  key={university.id}
                  college={university}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {pagination.hasPreviousPage ? (
                  <Link
                    href={createPageUrl(
                      pagination.page - 1
                    )}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-xl border border-slate-100 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-400">
                    Previous
                  </span>
                )}

                <div className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </div>

                {pagination.hasNextPage ? (
                  <Link
                    href={createPageUrl(
                      pagination.page + 1
                    )}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Next
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                ) : (
                  <span className="rounded-xl border border-slate-100 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-400">
                    Next
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}