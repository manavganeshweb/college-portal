import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AddCollegeCourseForm from "./AddCollegeCourseForm";

type AddCollegeCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AddCollegeCoursePage({
  params,
}: AddCollegeCoursePageProps) {
  const { id } = await params;

  const [college, courses] = await Promise.all([
    prisma.college.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.course.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        degree: true,
        level: true,
        averageFees: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!college) {
    notFound();
  }

  const availableCourses = courses.map((course) => ({
    ...course,
    averageFees:
      course.averageFees !== null
        ? Number(course.averageFees)
        : null,
  }));

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/admin/colleges/${college.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to College
        </Link>

        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <BookOpen className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add Course
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add a course offered by {college.name}.
            </p>
          </div>
        </div>
      </div>

      <AddCollegeCourseForm
        collegeId={college.id}
        courses={availableCourses}
      />
    </div>
  );
}