import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { getCollegeBySlug } from "@/services/college.service";
import CollegePageClient from "../../colleges/[slug]/CollegePageClient";

type UniversityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: UniversityPageProps): Promise<Metadata> {
  const { slug } = await params;

  const university = await getCollegeBySlug(slug);

  if (!university || university.institutionKind !== "UNIVERSITY") {
    return {
      title: "University Not Found | College Aadhar",
    };
  }

  const title =
    university.seoTitle ||
    `${university.name}: Admission 2026, Courses, Fees, Ranking, Placements`;

  const description =
    university.seoDescription ||
    university.description ||
    `Explore ${university.name}, including courses, fees, admissions, placements, rankings, and more.`;

  return {
    title,
    description,
    keywords: university.seoKeywords || undefined,

    alternates: {
      canonical: `/universities/${university.slug}`,
    },

    openGraph: {
      title: university.ogTitle || title,
      description: university.ogDescription || description,
      url: `/universities/${university.slug}`,
      images: university.ogImage
        ? [{ url: university.ogImage }]
        : undefined,
    },
  };
}

export default async function UniversityPage({
  params,
}: UniversityPageProps) {
  const { slug } = await params;

  const university = await getCollegeBySlug(slug);

  if (!university) {
    notFound();
  }

  // A university must use the university URL namespace.
  if (university.institutionKind !== "UNIVERSITY") {
    redirect(`/colleges/${university.slug}`);
  }

  return <CollegePageClient college={university} />;
}