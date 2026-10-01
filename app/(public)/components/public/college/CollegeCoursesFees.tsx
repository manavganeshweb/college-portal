"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import type { CollegeDetail } from "@/services/college.service";

type CollegeCoursesFeesProps = {
  college: CollegeDetail;
  selectedCourseSlug: string | null;
  courseType: string | null;
};

export default function CollegeCoursesFees({
  college,
  selectedCourseSlug,
  courseType,
}: CollegeCoursesFeesProps) {
  const router = useRouter();

  const selectedCollegeCourse =
    college.courses.find(
      (collegeCourse) =>
        collegeCourse.course.slug === selectedCourseSlug,
    ) ?? null;

  const courses = college.courses;

  /*
   * Calculate real fee information from the
   * college-course relationships.
   */
  const fees = courses
    .map((item) => item.fees)
    .filter(
      (fee): fee is number => fee !== null,
    );

  const minimumFee =
    fees.length > 0 ? Math.min(...fees) : null;

  const maximumFee =
    fees.length > 0 ? Math.max(...fees) : null;

  const handleCourseClick = (
    courseSlug: string,
  ) => {
    
router.push(
  `/colleges/${college.slug}/${courseSlug}`,
  {
    scroll: false,
  },
);
  };

  if (selectedCollegeCourse) {
    return (
      <SelectedCourseDetails
        college={college}
        collegeCourse={selectedCollegeCourse}
        courseType={courseType}
      />
    );
  }

  return (
    <article className="rounded-2xl bg-white shadow-sm">
      <div className="p-5 md:p-7">
        {/* AUTHOR / UPDATED */}
        <ArticleAuthor college={college} />

        {/* INTRO */}
        <div className="mt-5 text-[16px] leading-7 text-gray-700">
          <p>
            {college.name} offers{" "}
            <strong>
              {courses.length}{" "}
              {courses.length === 1
                ? "course"
                : "courses"}
            </strong>
            . Explore the courses offered by the
            college along with fees, duration,
            eligibility and other important details.
          </p>
        </div>

        {/* QUICK OVERVIEW */}
        <section
          id="quick-overview"
          className="mt-8 scroll-mt-24"
        >
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {college.name} Course and Fees Quick
            Overview
          </h2>

          <div className="mt-4 space-y-3 text-[16px] leading-7 text-gray-700">
            <p>
              {college.name} offers{" "}
              <strong>{courses.length}</strong>{" "}
              {courses.length === 1
                ? "course"
                : "courses"}{" "}
              in the programs currently available
              in the college database.
            </p>

            {minimumFee !== null &&
              maximumFee !== null && (
                <p>
                  The listed course fees range from{" "}
                  <strong>
                    {formatCurrency(minimumFee)}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {formatCurrency(maximumFee)}
                  </strong>
                  .
                </p>
              )}

            <p>
              Students can check individual course
              details including duration,
              eligibility, seats and college-specific
              fees.
            </p>
          </div>
        </section>

        {/* TABLE OF CONTENTS */}
        <CourseTableOfContents />

        {/* COURSE TABLE */}
        <section
          id="courses"
          className="mt-9 scroll-mt-24"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {college.name} Courses & Fees
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Explore course-wise fees, duration
                and other details.
              </p>
            </div>

            <span className="text-sm font-medium text-gray-500">
              {courses.length}{" "}
              {courses.length === 1
                ? "Course"
                : "Courses"}
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
            {/* DESKTOP HEADER */}
            <div className="hidden grid-cols-[minmax(0,1.8fr)_1fr_1fr_120px] gap-4 bg-gray-50 px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 md:grid">
              <div>Course</div>
              <div>Duration</div>
              <div>Fees</div>
              <div />
            </div>

            <div className="divide-y divide-gray-200">
              {courses.map((collegeCourse) => {
                const course = collegeCourse.course;

                return (
                  <button
                    key={collegeCourse.id}
                    type="button"
                    onClick={() =>
                      handleCourseClick(
                        course.slug,
                      )
                    }
                    className="group block w-full text-left transition hover:bg-gray-50"
                  >
                    <div className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-[minmax(0,1.8fr)_1fr_1fr_120px] md:items-center">
                      {/* COURSE */}
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#15945c]">
                          {course.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {course.shortName && (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-[#15945c]">
                              {course.shortName}
                            </span>
                          )}

                          {course.level && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                              {course.level}
                            </span>
                          )}
                        </div>
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

                      {/* ACTION */}
                      <div className="flex items-center justify-between md:justify-end">
                        <span className="text-sm font-semibold text-[#15945c]">
                          View Details
                        </span>

                        <ChevronRight
                          size={18}
                          className="text-[#15945c] transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* NO COURSES */}
        {courses.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="font-semibold text-gray-800">
              Course information is currently
              unavailable.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please check back later for updated
              course and fee information.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* SELECTED COURSE                                                            */
/* -------------------------------------------------------------------------- */

type SelectedCourseDetailsProps = {
  college: CollegeDetail;
  collegeCourse: CollegeDetail["courses"][number];
  courseType: string | null;
};

function SelectedCourseDetails({
  college,
  collegeCourse,
  courseType,
}: SelectedCourseDetailsProps) {
  const course = collegeCourse.course;

  const coursesUrl =
    `/colleges/${college.slug}/courses-fees`;

  return (
    <article className="rounded-2xl bg-white shadow-sm">
      <div className="p-5 md:p-7">
        {/* BACK */}
        <Link
          href={coursesUrl}
          scroll={false}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#15945c] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Courses & Fees
        </Link>

        {/* COURSE HEADER */}
        <div className="mt-6 border-b border-gray-200 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {course.level && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#15945c]">
                {course.level}
              </span>
            )}

            {course.degree && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {course.degree}
              </span>
            )}

            {courseType && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {courseType}
              </span>
            )}
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {course.name}
          </h2>

          {course.shortName && (
            <p className="mt-2 text-gray-500">
              {course.shortName}
            </p>
          )}
        </div>

        {/* QUICK DETAILS */}
        <CourseQuickDetails
          collegeCourse={collegeCourse}
          course={course}
        />

        {/* ABOUT */}
        <section className="mt-9">
          <h2 className="text-2xl font-bold text-gray-900">
            {course.name} Overview
          </h2>

          {course.description ? (
            <p className="mt-4 text-[16px] leading-7 text-gray-700">
              {course.description}
            </p>
          ) : (
            <p className="mt-4 text-[16px] leading-7 text-gray-500">
              Detailed course information is
              currently unavailable.
            </p>
          )}
        </section>

        {/* ELIGIBILITY */}
        {course.eligibility && (
          <section className="mt-9">
            <h2 className="text-2xl font-bold text-gray-900">
              Eligibility
            </h2>

            <p className="mt-4 text-[16px] leading-7 text-gray-700">
              {course.eligibility}
            </p>
          </section>
        )}

        {/* CAREER OPTIONS */}
        {course.careerOptions && (
          <section className="mt-9">
            <h2 className="text-2xl font-bold text-gray-900">
              Career Options
            </h2>

            <p className="mt-4 text-[16px] leading-7 text-gray-700">
              {course.careerOptions}
            </p>
          </section>
        )}

        {/* COURSE INFORMATION */}
        <section className="mt-9">
          <h2 className="text-2xl font-bold text-gray-900">
            {course.name} Course Details
          </h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
            <div className="divide-y divide-gray-200">
              <InfoRow
                label="Course"
                value={course.name}
              />

              <InfoRow
                label="Degree"
                value={course.degree}
              />

              <InfoRow
                label="Level"
                value={course.level}
              />

              <InfoRow
                label="Duration"
                value={formatDuration(
                  collegeCourse.duration,
                  course.durationYears,
                )}
              />

              <InfoRow
                label="Fees"
                value={
                  collegeCourse.fees !== null
                    ? formatCurrency(
                        collegeCourse.fees,
                      )
                    : "Not Available"
                }
              />

              <InfoRow
                label="Seats"
                value={
                  collegeCourse.seats !== null
                    ? collegeCourse.seats.toLocaleString(
                        "en-IN",
                      )
                    : "Not Available"
                }
              />
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

function ArticleAuthor({
  college,
}: {
  college: CollegeDetail;
}) {
  const updatedDate =
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
          <span className="font-bold text-[#15945c]">
            College Aadhar Team
          </span>

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#15945c] text-xs text-white">
            ✓
          </span>
        </div>

        <p className="text-sm text-gray-500">
          {updatedDate
            ? `Updated on ${updatedDate}`
            : "College Information Team"}
        </p>
      </div>
    </div>
  );
}

function CourseTableOfContents() {
  return (
    <div className="mt-8 border border-gray-300 bg-gray-50 p-5">
      <h2 className="text-lg font-bold text-gray-800">
        Table of Content
      </h2>

      <ol className="mt-4 list-decimal space-y-2 pl-6">
        <li>
          <a
            href="#quick-overview"
            className="text-[#15945c] hover:underline"
          >
            Course and Fees Quick Overview
          </a>
        </li>

        <li>
          <a
            href="#courses"
            className="text-[#15945c] hover:underline"
          >
            Courses & Fees
          </a>
        </li>
      </ol>
    </div>
  );
}

function CourseQuickDetails({
  collegeCourse,
  course,
}: {
  collegeCourse: CollegeDetail["courses"][number];
  course: CollegeDetail["courses"][number]["course"];
}) {
  return (
    <section
      id="quick-overview"
      className="mt-8 scroll-mt-24"
    >
      <h2 className="text-2xl font-bold text-gray-900">
        Course Quick Overview
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickDetail
          label="Course"
          value={course.name}
        />

        <QuickDetail
          label="Level"
          value={course.level}
        />

        <QuickDetail
          label="Duration"
          value={formatDuration(
            collegeCourse.duration,
            course.durationYears,
          )}
        />

        <QuickDetail
          label="Fees"
          value={
            collegeCourse.fees !== null
              ? formatCurrency(
                  collegeCourse.fees,
                )
              : "Not Available"
          }
        />

        <QuickDetail
          label="Seats"
          value={
            collegeCourse.seats !== null
              ? collegeCourse.seats.toLocaleString(
                  "en-IN",
                )
              : "Not Available"
          }
        />

        <QuickDetail
          label="Degree"
          value={course.degree}
        />
      </div>
    </section>
  );
}

function QuickDetail({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-6">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

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