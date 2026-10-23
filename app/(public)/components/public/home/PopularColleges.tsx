
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPopularColleges } from "@/services/college.service";
import PopularCollegeCard from "./PopularCollegeCard";

export default async function PopularColleges() {
  const colleges = await getPopularColleges(6);


  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
              Explore your options
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Popular Colleges
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Explore colleges and discover the options that
              could fit your education and career goals.
            </p>
          </div>

          <Link
            href="/colleges"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-700"
          >
            View All Colleges
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Horizontal carousel */}
        {colleges.length > 0 ? (
          <div className="relative mt-7">
            {/* Left arrow */}
    

            {/* Cards stay in a single row */}
<div className="mt-7 flex gap-4 overflow-x-auto scroll-smooth px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5">
  {colleges.map((college) => (
    <div
      key={college.id}
      className="w-[260px] min-w-[260px] sm:w-[280px] sm:min-w-[280px] lg:w-[265px] lg:min-w-[265px]"
    >
      <PopularCollegeCard college={college} />
    </div>
  ))}
</div>

            {/* Right arrow */}

          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <p className="text-sm font-medium text-slate-600">
              No colleges are available yet.
            </p>

            <Link
              href="/colleges"
              className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-700"
            >
              Explore Colleges
              <ArrowRight size={15} className="ml-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}