
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  CalendarDays,
  Trophy,
} from "lucide-react";

import CompareCollegeButton from "../public/college/CompareCollegeButton";

type CollegeCardProps = {
  college: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    logo: string | null;
    coverImage: string | null;
    collegeType: string;
    institutionKind?: string | null;
    verified: boolean;
    establishedYear: number | null;
    ranking?: number | null;
    state: {
      name: string;
    };
    city: {
      name: string;
    } | null;
  };
};

export default function CollegeCard({ college }: CollegeCardProps) {
  const initials = (college.shortName ?? college.name)
    .slice(0, 2)
    .toUpperCase();

  const isUniversity = college.institutionKind === "UNIVERSITY";

  const detailUrl = isUniversity
    ? `/universities/${college.slug}`
    : `/colleges/${college.slug}`;

  const coursesUrl = `${detailUrl}/courses-fees`;

  return (
    <article className="group flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      {/* Cover */}
      <Link href={detailUrl} className="block shrink-0">
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-100 to-slate-100">
          {college.coverImage ? (
            <Image
              src={college.coverImage}
              alt={`${college.name} campus`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-5xl font-bold text-emerald-200">
                {initials}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

          {college.ranking != null && college.ranking > 0 && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              Rank #{college.ranking}
            </div>
          )}

          {college.verified && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified
            </span>
          )}

          {/* Logo */}
          <div className="absolute -bottom-5 left-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-emerald-50 text-lg font-bold text-emerald-700 shadow-md">
            {college.logo ? (
              <Image
                src={college.logo}
                alt={`${college.name} logo`}
                fill
                sizes="56px"
                className="object-contain"
              />
            ) : (
              initials
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 pt-8">
        <Link href={detailUrl} className="block">
          <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-slate-900 transition group-hover:text-emerald-700">
            {college.name}
          </h3>

          <div className="mt-3 flex min-h-10 items-start gap-1.5 text-sm text-slate-500">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span className="line-clamp-2">
              {college.city?.name ?? "City not available"},{" "}
              {college.state?.name ?? "State not available"}
            </span>
          </div>

          <div className="mt-4 flex min-h-10 items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <span className="max-w-[60%] truncate rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
              {college.collegeType}
            </span>

            {college.establishedYear && (
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" />
                {college.establishedYear}
              </span>
            )}
          </div>
        </Link>

        {/* Buttons anchored at the bottom */}
        <div className="mt-auto grid grid-cols-2 items-stretch gap-2 border-t border-slate-100 pt-4">
          <div className="flex min-w-0 [&>button]:!flex [&>button]:!h-11 [&>button]:!w-full [&>button]:!items-center [&>button]:!justify-center [&>button]:!rounded-lg">
            <CompareCollegeButton
              college={{
                id: college.id,
                name: college.name,
                slug: college.slug,
                logo: college.logo,
              }}
            />
          </div>

          <Link
            href={coursesUrl}
            className="flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-2 text-center text-xs font-semibold text-white transition hover:bg-emerald-700 sm:text-sm"
          >
            <span className="truncate">View Courses</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </article>
  );
}
