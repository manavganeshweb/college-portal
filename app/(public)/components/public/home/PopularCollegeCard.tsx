"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Star,
} from "lucide-react";

type PopularCollege = {
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

  courses: {
    fees: unknown;
    course: {
      name: string;
      shortName: string | null;
      category: {
        name: string;
      };
    };
  }[];

  averageRating: number | null;
  reviewCount: number;
  minimumFee: number | null;
  maximumFee: number | null;
};

function formatFee(value: number | null) {
  if (value === null) {
    return "Fees unavailable";
  }

  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)} L`;
  }

  if (value >= 1000) {
    return `₹${Math.round(value / 1000)}K`;
  }

  return `₹${Math.round(value)}`;
}

function formatFeeRange(
  minimumFee: number | null,
  maximumFee: number | null
) {
  if (minimumFee === null) {
    return "Fees unavailable";
  }

  if (
    maximumFee === null ||
    minimumFee === maximumFee
  ) {
    return formatFee(minimumFee);
  }

  return `${formatFee(minimumFee)} - ${formatFee(
    maximumFee
  )}`;
}

export default function PopularCollegeCard({
  college,
}: {
  college: PopularCollege;
}) {
  const firstCourse = college.courses[0];

  return (
    <motion.article
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/30"
    >
      {/* Cover */}
      <Link
        href={`/colleges/${college.slug}`}
        className="relative block h-[165px] overflow-hidden bg-slate-100"
      >
        {college.coverImage ? (
          <Image
            src={college.coverImage}
            alt={`${college.name} campus`}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
            <span className="text-4xl font-bold text-emerald-200">
              {college.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />

        {/* Verified / ranked badge */}
        {college.verified && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            <CheckCircle2 size={11} />
            Verified
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="min-h-[72px]">
          <Link href={`/colleges/${college.slug}`}>
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-emerald-700">
              {college.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <MapPin
              size={12}
              className="shrink-0"
            />

            <span className="truncate">
              {college.city.name},{" "}
              {college.state.name}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          {college.averageRating !== null ? (
            <>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                <Star
                  size={13}
                  fill="currentColor"
                />
                {college.averageRating.toFixed(1)}
              </span>

              <span className="text-[11px] text-slate-400">
                ({college.reviewCount}{" "}
                {college.reviewCount === 1
                  ? "review"
                  : "reviews"})
              </span>
            </>
          ) : (
            <span className="text-[11px] text-slate-400">
              No reviews yet
            </span>
          )}
        </div>

        {/* Course tags */}
        <div className="mt-3 flex min-h-[25px] flex-wrap gap-1.5">
          {college.courses
            .slice(0, 2)
            .map((item) => (
              <span
                key={`${college.id}-${item.course.name}`}
                className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700"
              >
                {item.course.shortName ??
                  item.course.name}
              </span>
            ))}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[10px] text-slate-400">
              Fees
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-700">
              {formatFeeRange(
                college.minimumFee,
                college.maximumFee
              )}
            </p>
          </div>

          <Link
            href={`/colleges/${college.slug}`}
            aria-label={`View ${college.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 transition-all duration-300 hover:bg-emerald-600 hover:text-white group-hover:translate-x-0.5"
          >
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}