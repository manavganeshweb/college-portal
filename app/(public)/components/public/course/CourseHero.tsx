import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  IndianRupee,
} from "lucide-react";

type CourseHeroCollege = {
  id: string;
};

type CourseHeroCategory = {
  id: string;
  name: string;
  slug: string;
};

export type CourseHeroCourse = {
  name: string;
  slug: string;
  shortName: string | null;
  degree: string | null;
  level: string;
  description: string | null;
  durationYears: number | null;
  averageFees: number | null;
  category: CourseHeroCategory;
  colleges: CourseHeroCollege[];
};

type CourseHeroProps = {
  course: CourseHeroCourse;
};

function formatLevel(level: string): string {
  switch (level) {
    case "UG":
      return "Undergraduate";

    case "PG":
      return "Postgraduate";

    case "DIPLOMA":
      return "Diploma";

    case "PHD":
      return "PhD";

    case "CERTIFICATE":
      return "Certificate";

    default:
      return level;
  }
}

function formatDuration(years: number | null): string {
  if (years === null) {
    return "Varies";
  }

  return `${years} ${years === 1 ? "Year" : "Years"}`;
}

function formatFees(value: number | null): string {
  if (value === null) {
    return "Not available";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function getCollegeLabel(count: number): string {
  return count === 1 ? "College" : "Colleges";
}

export default function CourseHero({
  course,
}: CourseHeroProps) {
  const collegeCount = course.colleges.length;

  const categoryUrl = `/courses/${course.category.slug}`;
  const courseUrl = `/courses/${course.category.slug}/${course.slug}`;

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap border-b border-slate-100 py-3 text-xs text-slate-500"
        >
          <Link
            href="/"
            className="shrink-0 transition-colors hover:text-emerald-600"
          >
            Home
          </Link>

          <ChevronRight
            size={13}
            className="shrink-0 text-slate-300"
          />

          <Link
            href="/courses"
            className="shrink-0 transition-colors hover:text-emerald-600"
          >
            Courses
          </Link>

          <ChevronRight
            size={13}
            className="shrink-0 text-slate-300"
          />

          <Link
            href={categoryUrl}
            className="shrink-0 transition-colors hover:text-emerald-600"
          >
            {course.category.name}
          </Link>

          <ChevronRight
            size={13}
            className="shrink-0 text-slate-300"
          />

          <span className="truncate font-medium text-slate-700">
            {course.name}
          </span>
        </nav>

        {/* Hero content */}
        <div className="grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-12 lg:py-8">
          {/* Main information */}
          <div className="min-w-0">
            {/* Course label */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                <GraduationCap size={13} />
                {formatLevel(course.level)}
              </span>

              <Link
                href={categoryUrl}
                className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-emerald-200 hover:text-emerald-700"
              >
                {course.category.name}
              </Link>

              {course.shortName && (
                <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {course.shortName}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {course.name}
            </h1>

            {/* Degree */}
            {course.degree && (
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {course.degree}
              </p>
            )}

            {/* Description */}
            {course.description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                {course.description}
              </p>
            )}

            {/* Facts */}
            <div className="mt-5 grid max-w-4xl grid-cols-2 border-y border-slate-200 sm:grid-cols-4">
              {/* Duration */}
              <div className="flex items-center gap-2.5 border-b border-slate-200 px-3 py-3 sm:border-b-0 sm:border-r">
                <Clock3
                  size={17}
                  className="shrink-0 text-emerald-600"
                />

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Duration
                  </p>

                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                    {formatDuration(course.durationYears)}
                  </p>
                </div>
              </div>

              {/* Fees */}
              <div className="flex items-center gap-2.5 border-b border-slate-200 px-3 py-3 sm:border-b-0 sm:border-r">
                <IndianRupee
                  size={17}
                  className="shrink-0 text-emerald-600"
                />

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Avg. Fees
                  </p>

                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                    {formatFees(course.averageFees)}
                  </p>
                </div>
              </div>

              {/* Colleges */}
              <div className="flex items-center gap-2.5 px-3 py-3 sm:border-r sm:border-slate-200">
                <Building2
                  size={17}
                  className="shrink-0 text-emerald-600"
                />

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Colleges
                  </p>

                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                    {collegeCount} {getCollegeLabel(collegeCount)}
                  </p>
                </div>
              </div>

              {/* Level */}
              <div className="flex items-center gap-2.5 border-t border-slate-200 px-3 py-3 sm:border-t-0">
                <GraduationCap
                  size={17}
                  className="shrink-0 text-emerald-600"
                />

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Level
                  </p>

                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                    {course.level}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Link
                href={`${courseUrl}/top-colleges`}
                className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Explore Colleges

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href={`${courseUrl}/eligibility`}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                Check Eligibility
              </Link>
            </div>
          </div>

          {/* Right information panel */}
          <aside className="lg:border-l lg:border-slate-200 lg:pl-8">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Course Information
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Quick access
                  </p>
                </div>
              </div>

              <div className="mt-4 divide-y divide-slate-200">
                <Link
                  href={`${courseUrl}/fees`}
                  className="group flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="text-slate-600">
                    Course Fees
                  </span>

                  <ChevronRight
                    size={16}
                    className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600"
                  />
                </Link>

                <Link
                  href={`${courseUrl}/eligibility`}
                  className="group flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="text-slate-600">
                    Eligibility
                  </span>

                  <ChevronRight
                    size={16}
                    className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600"
                  />
                </Link>

                <Link
                  href={`${courseUrl}/admission`}
                  className="group flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="text-slate-600">
                    Admission Process
                  </span>

                  <ChevronRight
                    size={16}
                    className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600"
                  />
                </Link>

                <Link
                  href={`${courseUrl}/syllabus`}
                  className="group flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="text-slate-600">
                    Syllabus
                  </span>

                  <ChevronRight
                    size={16}
                    className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600"
                  />
                </Link>

                <Link
                  href={`${courseUrl}/top-colleges`}
                  className="group flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="font-medium text-emerald-700">
                    Top Colleges
                  </span>

                  <ChevronRight
                    size={16}
                    className="text-emerald-600 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Small category link */}
            <Link
              href={categoryUrl}
              className="mt-3 flex items-center justify-between rounded-lg px-1 py-2 text-xs font-medium text-slate-500 transition-colors hover:text-emerald-700"
            >
              <span>
                View all {course.category.name} courses
              </span>

              <ArrowRight size={14} />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}