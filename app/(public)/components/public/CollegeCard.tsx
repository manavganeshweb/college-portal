"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  CalendarDays,
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
    verified: boolean;
    establishedYear: number | null;
    state: {
      name: string;
    };
    city: {
      name: string;
    };
  };
};

export default function CollegeCard({ college }: CollegeCardProps) {
  const initials = (college.shortName ?? college.name)
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      {/* Cover */}
      <Link href={`/colleges/${college.slug}`}>
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

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />

          {college.verified && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
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
      <div className="p-5 pt-8">
        <Link href={`/colleges/${college.slug}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">
              {college.name}
            </h3>

            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-emerald-600" />
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 text-emerald-600" />
            {college.city.name}, {college.state.name}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
              {college.collegeType}
            </span>

            {college.establishedYear && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" />
                Est. {college.establishedYear}
              </span>
            )}
          </div>
        </Link>

        {/* Compare */}
       
  <div className="px-5 pb-5">
    <CompareCollegeButton
      college={{
        id: college.id,
        name: college.name,
        slug: college.slug,
        logo: college.logo,
      }}
    />
        </div>
      </div>
    </article>
  );
}