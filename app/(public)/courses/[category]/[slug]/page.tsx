import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCourseBySlug,
  getCourses,
} from "@/services/course.service";

import CoursePageClient from "./CoursePageClient";

type CoursePageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export const revalidate = 3600;

function normalizeCategory(category: string) {
  return decodeURIComponent(category)
    .trim()
    .toLowerCase();
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { category, slug } = await params;

  const normalizedCategory = normalizeCategory(category);

  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found | College Aadhar",
      description:
        "The requested course could not be found.",
    };
  }

  /*
   * Make sure the course actually belongs to the
   * category present in the URL.
   *
   * Example:
   * /courses/engineering/btech-computer-science-engineering
   * is valid.
   *
   * /courses/management/btech-computer-science-engineering
   * is not.
   */
  if (course.category.slug !== normalizedCategory) {
    return {
      title: "Course Not Found | College Aadhar",
      description:
        "The requested course could not be found in this category.",
    };
  }

  const title = `${course.name} - Fees, Eligibility, Colleges & Careers | College Aadhar`;

  const description =
    course.description ||
    `Get complete information about ${course.name}, including fees, eligibility, admission, top colleges, syllabus, careers and more.`;

  const canonicalUrl = `/courses/${course.category.slug}/${course.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "College Aadhar",
    },
  };
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const { category, slug } = await params;

  const normalizedCategory = normalizeCategory(category);

  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  /*
   * Validate the category in the URL against the
   * actual category stored on the course.
   */
  if (course.category.slug !== normalizedCategory) {
    notFound();
  }

  const relatedResult = await getCourses({
    categoryId: course.category.id,
    level: course.level,
    page: 1,
    limit: 12,
  });

  const relatedCourses = relatedResult.courses.filter(
    (item) => item.id !== course.id,
  );

  return (
    <CoursePageClient
      course={course}
      relatedCourses={relatedCourses}
      categorySlug={course.category.slug}
    />
  );
}