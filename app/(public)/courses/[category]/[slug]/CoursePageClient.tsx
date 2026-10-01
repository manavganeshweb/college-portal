"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import {
  getCourseBySlug,
  getCourses,
} from "@/services/course.service";

import CourseAdmission from "../../../components/public/course/CourseAdmission";
import CourseCareers from "../../../components/public/course/CourseCareers";
import CourseEligibility from "../../../components/public/course/CourseEligibility";
import CourseEntranceExams from "../../../components/public/course/CourseEntranceExams";
import CourseFAQs from "../../../components/public/course/CourseFAQs";
import CourseFees from "../../../components/public/course/CourseFees";
import CourseHero from "../../../components/public/course/CourseHero";
import CourseNavigation from "../../../components/public/course/CourseNavigation";
import CourseOverview from "../../../components/public/course/CourseOverview";
import CourseRelatedCourses from "../../../components/public/course/CourseRelatedCourses";
import CourseSalary from "../../../components/public/course/CourseSalary";
import CourseSyllabus from "../../../components/public/course/CourseSyllabus";
import CourseSkills from "../../../components/public/course/CourseSkills";
import CourseSpecializations from "../../../components/public/course/CourseSpecializations";
import CourseTopColleges from "../../../components/public/course/CourseTopColleges";
import CourseWhyStudy from "../../../components/public/course/CourseWhyStudy";
import CourseSidebar from "../../../components/public/course/CourseSidebar";

type CourseDetail = NonNullable<
  Awaited<ReturnType<typeof getCourseBySlug>>
>;

type RelatedCourses = Awaited<
  ReturnType<typeof getCourses>
>["courses"];

type CoursePageClientProps = {
  course: CourseDetail;
  relatedCourses: RelatedCourses;
  categorySlug: string;
};

function getActiveSection(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);

  /*
   * /courses/engineering/btech-computer-science-engineering
   * parts = ["courses", "engineering", "btech-computer-science-engineering"]
   *
   * /courses/engineering/btech-computer-science-engineering/fees
   * parts = ["courses", "engineering", "btech-computer-science-engineering", "fees"]
   */

  if (parts.length < 4) {
    return "overview";
  }

  return parts[parts.length - 1] || "overview";
}

export default function CoursePageClient({
  course,
  relatedCourses,
  categorySlug,
}: CoursePageClientProps) {
  const pathname = usePathname();

  const activeSection = useMemo(
    () => getActiveSection(pathname),
    [pathname],
  );

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* HERO */}
      <CourseHero course={course} />

      {/* NAVIGATION */}
      <CourseNavigation
        categorySlug={categorySlug}
        courseSlug={course.slug}
        navigationItems={course.navigationItems}
        activeSection={activeSection}
      />

      {/* CONTENT */}
      <div className="mx-auto max-w-[1320px] px-4 py-8 lg:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <main className="min-w-0">
            {activeSection === "overview" && (
              <CourseOverview
                courseName={course.name}
                description={course.description}
                degree={course.degree}
                level={course.level}
                durationYears={course.durationYears}
                categoryName={course.category.name}
              />
            )}

            {activeSection === "why-study" && (
              <CourseWhyStudy
                courseName={course.name}
              />
            )}

            {activeSection === "eligibility" && (
              <CourseEligibility
                eligibility={course.eligibility}
              />
            )}

            {activeSection === "admission" && (
              <CourseAdmission
                courseName={course.name}
              />
            )}

            {activeSection === "entrance-exams" && (
              <CourseEntranceExams
                courseName={course.name}
              />
            )}

            {activeSection === "fees" && (
              <CourseFees
                courseName={course.name}
                averageFees={course.averageFees}
                colleges={course.colleges}
              />
            )}

            {activeSection === "top-colleges" && (
              <CourseTopColleges
                courseName={course.name}
                colleges={course.colleges}
              />
            )}

            {activeSection === "syllabus" && (
              <CourseSyllabus
                courseName={course.name}
              />
            )}

            {activeSection === "specializations" && (
              <CourseSpecializations
                courseName={course.name}
              />
            )}

            {activeSection === "careers" && (
              <CourseCareers
                courseName={course.name}
                careerOptions={course.careerOptions}
              />
            )}

            {activeSection === "salary" && (
              <CourseSalary
                courseName={course.name}
              />
            )}

            {activeSection === "skills" && (
              <CourseSkills
                courseName={course.name}
              />
            )}

            {activeSection === "related-courses" && (
              <CourseRelatedCourses
                currentCourseId={course.id}
                courses={relatedCourses}
              />
            )}

            {activeSection === "faqs" && (
              <CourseFAQs
                courseName={course.name}
              />
            )}
          </main>

          {/* PERSISTENT SIDEBAR */}
          <CourseSidebar
            courseName={course.name}
            degree={course.degree}
            level={course.level}
            durationYears={course.durationYears}
            averageFees={course.averageFees}
            collegeCount={course.colleges.length}
            categoryName={course.category.name}
            categorySlug={course.category.slug}
          />
        </div>
      </div>
    </div>
  );
}