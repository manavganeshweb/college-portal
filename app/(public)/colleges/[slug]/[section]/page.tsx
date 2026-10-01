
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCollegeBySlug } from "@/services/college.service";

import CollegePageClient from "../CollegePageClient";

type CollegeSectionPageProps = {
  params: Promise<{
    slug: string;
    section: string;
  }>;
};

export const revalidate = 3600;

const validSections = [
  "courses-fees",
  "admission",
  "placements",
  "cutoff",
  "rankings",
  "infrastructure",
  "faculty",
  "reviews",
  "qna",
    "photos",
];

export async function generateMetadata({
  params,
}: CollegeSectionPageProps): Promise<Metadata> {
  const { slug, section } = await params;

  const college = await getCollegeBySlug(slug);

  if (!college) {
    return {
      title: "College Not Found | College Aadhar",
      description: "The requested college could not be found.",
    };
  }

  /*
   * Check whether the URL is a course URL.
   *
   * Example:
   * /colleges/maharshi-dayanand-university/btech-computer-science-engineering
   */
  const collegeCourse = college.courses.find(
    (item) => item.course.slug === section,
  );

  if (collegeCourse) {
    const course = collegeCourse.course;

    const title = `${course.name} at ${college.name} - Fees, Duration, Eligibility`;

    const description =
      course.description ||
      `Check ${course.name} at ${college.name}, including fees, duration, eligibility, seats and other course details.`;

    return {
      title,
      description,

      keywords: college.seoKeywords || undefined,

      alternates: {
        canonical: `/colleges/${college.slug}/${course.slug}`,
      },

      openGraph: {
        title,
        description,
        type: "website",
        url: `/colleges/${college.slug}/${course.slug}`,
        siteName: "College Aadhar",

        ...(college.ogImage || college.coverImage
          ? {
              images: [
                {
                  url:
                    college.ogImage ||
                    college.coverImage!,
                  width: 1200,
                  height: 630,
                  alt: `${college.name} campus`,
                },
              ],
            }
          : {}),
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  }

  /*
   * Existing college section URL.
   */
  const navigationItem =
    college.navigationItems.find(
      (item) => item.slug === section,
    );

  if (
    !navigationItem ||
    !validSections.includes(section)
  ) {
    return {
      title: "Page Not Found | College Aadhar",
      description:
        "The requested college section could not be found.",
    };
  }

  const sectionName = navigationItem.label;

  const titleMap: Record<string, string> = {
    "courses-fees": `${college.name} Courses & Fees 2026`,
    admission: `${college.name} Admission 2026`,
    placements: `${college.name} Placements 2026`,
    cutoff: `${college.name} Cutoff 2026`,
    rankings: `${college.name} Rankings 2026`,
    infrastructure: `${college.name} Infrastructure`,
    faculty: `${college.name} Faculty`,
    reviews: `${college.name} Reviews`,
     photos: `${college.name} Photos`,
    qna: `${college.name} Q&A`,
  };

  const title =
    titleMap[section] ||
    `${college.name} ${sectionName} | College Aadhar`;

  const description =
    college.seoDescription ||
    `Explore ${sectionName.toLowerCase()} information for ${college.name}, including courses, fees, admission, placements and other important details.`;

  return {
    title,
    description,

    keywords: college.seoKeywords || undefined,

    alternates: {
      canonical: `/colleges/${college.slug}/${section}`,
    },

    openGraph: {
      title,
      description,
      type: "website",
      url: `/colleges/${college.slug}/${section}`,
      siteName: "College Aadhar",

      ...(college.ogImage || college.coverImage
        ? {
            images: [
              {
                url:
                  college.ogImage ||
                  college.coverImage!,
                width: 1200,
                height: 630,
                alt: `${college.name} campus`,
              },
            ],
          }
        : {}),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CollegeSectionPage({
  params,
}: CollegeSectionPageProps) {
  const { slug, section } = await params;

  const college = await getCollegeBySlug(slug);

  if (!college) {
    notFound();
  }

  /*
   * Check if the second URL segment is a course slug.
   *
   * Example:
   *
   * /colleges/maharshi-dayanand-university/
   * btech-computer-science-engineering
   */
  const collegeCourse = college.courses.find(
    (item) => item.course.slug === section,
  );

  if (collegeCourse) {
    return (
      <CollegePageClient
        college={college}
      />
    );
  }

  /*
   * Otherwise it must be one of the existing
   * college navigation sections.
   */
  const navigationItem =
    college.navigationItems.find(
      (item) => item.slug === section,
    );

  if (
    !navigationItem ||
    !validSections.includes(section)
  ) {
    notFound();
  }

  return <CollegePageClient college={college} />;
}
