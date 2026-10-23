
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getPopularUniversities } from "@/services/college.service";
import PopularUniversityCard from "./PopularUniversityCard";

export default async function PopularUniversities() {
  const universities = await getPopularUniversities(4);

  return (
    <section className="bg-white py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Popular Universities
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Explore top universities, compare courses and fees,
              and find the right destination for your higher education.
            </p>
          </div>

          <Link
            href="/colleges?institutionKind=UNIVERSITY"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-700"
          >
            View All Universities
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {universities.length > 0 ? (
   <div className="mt-7 flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  {universities.map((university) => (
    <div
      key={university.id}
      className="w-[260px] min-w-[260px] snap-start sm:w-[280px] sm:min-w-[280px] lg:w-[265px] lg:min-w-[265px]"
    >
      <PopularUniversityCard university={university} />
    </div>
  ))}
</div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <p className="text-sm font-medium text-slate-600">
              No universities are available yet.
            </p>

            <Link
              href="/colleges?institutionKind=UNIVERSITY"
              className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-700"
            >
              Explore Universities
              <ArrowRight size={15} className="ml-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
