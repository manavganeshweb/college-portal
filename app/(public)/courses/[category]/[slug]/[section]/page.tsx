import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getCourseBySlug,
  getCourses,
} from "@/services/course.service";

import CoursePageClient from "../CoursePageClient";

type CourseSectionPageProps = {
  params: Promise<{
    category: string;
    slug: string;
    section: string;
  }>;
};

export const revalidate = 3600;

const validSections = [
  "why-study",
  "eligibility",
  "admission",
  "entrance-exams",
  "fees",
  "top-colleges",
  "syllabus",
  "specializations",
  "careers",
  "salary",
  "skills",
  "related-courses",
  "faqs",
];

function normalizeLevel(level: string) {
  return decodeURIComponent(level)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getExpectedCourseLevel(level: string) {
  const normalizedLevel = normalizeLevel(level);

  const levelMap: Record<string, string> = {
    "b.tech": "UG",
    btech: "UG",
    "b-tech": "UG",

    "m.tech": "PG",
    mtech: "PG",
    "m-tech": "PG",

    bca: "UG",
    bba: "UG",

    mba: "PG",
    mca: "PG",

    diploma: "DIPLOMA",
    phd: "PHD",
    certificate: "CERTIFICATE",
  };

  return levelMap[normalizedLevel] ?? null;
}

function getSectionTitle(
  courseName: string,
  section: string
) {
  const titleMap: Record<string, string> = {
    "why-study": `Why Study ${courseName}?`,
    eligibility: `${courseName} Eligibility`,
    admission: `${courseName} Admission 2026`,
    "entrance-exams": `${courseName} Entrance Exams`,
    fees: `${courseName} Fees`,
    "top-colleges": `Top Colleges for ${courseName}`,
    syllabus: `${courseName} Syllabus`,
    specializations: `${courseName} Specializations`,
    careers: `${courseName} Careers`,
    salary: `${courseName} Salary`,
    skills: `Skills Required for ${courseName}`,
    "related-courses": `Courses Related to ${courseName}`,
    faqs: `${courseName} FAQs`,
  };

  return (
    titleMap[section] ||
    `${courseName} | College Aadhar`
  );
}

export async function generateMetadata({
  params,
}: CourseSectionPageProps): Promise<Metadata> {
  const {
    category,
    slug,
    section,
  } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found | College Aadhar",
      description:
        "The requested course could not be found.",
    };
  }

  const expectedLevel =
    getExpectedCourseLevel(category);

  if (
    expectedLevel &&
    course.level !== expectedLevel
  ) {
    return {
      title: "Course Not Found | College Aadhar",
    };
  }

  const navigationItem =
    course.navigationItems.find(
      (item) => item.slug === section
    );

  if (
    !navigationItem ||
    !validSections.includes(section)
  ) {
    return {
      title: "Page Not Found | College Aadhar",
      description:
        "The requested course section could not be found.",
    };
  }

  const title = getSectionTitle(
    course.name,
    section
  );

  const description =
    course.description ||
    `Explore ${navigationItem.title.toLowerCase()} information for ${course.name} on College Aadhar.`;

  const canonical = `/courses/${normalizeLevel(category)}/${course.slug}/${section}`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "College Aadhar",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CourseSectionPage({
  params,
}: CourseSectionPageProps) {
  const {
    category,
    slug,
    section,
  } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const expectedLevel =
    getExpectedCourseLevel(category);

  if (
    expectedLevel &&
    course.level !== expectedLevel
  ) {
    notFound();
  }

  const navigationItem =
    course.navigationItems.find(
      (item) => item.slug === section
    );

  if (
    !navigationItem ||
    !validSections.includes(section)
  ) {
    notFound();
  }

  const relatedResult = await getCourses({
    categoryId: course.category.id,
    level: course.level,
    page: 1,
    limit: 12,
  });

  const relatedCourses =
    relatedResult.courses.filter(
      (item) => item.id !== course.id
    );

  return (
    <CoursePageClient
      course={course}
      relatedCourses={relatedCourses}
      categorySlug={normalizeLevel(category)}
    />
  );
}