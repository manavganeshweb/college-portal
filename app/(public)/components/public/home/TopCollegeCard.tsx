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

type TopCollege = {
  rank: number;
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
} | null;

  courses: {
    fees: number | null;

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

type TopCollegeCardProps = {
  college: TopCollege;
};

function formatFee(value: number | null) {
  if (value === null) {
    return null;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${Math.round(value / 1000)}K`;
  }

  return `₹${value}`;
}

function formatFeeRange(
  minimumFee: number | null,
  maximumFee: number | null,
) {
  if (minimumFee === null && maximumFee === null) {
    return "Fees not available";
  }

  if (minimumFee !== null && maximumFee !== null) {
    if (minimumFee === maximumFee) {
      return formatFee(minimumFee);
    }

    return `${formatFee(minimumFee)} - ${formatFee(maximumFee)}`;
  }

  return formatFee(minimumFee ?? maximumFee);
}

export default function TopCollegeCard({
  college,
}: TopCollegeCardProps) {
  const image = college.coverImage ?? college.logo;

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <Link href={`/colleges/${college.slug}`}>
        <div className="relative h-44 overflow-hidden bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={college.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-bold text-emerald-700 shadow-sm">
                {college.shortName?.slice(0, 3) ??
                  college.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4 flex h-9 min-w-9 items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-slate-800 shadow-md">
            #{college.rank}
          </div>

          {college.verified && (
            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                {college.name}
              </h3>

              {college.shortName && (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {college.shortName}
                </p>
              )}
            </div>

            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600" />
          </div>

          <div className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 text-emerald-600" />

          <span>
  {college.city?.name ?? "City not available"},{" "}
  {college.state?.name ?? "State not available"}
</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {college.courses.slice(0, 3).map((item) => (
              <span
                key={`${college.id}-${item.course.name}`}
                className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
              >
                {item.course.shortName ?? item.course.name}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs text-slate-500">
                Course fees
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                {formatFeeRange(
                  college.minimumFee,
                  college.maximumFee,
                )}
              </p>
            </div>

            {college.averageRating !== null && (
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                <Star className="h-4 w-4 fill-current text-amber-400" />

                {college.averageRating.toFixed(1)}

                <span className="font-normal text-slate-400">
                  ({college.reviewCount})
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}