
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Star,
} from "lucide-react";
import Breadcrumbs from "../shared/Breadcrumbs";

type CollegeHeroProps = {
  college: {
    id: string;
    name: string;
    shortName: string | null;
    slug: string;
    logo: string | null;
    coverImage: string | null;
    collegeType: string;
    verified: boolean;
    establishedYear: number | null;
    website: string | null;
    description: string | null;
    city: {
      name: string;
    } | null;
    state: {
      name: string;
    } | null;
    reviews: {
      id: string;
    }[];
  };
  pageTitle: string;
};


export default function CollegeHero({
  college,
  pageTitle,
}: CollegeHeroProps) {
  const location = [college.city?.name, college.state?.name]
    .filter(Boolean)
    .join(", ");

  const reviewCount = college.reviews.length;

  return (
    <section className="relative overflow-hidden bg-[#087a49] text-white">
      {/* Background image */}
      {college.coverImage && (
        <div className="absolute inset-0">
          <Image
            src={college.coverImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#087a49] via-[#087a49]/90 to-[#087a49]/45" />
        </div>
      )}

      {!college.coverImage && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#087a49] to-[#15945c]" />
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 overflow-x-auto">
   <Breadcrumbs
  variant="hero"
  items={[
    { label: "Home", href: "/" },
    { label: "Colleges", href: "/colleges" },
    { label: pageTitle },
  ]}
/>
        </div>

        <div className="flex flex-col gap-7 md:flex-row md:items-center">
          {/* Logo */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white p-3 shadow-lg sm:h-28 sm:w-28">
            {college.logo ? (
              <Image
                src={college.logo}
                alt={`${college.name} logo`}
                width={112}
                height={112}
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 className="h-10 w-10 text-[#15945c]" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                {formatCollegeType(college.collegeType)}
              </span>

              {college.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#087a49]">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>

            <h1 className="mt-3 max-w-4xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              {pageTitle}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              )}

              {college.establishedYear && (
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Established {college.establishedYear}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                <span>
                  {reviewCount}{" "}
                  {reviewCount === 1 ? "Review" : "Reviews"}
                </span>
              </div>
            </div>

            {college.description && (
              <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-white/80">
                {college.description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/colleges/${college.slug}/reviews`}
                scroll={false}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#087a49] transition hover:bg-gray-100"
              >
                <Star className="h-4 w-4" />
                Read Reviews
              </Link>

              {college.website && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Official Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <Link
                href={`/colleges/${college.slug}/courses-fees`}
                scroll={false}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Explore Courses
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatCollegeType(type: string): string {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}