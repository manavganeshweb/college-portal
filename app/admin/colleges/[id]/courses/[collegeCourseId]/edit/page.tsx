import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import CollegeCourseEditForm from "./CollegeCourseEditForm";

type PageProps = {
  params: Promise<{
    id: string;
    collegeCourseId: string;
  }>;
};

export default async function EditCollegeCoursePage({
  params,
}: PageProps) {
  const { id, collegeCourseId } = await params;

  const [college, collegeCourse] = await Promise.all([
    prisma.college.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),

    prisma.collegeCourse.findFirst({
      where: {
        id: collegeCourseId,
        collegeId: id,
      },
      select: {
        id: true,
        fees: true,
        seats: true,
        duration: true,
        course: {
          select: {
            id: true,
            name: true,
            slug: true,
            shortName: true,
            degree: true,
            level: true,
            status: true,
            averageFees: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
  ]);

  if (!college || !collegeCourse) {
    notFound();
  }

  const course = {
    ...collegeCourse,
    fees:
      collegeCourse.fees !== null
        ? Number(collegeCourse.fees)
        : null,
    duration:
      collegeCourse.duration !== null
        ? Number(collegeCourse.duration)
        : null,
    course: {
      ...collegeCourse.course,
      averageFees:
        collegeCourse.course.averageFees !== null
          ? Number(collegeCourse.course.averageFees)
          : null,
    },
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/admin/colleges/${college.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {college.name}
        </Link>

        <div>
          <p className="text-sm font-medium text-green-700">
            College Course Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Edit College Course
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update the course details for {college.name}.
          </p>
        </div>
      </div>

      {/* Form */}
      <CollegeCourseEditForm
        collegeId={college.id}
        collegeCourse={course}
      />
    </div>
  );
}