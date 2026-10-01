
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Trophy,
} from "lucide-react";

import type { CollegeDetail } from "@/services/college.service";

type CollegeOverviewProps = {
  college: CollegeDetail;
};

export default function CollegeOverview({
  college,
}: CollegeOverviewProps) {
  return (
    <article className="space-y-6">
      <section className="rounded-2xl bg-white p-5 shadow-sm md:p-7">
        <ArticleHeader college={college} />

        {college.description && (
          <div className="mt-6">
            <p className="text-[15px] leading-7 text-gray-700 md:text-base">
              {college.description}
            </p>
          </div>
        )}

        <OverviewTableOfContents />

        {/* HIGHLIGHTS */}
        <section
          id="highlights"
          className="mt-9 scroll-mt-24"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {college.name} Highlights
          </h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
            <HighlightRow
              label="Established"
              value={
                college.establishedYear
                  ? String(college.establishedYear)
                  : "Not Available"
              }
            />

            <HighlightRow
              label="College Type"
              value={formatCollegeType(
                college.collegeType,
              )}
            />

            <HighlightRow
              label="Location"
              value={formatLocation(college)}
            />

            <HighlightRow
              label="Courses"
              value={`${college.courses.length} ${
                college.courses.length === 1
                  ? "Course"
                  : "Courses"
              }`}
            />

            <HighlightRow
              label="Reviews"
              value={`${college.reviews.length} ${
                college.reviews.length === 1
                  ? "Review"
                  : "Reviews"
              }`}
            />
          </div>
        </section>

        {/* COURSES */}
        <section
          id="courses"
          className="mt-9 scroll-mt-24"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Courses Offered at {college.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Explore all courses offered by{" "}
                {college.name}, including course level,
                duration and fees.
              </p>
            </div>

            <Link
              href={`/colleges/${college.slug}/courses-fees`}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#15945c] hover:underline"
            >
              View All Courses
              <ArrowRight size={16} />
            </Link>
          </div>

          {college.courses.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
              <div className="hidden grid-cols-[minmax(0,1.8fr)_140px_140px_120px] gap-4 bg-gray-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 md:grid">
                <div>Course</div>
                <div>Level</div>
                <div>Duration</div>
                <div>Fees</div>
              </div>

              <div className="divide-y divide-gray-200">
                {college.courses.map((collegeCourse) => {
                  const course =
                    collegeCourse.course;

                  return (
                    <Link
                      key={collegeCourse.id}
                      href={`/colleges/${college.slug}/${course.slug}`}
                      className="group block transition hover:bg-gray-50"
                    >
                      <div className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[minmax(0,1.8fr)_140px_140px_120px] md:items-center md:gap-4">
                        {/* COURSE */}
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 transition group-hover:text-[#15945c]">
                            {course.name}
                          </h3>

                          {course.shortName && (
                            <p className="mt-1 text-sm text-gray-500">
                              {course.shortName}
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap gap-2 md:hidden">
                            {course.level && (
                              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-[#15945c]">
                                {formatLevel(
                                  course.level,
                                )}
                              </span>
                            )}

                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                              {formatDuration(
                                collegeCourse.duration,
                                course.durationYears,
                              )}
                            </span>
                          </div>
                        </div>

                        {/* LEVEL */}
                        <div className="hidden md:block">
                          <p className="text-sm font-medium text-gray-700">
                            {formatLevel(
                              course.level,
                            )}
                          </p>
                        </div>

                        {/* DURATION */}
                        <div>
                          <p className="text-xs text-gray-500 md:hidden">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800 md:mt-0">
                            {formatDuration(
                              collegeCourse.duration,
                              course.durationYears,
                            )}
                          </p>
                        </div>

                        {/* FEES */}
                        <div>
                          <p className="text-xs text-gray-500 md:hidden">
                            Fees
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900 md:mt-0">
                            {collegeCourse.fees !==
                            null
                              ? formatCurrency(
                                  collegeCourse.fees,
                                )
                              : "Not Available"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-7 text-center">
              <BookOpen
                size={34}
                className="mx-auto text-gray-400"
              />

              <p className="mt-3 font-semibold text-gray-800">
                Course information is currently
                unavailable.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Please check back later for updated
                course information.
              </p>
            </div>
          )}
        </section>

        {/* RANKINGS */}
        <section
          id="rankings"
          className="mt-9 scroll-mt-24"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {college.name} Rankings
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Check the latest ranking information
                available for {college.name}.
              </p>
            </div>

            <Link
              href={`/colleges/${college.slug}/rankings`}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#15945c] hover:underline"
            >
              View Rankings
              <ArrowRight size={16} />
            </Link>
          </div>

          {college.rankings.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
              <div className="hidden grid-cols-[minmax(0,1.5fr)_1fr_1fr_120px] gap-4 bg-gray-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 md:grid">
                <div>Ranking Body</div>
                <div>Rank</div>
                <div>Year</div>
                <div>Category</div>
              </div>

              <div className="divide-y divide-gray-200">
                {college.rankings.map((ranking) => (
                  <div
                    key={ranking.id}
                    className="grid grid-cols-1 gap-3 px-5 py-5 md:grid-cols-[minmax(0,1.5fr)_1fr_1fr_120px] md:items-center md:gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Trophy
                          size={17}
                          className="shrink-0 text-[#15945c]"
                        />

                        <p className="font-bold text-gray-900">
                          {getRankingBody(
                            ranking,
                          )}
                        </p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 md:hidden">
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-[#15945c]">
                          Rank{" "}
                          {getRankingValue(
                            ranking,
                          )}
                        </span>

                        {getRankingYear(
                          ranking,
                        ) && (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            {getRankingYear(
                              ranking,
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <p className="text-sm font-bold text-gray-900">
                        {getRankingValue(
                          ranking,
                        )}
                      </p>
                    </div>

                    <div className="hidden md:block">
                      <p className="text-sm text-gray-700">
                        {getRankingYear(
                          ranking,
                        ) || "Not Available"}
                      </p>
                    </div>

                    <div className="hidden md:block">
                      <p className="text-sm text-gray-700">
                        {getRankingCategory(
                          ranking,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-7 text-center">
              <Trophy
                size={34}
                className="mx-auto text-gray-400"
              />

              <p className="mt-3 font-semibold text-gray-800">
                Ranking information is currently
                unavailable.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Ranking information will be updated
                when available.
              </p>
            </div>
          )}
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="mt-9 scroll-mt-24"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            About {college.name}
          </h2>

          {college.description ? (
            <p className="mt-4 text-[15px] leading-7 text-gray-700 md:text-base">
              {college.description}
            </p>
          ) : (
            <p className="mt-4 text-gray-500">
              Detailed information about this college
              is currently unavailable.
            </p>
          )}
        </section>

        {/* COLLEGE INFORMATION */}
        <section
          id="college-information"
          className="mt-9 scroll-mt-24"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {college.name} Information
          </h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
            <InformationRow
              label="College Name"
              value={college.name}
            />

            <InformationRow
              label="College Type"
              value={formatCollegeType(
                college.collegeType,
              )}
            />

            <InformationRow
              label="Established"
              value={
                college.establishedYear
                  ? String(college.establishedYear)
                  : "Not Available"
              }
            />

            <InformationRow
              label="Location"
              value={formatLocation(college)}
            />

            <InformationRow
              label="Address"
              value={
                college.address ||
                "Not Available"
              }
            />

            <InformationRow
              label="Official Website"
              value={
                college.website ||
                "Not Available"
              }
            />
          </div>
        </section>
      </section>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* ARTICLE HEADER                                                             */
/* -------------------------------------------------------------------------- */

function ArticleHeader({
  college,
}: {
  college: CollegeDetail;
}) {
  const updated =
    college.lastUpdated instanceof Date
      ? college.lastUpdated.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          },
        )
      : null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#15945c] text-sm font-bold text-white">
        CA
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#15945c]">
            College Aadhar Team
          </span>

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#15945c] text-[10px] font-bold text-white">
            ✓
          </span>
        </div>

        <p className="text-xs text-gray-500">
          {updated
            ? `Updated on ${updated}`
            : "College Information Team"}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TABLE OF CONTENTS                                                          */
/* -------------------------------------------------------------------------- */

function OverviewTableOfContents() {
  return (
    <div className="mt-7 rounded-lg border border-gray-300 bg-gray-50 p-5">
      <h2 className="text-lg font-bold text-gray-900">
        Table of Content
      </h2>

      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6">
        <li>
          <a
            href="#highlights"
            className="text-[#15945c] hover:underline"
          >
            College Highlights
          </a>
        </li>

        <li>
          <a
            href="#courses"
            className="text-[#15945c] hover:underline"
          >
            Courses Offered
          </a>
        </li>

        <li>
          <a
            href="#rankings"
            className="text-[#15945c] hover:underline"
          >
            College Rankings
          </a>
        </li>

        <li>
          <a
            href="#about"
            className="text-[#15945c] hover:underline"
          >
            About the College
          </a>
        </li>

        <li>
          <a
            href="#college-information"
            className="text-[#15945c] hover:underline"
          >
            College Information
          </a>
        </li>
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HIGHLIGHT / INFORMATION ROWS                                               */
/* -------------------------------------------------------------------------- */

function HighlightRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-200 p-4 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-6">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function InformationRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-gray-200 p-4 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-6">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatLocation(
  college: CollegeDetail,
): string {
  const parts = [
    college.city?.name,
    college.state?.name,
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(", ")
    : "Not Available";
}

function formatCollegeType(
  type: string,
): string {
  return type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function formatLevel(
  level: string | null,
): string {
  if (!level) {
    return "Not Available";
  }

  return level
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function formatCurrency(
  amount: number,
): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDuration(
  collegeDuration: number | null,
  courseDuration: number | null,
): string {
  const duration =
    collegeDuration ?? courseDuration;

  if (duration === null) {
    return "Not Available";
  }

  return `${duration} ${
    duration === 1 ? "Year" : "Years"
  }`;
}

/*
 * These helpers intentionally read the existing
 * ranking object without changing your Prisma
 * structure.
 */
function getRankingBody(
  ranking: CollegeDetail["rankings"][number],
): string {
  const item = ranking as unknown as Record<
    string,
    unknown
  >;

  const value =
    item.body ??
    item.rankingBody ??
    item.organization ??
    item.agency ??
    item.source;

  return typeof value === "string"
    ? value
    : "Ranking";
}

function getRankingValue(
  ranking: CollegeDetail["rankings"][number],
): string | number {
  const item = ranking as unknown as Record<
    string,
    unknown
  >;

  const value =
    item.rank ??
    item.ranking ??
    item.position ??
    item.value;

  if (
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return value;
  }

  return "Not Available";
}

function getRankingYear(
  ranking: CollegeDetail["rankings"][number],
): string | number | null {
  const item = ranking as unknown as Record<
    string,
    unknown
  >;

  const value = item.year;

  if (
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return value;
  }

  return null;
}

function getRankingCategory(
  ranking: CollegeDetail["rankings"][number],
): string {
  const item = ranking as unknown as Record<
    string,
    unknown
  >;

  const value =
    item.category ??
    item.stream ??
    item.program ??
    item.type;

  return typeof value === "string"
    ? value
    : "Overall";
}
