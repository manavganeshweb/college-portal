import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getTopTenColleges } from "@/services/home.service";

import TopCollegeCard from "./TopCollegeCard";

export default async function TopTenColleges() {
  const colleges = await getTopTenColleges();

  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Explore leading colleges
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Top Colleges
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore verified colleges and discover their courses,
              fees, locations, and available information.
            </p>
          </div>

          <Link
            href="/colleges"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            View all colleges

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {colleges.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="font-medium text-slate-700">
              No colleges are available yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              College listings will appear here once they are
              published.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <TopCollegeCard
                key={college.id}
                college={college}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}