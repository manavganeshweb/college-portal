import { notFound } from "next/navigation";
import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  IndianRupee,
  BriefcaseBusiness,
  Code2,
  Cpu,
  Database,
  GraduationCap,
  HeartPulse,
  Landmark,
  Lightbulb,
  Microscope,
  Network,
  Palette,
  Scale,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

type EntryLevelConfig = {
  enumValue:
    | "AFTER_10TH"
    | "AFTER_12TH"
    | "AFTER_DIPLOMA"
    | "UNDERGRADUATE"
    | "POSTGRADUATE"
    | "PHD";
  title: string;
  description: string;
};

const ENTRY_LEVELS: Record<string, EntryLevelConfig> = {
  "after-10th": {
    enumValue: "AFTER_10TH",
    title: "Courses After 10th",
    description:
      "Explore courses and programs that students can pursue after completing Class 10.",
  },

  "after-12th": {
    enumValue: "AFTER_12TH",
    title: "Courses After 12th",
    description:
      "Explore undergraduate courses and programs available after completing Class 12.",
  },

  "after-diploma": {
    enumValue: "AFTER_DIPLOMA",
    title: "Courses After Diploma",
    description:
      "Explore higher education options available after completing a diploma.",
  },

  undergraduate: {
    enumValue: "UNDERGRADUATE",
    title: "Undergraduate Courses",
    description:
      "Explore undergraduate courses and programs available at colleges and universities.",
  },

  postgraduate: {
    enumValue: "POSTGRADUATE",
    title: "Postgraduate Courses",
    description:
      "Explore postgraduate courses and programs available after completing an undergraduate degree.",
  },

  phd: {
    enumValue: "PHD",
    title: "PhD Programs",
    description:
      "Explore doctoral and research-oriented programs across different academic disciplines.",
  },
};

type PageProps = {
  params: Promise<{
    entryLevel: string;
  }>;
};

type CourseIconConfig = {
  icon: LucideIcon;
  label: string;
};

function getCourseIcon(
  courseName: string,
  categoryName: string,
): CourseIconConfig {
  const value = `${courseName} ${categoryName}`.toLowerCase();

  if (
    value.includes("computer") ||
    value.includes("software") ||
    value.includes("bca") ||
    value.includes("mca")
  ) {
    return {
      icon: Code2,
      label: "Computer Science",
    };
  }

  if (
    value.includes("artificial intelligence") ||
    value.includes("machine learning") ||
    value.includes("ai ")
  ) {
    return {
      icon: Cpu,
      label: "Artificial Intelligence",
    };
  }

  if (value.includes("data") || value.includes("analytics")) {
    return {
      icon: Database,
      label: "Data & Analytics",
    };
  }

  if (
    value.includes("electrical") ||
    value.includes("electronics")
  ) {
    return {
      icon: Network,
      label: "Electrical & Electronics",
    };
  }

  if (
    value.includes("mechanical") ||
    value.includes("automobile")
  ) {
    return {
      icon: Settings,
      label: "Mechanical Engineering",
    };
  }

  if (
    value.includes("civil") ||
    value.includes("construction")
  ) {
    return {
      icon: Wrench,
      label: "Civil Engineering",
    };
  }

  if (
    value.includes("management") ||
    value.includes("business") ||
    value.includes("mba") ||
    value.includes("bba")
  ) {
    return {
      icon: BriefcaseBusiness,
      label: "Management & Business",
    };
  }

  if (
    value.includes("commerce") ||
    value.includes("finance") ||
    value.includes("account")
  ) {
    return {
      icon: Landmark,
      label: "Commerce & Finance",
    };
  }

  if (
    value.includes("medical") ||
    value.includes("health") ||
    value.includes("nursing")
  ) {
    return {
      icon: HeartPulse,
      label: "Healthcare",
    };
  }

  if (
    value.includes("science") ||
    value.includes("physics") ||
    value.includes("chemistry")
  ) {
    return {
      icon: Microscope,
      label: "Science",
    };
  }

  if (
    value.includes("law") ||
    value.includes("legal")
  ) {
    return {
      icon: Scale,
      label: "Law",
    };
  }

  if (
    value.includes("design") ||
    value.includes("fashion") ||
    value.includes("arts")
  ) {
    return {
      icon: Palette,
      label: "Arts & Design",
    };
  }

  if (
    value.includes("psychology") ||
    value.includes("social") ||
    value.includes("humanities")
  ) {
    return {
      icon: Users,
      label: "Humanities & Social Sciences",
    };
  }

  if (
    value.includes("education") ||
    value.includes("teaching")
  ) {
    return {
      icon: GraduationCap,
      label: "Education",
    };
  }

  if (
    value.includes("security") ||
    value.includes("cyber")
  ) {
    return {
      icon: ShieldCheck,
      label: "Security",
    };
  }

  if (
    value.includes("technology") ||
    value.includes("engineering")
  ) {
    return {
      icon: Lightbulb,
      label: "Technology & Engineering",
    };
  }

  return {
    icon: BookOpen,
    label: "Academic Program",
  };
}

async function getCourses(
  entryLevel: EntryLevelConfig["enumValue"],
) {
  return prisma.course.findMany({
    where: {
      status: "ACTIVE",
      entryLevel,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      level: true,
      durationYears: true,
      averageFees: true,
      eligibility: true,

      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
}

function formatDuration(value: unknown) {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "object" &&
          value !== null &&
          "toNumber" in value
        ? Number(
            (value as { toNumber: () => number }).toNumber(),
          )
        : Number(value);

  return Number.isFinite(numberValue)
    ? `${numberValue} Years`
    : "Not specified";
}

function formatFees(value: unknown) {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "object" &&
          value !== null &&
          "toNumber" in value
        ? Number(
            (value as { toNumber: () => number }).toNumber(),
          )
        : Number(value);

  return Number.isFinite(numberValue)
    ? `₹${numberValue.toLocaleString("en-IN")}`
    : "Not specified";
}

export async function generateStaticParams() {
  return Object.keys(ENTRY_LEVELS).map((entryLevel) => ({
    entryLevel,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { entryLevel } = await params;

  const config = ENTRY_LEVELS[entryLevel];

  if (!config) {
    return {
      title: "Courses | College Aadhar",
    };
  }

  return {
    title: `${config.title} | College Aadhar`,
    description: config.description,
  };
}

export default async function EntryLevelCoursesPage({
  params,
}: PageProps) {
  const { entryLevel } = await params;

  const config = ENTRY_LEVELS[entryLevel];

  if (!config) {
    notFound();
  }

  const courses = await getCourses(config.enumValue);

  return (
    <main className="min-h-screen bg-white">
      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-green-50 via-white to-emerald-50/40">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-green-200/30 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

          <div className="absolute right-8 top-12 hidden h-40 w-40 rounded-full border border-green-200/60 lg:block" />

          <div className="absolute right-16 top-20 hidden h-24 w-24 rounded-full border border-green-200/50 lg:block" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-2 text-sm text-slate-500"
          >
            <Link
              href="/courses"
              className="transition hover:text-[#15945c]"
            >
              Courses
            </Link>

            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />

            <span className="font-medium text-slate-700">
              {config.title}
            </span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
            {/* Hero content */}
            <div className="max-w-4xl">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/90 px-3.5 py-1.5 text-sm font-semibold text-[#15945c] shadow-sm backdrop-blur">
                <BookOpen className="h-4 w-4" />
                College Aadhar Course Directory
              </div>

              {/* Heading */}
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                {config.title}
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {config.description}
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                Discover courses, understand eligibility, compare duration and
                fees, and explore colleges offering the programs you are
                interested in.
              </p>

              {/* Quick stats */}
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <BookOpen className="h-4 w-4 text-[#15945c]" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Available
                    </p>

                    <p className="text-sm font-bold text-slate-900">
                      {courses.length}{" "}
                      {courses.length === 1 ? "Course" : "Courses"}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <Clock3 className="h-4 w-4 text-[#15945c]" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Explore
                    </p>

                    <p className="text-sm font-bold text-slate-900">
                      Duration & Fees
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview card */}
            <div className="relative">
              <div className="rounded-3xl border border-green-100 bg-white/90 p-6 shadow-xl shadow-green-900/5 backdrop-blur sm:p-7">
                {/* Card header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15945c]">
                      Course Overview
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      {config.title}
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    <BookOpen className="h-5 w-5 text-[#15945c]" />
                  </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-slate-100" />

                {/* Overview points */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50">
                      <Check className="h-3.5 w-3.5 text-[#15945c]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Find relevant programs
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        Browse active courses available for this education level.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50">
                      <Check className="h-3.5 w-3.5 text-[#15945c]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Compare key details
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        Review course level, duration, fees and eligibility.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50">
                      <Check className="h-3.5 w-3.5 text-[#15945c]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Explore colleges
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        Open a course to discover colleges offering the program.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <Link
                  href="/courses"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#15945c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#117d4e]"
                >
                  Browse All Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* AVAILABLE COURSES */}
      {/* ========================================================= */}

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#15945c]">
                Course Directory
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Available Courses
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Explore popular courses first, then browse the complete list of
                programs available at this entry level.
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-[#15945c]">
              {courses.length}{" "}
              {courses.length === 1 ? "Course" : "Courses"}
            </div>
          </div>

          {courses.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate-400" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No courses available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Courses for this entry level will appear here once they are
                added.
              </p>
            </div>
          ) : (
            <>
              {/* ===================================================== */}
              {/* FIRST 6 COURSES — CARD VIEW */}
              {/* ===================================================== */}

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {courses.slice(0, 6).map((course) => {
                  const courseIcon = getCourseIcon(
                    course.name,
                    course.category.name,
                  );

                  const Icon = courseIcon.icon;

                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.category.slug}/${course.slug}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#15945c] transition-colors group-hover:bg-[#15945c] group-hover:text-white">
                          <Icon className="h-6 w-6" />
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {course.category.name}
                        </span>
                      </div>

                      <div className="mt-5">
                        <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-[#15945c]">
                          {course.name}
                        </h3>

                        {course.shortName && (
                          <p className="mt-1 text-sm font-medium text-slate-500">
                            {course.shortName}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <BookOpen className="h-3.5 w-3.5" />
                            Level
                          </div>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {course.level}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Clock3 className="h-3.5 w-3.5" />
                            Duration
                          </div>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {formatDuration(course.durationYears)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-3">
                        <IndianRupee className="h-4 w-4 text-[#15945c]" />

                        <div>
                          <p className="text-xs text-slate-500">
                            Average Fees
                          </p>

                          <p className="text-sm font-semibold text-slate-800">
                            {formatFees(course.averageFees)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-sm font-semibold text-slate-600">
                          View Course Details
                        </span>

                        <ArrowRight className="h-4 w-4 text-[#15945c] transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* ===================================================== */}
              {/* COMPLETE COURSE LIST */}
              {/* ===================================================== */}

              {courses.length > 6 && (
                <div className="mt-12">
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-slate-900">
                      Complete Course List
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Browse all {courses.length} courses available under this
                      entry level.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="course-list-table w-full min-w-[900px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                              Course
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                              Category
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                              Level
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                              Duration
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                              Average Fees
                            </th>

                            <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {courses.map((course) => {
                            const courseIcon = getCourseIcon(
                              course.name,
                              course.category.name,
                            );

                            const Icon = courseIcon.icon;

                            return (
                              <tr
                                key={course.id}
                                className="course-list-row group transition-colors hover:bg-emerald-50/40"
                              >
                                {/* Course */}
                                <td className="px-5 py-4">
                                  <Link
                                    href={`/courses/${course.category.slug}/${course.slug}`}
                                    className="flex min-w-[280px] items-center gap-3"
                                  >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#15945c] transition-colors group-hover:bg-[#15945c] group-hover:text-white">
                                      <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="font-semibold text-slate-900 transition-colors group-hover:text-[#15945c]">
                                        {course.name}
                                      </p>

                                      {course.shortName && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                          {course.shortName}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                </td>

                                {/* Category */}
                                <td className="px-5 py-4">
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                    {course.category.name}
                                  </span>
                                </td>

                                {/* Level */}
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <GraduationCap className="h-4 w-4 text-[#15945c]" />
                                    {course.level}
                                  </div>
                                </td>

                                {/* Duration */}
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Clock3 className="h-4 w-4 text-[#15945c]" />
                                    {formatDuration(course.durationYears)}
                                  </div>
                                </td>

                                {/* Fees */}
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                                    <IndianRupee className="h-4 w-4 text-[#15945c]" />
                                    {formatFees(course.averageFees)}
                                  </div>
                                </td>

                                {/* Action */}
                                <td className="px-5 py-4 text-right">
                                  <Link
                                    href={`/courses/${course.category.slug}/${course.slug}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-[#15945c] transition-colors hover:bg-[#15945c] hover:text-white"
                                  >
                                    View
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

  
     
    </main>
  );
}