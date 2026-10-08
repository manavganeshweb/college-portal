import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import CollegeEditForm from "./CollegeEditForm";

type EditCollegePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCollegePage({
  params,
}: EditCollegePageProps) {
  const { id } = await params;

  const [college, states] = await Promise.all([
    prisma.college.findUnique({
      where: {
        id,
      },
      select: {
  id: true,
  name: true,
  shortName: true,
  slug: true,
  description: true,
  establishedYear: true,
  collegeType: true,
  website: true,
  email: true,
  phone: true,
  address: true,
  stateId: true,
  cityId: true,
  logo: true,
  coverImage: true,
  verified: true,
  status: true,

  seoTitle: true,
  seoDescription: true,
  seoKeywords: true,
  canonicalUrl: true,
  ogTitle: true,
  ogDescription: true,
  ogImage: true,

  navigationItems: {
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      label: true,
      slug: true,
      sectionId: true,
      sortOrder: true,
      isActive: true,
    },
  },
},
    }),

    prisma.state.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        cities: {
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  if (!college) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Admin</span>
          <span>/</span>
          <span>Colleges</span>
          <span>/</span>
          <span>Edit</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Edit College
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update college information, location, verification and SEO details.
        </p>
      </div>

     <CollegeEditForm
  college={{
    ...college,
    establishedYear: college.establishedYear ?? null,
    navigationItems: college.navigationItems ?? [],
  }}
  states={states}
/>
    </div>
  );
}