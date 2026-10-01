
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCollegeBySlug } from "@/services/college.service";
import CollegePageClient from "./CollegePageClient";

type CollegePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: CollegePageProps): Promise<Metadata> {
  const { slug } = await params;

  const college = await getCollegeBySlug(slug);

  if (!college) {
    return {
      title: "College Not Found | College Aadhar",
    };
  }

  const title =
    college.seoTitle ||
    `${college.name}: Admission 2026, Fees, Courses, Cutoff, Ranking, Placement`;

  const description =
    college.seoDescription ||
    college.description ||
    `Get complete information about ${college.name}, including courses, fees, admission, placements, rankings and more.`;

  const canonical =
    college.canonicalUrl || `/colleges/${college.slug}`;

  return {
    title,
    description,
    keywords: college.seoKeywords || undefined,

    alternates: {
      canonical,
    },

    openGraph: {
      title:
        college.ogTitle ||
        title,

      description:
        college.ogDescription ||
        description,

      images: college.ogImage
        ? [
            {
              url: college.ogImage,
            },
          ]
        : undefined,
    },
  };
}

export default async function CollegePage({
  params,
}: CollegePageProps) {
  const { slug } = await params;

  const college = await getCollegeBySlug(slug);

  if (!college) {
    notFound();
  }

  return <CollegePageClient college={college} />;
}
