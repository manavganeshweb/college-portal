"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import type { CollegeDetail } from "@/services/college.service";

import CollegeHero from "../../components/public/college/CollegeHero";
import CollegeNavigation from "../../components/public/college/CollegeNavigation";
import CollegeSidebar from "../../components/public/college/CollegeSidebar";
import CollegePhotos from "../../components/public/college/CollegePhotos";
import CollegeOverview from "../../components/public/college/CollegeOverview";
import CollegeCoursesFees from "../../components/public/college/CollegeCoursesFees";
import CollegeAdmission from "../../components/public/college/CollegeAdmission";
import CollegePlacements from "../../components/public/college/CollegePlacements";
import CollegeCutoff from "../../components/public/college/CollegeCutoffs";
import CollegeRankings from "../../components/public/college/CollegeRankings";
import CollegeInfrastructure from "../../components/public/college/CollegeInfrastructure";
import CollegeFaculty from "../../components/public/college/CollegeFaculty";
import CollegeReviews from "../../components/public/college/CollegeReviews";
import CollegeQnA from "../../components/public/college/CollegeQnA";

type CollegePageClientProps = {
  college: CollegeDetail;
};

function getActiveSection(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length < 3) {
    return "overview";
  }

  return parts[parts.length - 1] || "overview";
}

function getPageTitle(
  college: CollegeDetail,
  section: string,
) {
  switch (section) {
    case "courses-fees":
      return `${college.name} Courses & Fees 2026`;

    case "admission":
      return `${college.name} Admission 2026`;

    case "placements":
      return `${college.name} Placements 2026`;

    case "cutoff":
      return `${college.name} Cutoff 2026`;

    case "rankings":
      return `${college.name} Ranking 2026`;

    case "infrastructure":
      return `${college.name} Infrastructure`;

    case "faculty":
      return `${college.name} Faculty`;

    case "reviews":
      return `${college.name} Reviews`;

    case "photos":
      return `${college.name} Photos`;

    case "qna":
      return `${college.name} Q&A`;

   default:
  return college.name;
  }
}

export default function CollegePageClient({
  college,
}: CollegePageClientProps) {
  const pathname = usePathname();

  const activeSection = useMemo(
    () => getActiveSection(pathname),
    [pathname],
  );

  /*
   * Check whether the current URL points to a course.
   *
   * Example:
   * /colleges/maharshi-dayanand-university/btech-computer-science-engineering
   */
  const selectedCourse = useMemo(
    () =>
      college.courses.find(
        (item) => item.course.slug === activeSection,
      ) ?? null,
    [college.courses, activeSection],
  );

  const selectedCourseSlug =
    selectedCourse?.course.slug ?? null;

  /*
   * Course type is no longer stored in the URL.
   *
   * Keep the existing value expected by
   * CollegeCoursesFees for compatibility.
   */
  const courseType = selectedCourse
    ? "Part-Time"
    : null;

  /*
   * For course URLs, show the course name as
   * the page title.
   */
  const pageTitle = selectedCourse
    ? `${selectedCourse.course.name} at ${college.name}`
    : getPageTitle(college, activeSection);

  /*
   * Navigation should still highlight
   * Courses & Fees when viewing a course.
   */
  const navigationSection = selectedCourse
    ? "courses-fees"
    : activeSection;

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* HERO */}
      <CollegeHero
        college={{
          id: college.id,
          name: college.name,
          slug: college.slug,
          shortName: college.shortName,
          logo: college.logo,
          coverImage: college.coverImage,
          description: college.description,
          collegeType: college.collegeType,
          establishedYear: college.establishedYear,
          website: college.website,
          verified: college.verified,
          state: college.state,
          city: college.city,
          reviews: college.reviews.map((review) => ({
            id: review.id,
          })),
        }}
        pageTitle={pageTitle}
      />

      {/* NAVIGATION */}
      <CollegeNavigation
        collegeSlug={college.slug}
        navigationItems={college.navigationItems}
        activeSection={navigationSection}
      />

      {/* CONTENT */}
      <div className="mx-auto max-w-[1320px] px-4 py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <main className="min-w-0">
            {/* OVERVIEW */}
            {activeSection === "overview" && (
              <CollegeOverview college={college} />
            )}

            {/* COURSES & FEES */}
            {(activeSection === "courses-fees" ||
              selectedCourse) && (
              <CollegeCoursesFees
                college={college}
                selectedCourseSlug={selectedCourseSlug}
                courseType={courseType}
              />
            )}

            {/* ADMISSION */}
            {activeSection === "admission" && (
              <CollegeAdmission college={college} />
            )}

            {/* PLACEMENTS */}
            {activeSection === "placements" && (
              <CollegePlacements college={college} />
            )}

            {/* CUTOFF */}
            {activeSection === "cutoff" && (
              <CollegeCutoff
                collegeName={college.name}
                cutoffs={college.cutoffs}
              />
            )}

            {/* RANKINGS */}
            {activeSection === "rankings" && (
              <CollegeRankings
                collegeName={college.name}
                rankings={college.rankings}
              />
            )}

            {/* INFRASTRUCTURE */}
            {activeSection === "infrastructure" && (
              <CollegeInfrastructure
                collegeName={college.name}
                infrastructure={college.infrastructure}
                photos={college.photos}
              />
            )}

            {/* FACULTY */}
            {activeSection === "faculty" && (
              <CollegeFaculty
                collegeName={college.name}
                departments={college.departments}
              />
            )}

            {/* REVIEWS */}
            {activeSection === "reviews" && (
              <CollegeReviews college={college} />
            )}

            {/* COLLEGE PHOTOS */}
            {activeSection === "photos" && (
              <CollegePhotos college={college} />
            )}

            {/* Q&A */}
            {activeSection === "qna" && (
              <CollegeQnA
                collegeName={college.name}
                questions={college.questions}
              />
            )}
          </main>

          {/* PERSISTENT SIDEBAR */}
          <CollegeSidebar college={college} />
        </div>
      </div>
    </div>
  );
}