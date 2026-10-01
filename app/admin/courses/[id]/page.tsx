import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Pencil,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import CourseEditForm from "./CourseEditForm";

type CoursePageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getCourse(id: string) {
  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      colleges: {
        include: {
          college: {
            select: {
              id: true,
              name: true,
              slug: true,
              shortName: true,
              logo: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          colleges: true,
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  return {
    ...course,
    durationYears:
      course.durationYears !== null
        ? Number(course.durationYears)
        : null,
    averageFees:
      course.averageFees !== null
        ? Number(course.averageFees)
        : null,

    colleges: course.colleges.map((mapping) => ({
      ...mapping,
      fees:
        mapping.fees !== null
          ? Number(mapping.fees)
          : null,
      duration:
        mapping.duration !== null
          ? Number(mapping.duration)
          : null,
    })),
  };
}

async function getCategories() {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export default async function CourseDetailPage({
  params,
}: CoursePageProps) {
  const { id } = await params;

  const [course, categories] = await Promise.all([
    getCourse(id),
    getCategories(),
  ]);

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />

            <h1 className="mt-4 text-xl font-semibold text-slate-900">
              Course not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The course you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {course.name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    course.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {course.status}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                {course.shortName && (
                  <span>{course.shortName}</span>
                )}

                {course.shortName && (
                  <span className="text-slate-300">•</span>
                )}

                <span>{course.slug}</span>
              </div>
            </div>

            <Link
              href={`/courses/${course.slug}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              View Public Page
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <BookOpen className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-slate-500">
                  Level
                </p>
                <p className="font-semibold text-slate-900">
                  {course.level}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Clock3 className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-slate-500">
                  Duration
                </p>

                <p className="font-semibold text-slate-900">
                  {course.durationYears !== null
                    ? `${course.durationYears} Years`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <IndianRupee className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-slate-500">
                  Average Fees
                </p>

                <p className="font-semibold text-slate-900">
                  {course.averageFees !== null
                    ? `₹${course.averageFees.toLocaleString(
                        "en-IN"
                      )}`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Building2 className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-slate-500">
                  Colleges
                </p>

                <p className="font-semibold text-slate-900">
                  {course._count.colleges}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Edit */}
          <CourseEditForm
            course={{
              id: course.id,
              name: course.name,
              shortName: course.shortName,
              slug: course.slug,
              degree: course.degree,
              level: course.level,
              description: course.description,
              durationYears: course.durationYears,
              eligibility: course.eligibility,
              averageFees: course.averageFees,
              careerOptions: course.careerOptions,
              categoryId: course.categoryId,
              status: course.status,
            }}
            categories={categories}
          />

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Category */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Category
              </h2>

              <div className="mt-4 rounded-xl bg-green-50 p-4">
                <p className="font-medium text-green-800">
                  {course.category.name}
                </p>

                <p className="mt-1 text-xs text-green-700">
                  {course.category.slug}
                </p>
              </div>
            </section>

            {/* Colleges */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                  Colleges
                </h2>

                <span className="text-xs font-medium text-slate-500">
                  {course.colleges.length}
                </span>
              </div>

              {course.colleges.length === 0 ? (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center">
                  <Building2 className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-2 text-sm text-slate-500">
                    No colleges linked yet.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {course.colleges.slice(0, 5).map(
                    (mapping) => (
                      <div
                        key={mapping.id}
                        className="rounded-xl border border-slate-100 p-3"
                      >
                        <div className="flex items-center gap-3">
                          {mapping.college.logo ? (
                            <img
                              src={mapping.college.logo}
                              alt=""
                              className="h-9 w-9 rounded-lg object-contain"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                              <Building2 className="h-4 w-4" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {mapping.college.name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {mapping.college.shortName ||
                                mapping.college.slug}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-4 text-xs text-slate-500">
                          {mapping.fees !== null && (
                            <span>
                              ₹
                              {mapping.fees.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}

                          {mapping.seats !== null && (
                            <span>
                              {mapping.seats} seats
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {course.colleges.length > 5 && (
                <p className="mt-4 text-center text-xs text-slate-500">
                  + {course.colleges.length - 5} more
                  colleges
                </p>
              )}
            </section>

            {/* Status */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Course Status
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <CheckCircle2
                  className={`h-5 w-5 ${
                    course.status === "ACTIVE"
                      ? "text-green-600"
                      : "text-slate-400"
                  }`}
                />

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {course.status === "ACTIVE"
                      ? "Published"
                      : "Inactive"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {course.status === "ACTIVE"
                      ? "Visible on the public platform"
                      : "Hidden from the public platform"}
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}