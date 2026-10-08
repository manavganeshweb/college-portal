import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Library,
  Sparkles,
    Briefcase,
  Laptop,
  Landmark,
  Microscope,
  Scale,
  Stethoscope,
} from "lucide-react";

import CourseLevelDirectory from "../components/public/CourseLevelDirectory";
import { getCourses } from "@/services/course.service";
import { prisma } from "@/lib/prisma";

import CourseCard from "../components/public/CourseCard";
import CourseFilters from "../components/public/CourseFilters";

export const revalidate = 3600;

type CoursesPageProps = {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    level?: string;
    page?: string;
  }>;
};
type CategoryDisplay = {
  slug: string;
  name: string;
  courses: {
    name: string;
    slug: string;
  }[];
};
const categoryDirectory: CategoryDisplay[] = [
  {
    slug: "engineering",
    name: "Engineering",
    courses: [
      {
        name: "BE/B.Tech",
        slug: "btech",
      },
      {
        name: "ME/M.Tech",
        slug: "mtech",
      },
      {
        name: "Polytechnic",
        slug: "polytechnic",
      },
    ],
  },
  {
    slug: "medical",
    name: "Medical",
    courses: [
      {
        name: "BAMS",
        slug: "bams",
      },
      {
        name: "B.Sc (Medicine)",
        slug: "bsc-medicine",
      },
      {
        name: "BHMS",
        slug: "bhms",
      },
      {
        name: "Bachelor of Physiotherapy (BPT)",
        slug: "bachelor-of-physiotherapy",
      },
    ],
  },
  {
    slug: "science",
    name: "Science",
    courses: [
      {
        name: "M.Sc",
        slug: "msc",
      },
      {
        name: "B.Sc",
        slug: "bsc",
      },
      {
        name: "B.F.Sc",
        slug: "bfsc",
      },
      {
        name: "M.F.Sc",
        slug: "mfsc",
      },
    ],
  },
  {
    slug: "commerce",
    name: "Commerce",
    courses: [
      {
        name: "M.Com",
        slug: "mcom",
      },
      {
        name: "B.Com",
        slug: "bcom",
      },
    ],
  },
  {
    slug: "management",
    name: "Management",
    courses: [
      {
        name: "BBA/BMS",
        slug: "bba",
      },
      {
        name: "MBA/PGDM",
        slug: "mba",
      },
      {
        name: "BHM (Hospital)",
        slug: "bachelor-of-hospital-management",
      },
      {
        name: "Executive MBA",
        slug: "executive-mba",
      },
    ],
  },
  {
    slug: "arts",
    name: "Arts",
    courses: [
      {
        name: "BA",
        slug: "ba",
      },
      {
        name: "BFA",
        slug: "bfa",
      },
      {
        name: "BSW",
        slug: "bsw",
      },
      {
        name: "MA",
        slug: "ma",
      },
    ],
  },
  {
    slug: "computer-applications",
    name: "Computer Applications",
    courses: [
      {
        name: "BCA",
        slug: "bca",
      },
      {
        name: "MCA",
        slug: "mca",
      },
    ],
  },
  {
    slug: "education",
    name: "Education",
    courses: [
      {
        name: "B.Ed",
        slug: "bed",
      },
      {
        name: "B.P.Ed",
        slug: "bped",
      },
      {
        name: "M.Ed",
        slug: "med",
      },
      {
        name: "M.P.Ed",
        slug: "mped",
      },
    ],
  },
  {
    slug: "law",
    name: "Law",
    courses: [
      {
        name: "LLB",
        slug: "llb",
      },
      {
        name: "LLM",
        slug: "llm",
      },
      {
        name: "BA/BBA LLB",
        slug: "ba-llb",
      },
    ],
  },
];
const categoryIcons = {
  engineering: GraduationCap,
  medical: Stethoscope,
  science: Microscope,
  commerce: Landmark,
  management: Briefcase,
  arts: BookOpen,
  "computer-applications": Laptop,
  education: GraduationCap,
  law: Scale,
};
const VALID_LEVELS = [
  "UG",
  "PG",
  "DIPLOMA",
  "PHD",
  "CERTIFICATE",
] as const;


type ValidLevel = (typeof VALID_LEVELS)[number];

async function getLevelDirectoryCourses() {
  return prisma.course.findMany({
    where: {
      status: "ACTIVE",
      entryLevel: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      level: true,
      entryLevel: true,
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

async function getCategories() {
  return prisma.category.findMany({
    where: {
      courses: {
        some: {
          status: "ACTIVE",
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      courses: {
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          level: true,
        },
        orderBy: {
          name: "asc",
        },
        take: 4,
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

function getLevelLabel(level: string) {
  switch (level) {
    case "UG":
      return "Undergraduate";

    case "PG":
      return "Postgraduate";

    case "DIPLOMA":
      return "Diploma";

    case "PHD":
      return "PhD";

    case "CERTIFICATE":
      return "Certificate";

    default:
      return level;
  }
}

function normalizeLevel(level?: string): ValidLevel | null {
  if (!level) {
    return null;
  }

  const normalized = level.toUpperCase();

  return VALID_LEVELS.includes(normalized as ValidLevel)
    ? (normalized as ValidLevel)
    : null;
}

export default async function CoursesPage({
  searchParams,
}: CoursesPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const categoryId = params.categoryId?.trim() ?? "";

  const activeLevel = normalizeLevel(params.level);

  const pageParam = Number(params.page ?? "1");

  const page =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;


const [
  { courses, pagination },
  categories,
  levelDirectoryCourses,
] = await Promise.all([
  getCourses({
    search: params.search,
    categoryId: params.categoryId,
    level: params.level,
    page,
    limit: 6,
  }),
  getCategories(),
  getLevelDirectoryCourses(),
]);


  /*
   * ---------------------------------------------------------
   * Build URLs while preserving the current filters.
   * ---------------------------------------------------------
   */

  function createPageUrl(nextPage: number) {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (categoryId) {
      query.set("categoryId", categoryId);
    }

    if (activeLevel) {
      query.set("level", activeLevel);
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/courses?${queryString}`
      : "/courses";
  }

  /*
   * ---------------------------------------------------------
   * Level shortcut URL.
   *
   * IMPORTANT:
   * Existing search/category filters are preserved.
   * Only the level changes.
   * Page is reset to 1.
   * ---------------------------------------------------------
   */

  function createLevelUrl(level: ValidLevel) {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (categoryId) {
      query.set("categoryId", categoryId);
    }

    query.set("level", level);

    // Changing a filter should always start from page 1.
    query.delete("page");

    return `/courses?${query.toString()}`;
  }

  /*
   * ---------------------------------------------------------
   * Clear all filters.
   * ---------------------------------------------------------
   */

  const hasFilters =
    Boolean(search) ||
    Boolean(categoryId) ||
    Boolean(activeLevel);

  /*
   * Find selected category name for the results header.
   */

  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-green-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
            {/* =================================================
                LEFT CONTENT
            ================================================== */}
            <div className="min-w-0 max-w-4xl">
              {/* Label */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm sm:text-sm">
                <BookOpen size={15} />
                Explore Courses
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Find the right course for your future
              </h1>

              {/* Description */}
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Explore undergraduate, postgraduate, diploma, PhD
                and certificate courses. Discover course details,
                eligibility, fees, colleges, careers and more.
              </p>

              {/* =================================================
                  LEVEL SHORTCUTS
              ================================================== */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {VALID_LEVELS.map((level) => {
                  const isActive = activeLevel === level;

                  return (
                    <Link
                      key={level}
                      href={createLevelUrl(level)}
                      aria-current={
                        isActive ? "page" : undefined
                      }
                      className={[
                        "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm",
                        isActive
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
                      ].join(" ")}
                    >
                      {getLevelLabel(level)}
                    </Link>
                  );
                })}
              </div>

              {/* =================================================
                  COURSE FILTERS
              ================================================== */}
              <CourseFilters categories={categories} />
            </div>

            {/* =================================================
                RIGHT EDUCATION VISUAL
                Hidden on mobile/tablet
            ================================================== */}
            <div className="relative hidden h-[250px] lg:block">
              {/* Soft glow */}
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/60 blur-3xl" />

              {/* Decorative rings */}
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/70" />

              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100" />

              {/* Main graduation card */}
              <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-emerald-200 bg-white shadow-xl shadow-emerald-900/10">
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-emerald-50">
                  <GraduationCap
                    size={58}
                    strokeWidth={1.5}
                    className="text-emerald-600"
                  />
                </div>
              </div>

              {/* Book */}
              <div className="absolute left-5 top-10 flex h-12 w-12 rotate-[-10deg] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md">
                <BookOpen
                  size={23}
                  strokeWidth={1.8}
                  className="text-emerald-600"
                />
              </div>

              {/* Library */}
              <div className="absolute bottom-8 right-5 flex h-12 w-12 rotate-[8deg] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md">
                <Library
                  size={22}
                  strokeWidth={1.8}
                  className="text-emerald-600"
                />
              </div>

              {/* Award */}
              <div className="absolute right-2 top-7 flex h-11 w-11 rotate-[8deg] items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-md">
                <Award
                  size={21}
                  strokeWidth={1.8}
                  className="text-emerald-600"
                />
              </div>

              {/* Sparkles */}
              <div className="absolute bottom-10 left-16 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                <Sparkles size={17} />
              </div>

              {/* Small decorative dots */}
              <span className="absolute left-1/2 top-2 h-2 w-2 rounded-full bg-emerald-400" />

              <span className="absolute bottom-3 right-1/3 h-1.5 w-1.5 rounded-full bg-emerald-300" />

              <span className="absolute left-8 top-1/2 h-1.5 w-1.5 rounded-full bg-green-300" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =================================================
            RESULTS HEADER
        ================================================== */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {pagination.total}{" "}
              {pagination.total === 1
                ? "course"
                : "courses"}{" "}
              found
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {hasFilters
                ? "Course Search Results"
                : "Explore Courses"}
            </h2>

            {/* Active filter summary */}
            {hasFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {search && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Search:{" "}
                    <span className="font-semibold text-slate-800">
                      {search}
                    </span>
                  </span>
                )}

                {selectedCategory && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Category:{" "}
                    <span className="font-semibold">
                      {selectedCategory?.name ??
                        "Selected"}
                    </span>
                  </span>
                )}

                {activeLevel && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Level:{" "}
                    <span className="font-semibold">
                      {getLevelLabel(activeLevel)}
                    </span>
                  </span>
                )}

                <Link
                  href="/courses"
                  className="text-xs font-semibold text-red-500 transition-colors hover:text-red-600"
                >
                  Clear all
                </Link>
              </div>
            )}

            {search && (
              <p className="mt-2 text-sm text-slate-500">
                Showing results for{" "}
                <span className="font-semibold text-slate-700">
                  &quot;{search}&quot;
                </span>
              </p>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-700">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.totalPages}
              </span>
            </p>
          )}
        </div>

        {/* =================================================
            COURSE GRID
        ================================================== */}
        {courses.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================== */
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <BookOpen size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No courses found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We could not find any courses matching your
              current search or filters. Try changing your
              search criteria.
            </p>

            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <GraduationCap size={17} />
              View all courses
            </Link>
          </div>
        )}

        {/* =================================================
            PAGINATION
        ================================================== */}
        {pagination.totalPages > 1 && (
          <nav
            aria-label="Courses pagination"
            className="mt-10 flex items-center justify-center gap-3"
          >
            {pagination.hasPreviousPage ? (
              <Link
                href={createPageUrl(
                  pagination.page - 1,
                )}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <ArrowLeft size={16} />
                Previous
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                <ArrowLeft size={16} />
                Previous
              </span>
            )}

            <span
              aria-current="page"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              {pagination.page}
            </span>

            {pagination.hasNextPage ? (
              <Link
                href={createPageUrl(
                  pagination.page + 1,
                )}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                Next
                <ArrowRight size={16} />
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                Next
                <ArrowRight size={16} />
              </span>
            )}
          </nav>
        )}
      </section>
      <CourseLevelDirectory courses={levelDirectoryCourses} />


{/* =====================================================
    CATEGORY DIRECTORY
====================================================== */}
<section className="border-t border-slate-200 bg-slate-50">
  <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-600">
        Browse by category
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Explore courses by category
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
        Explore courses across engineering, medical, science,
        management, commerce, arts, computer applications,
        education and law.
      </p>
    </div>

    <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {categoryDirectory.map((category) => {
        const CategoryIcon =
          categoryIcons[
            category.slug as keyof typeof categoryIcons
          ];

        return (
          <article
            key={category.slug}
            className="group flex min-h-[270px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
          >
            {/* Card content */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                  <CategoryIcon
                    size={29}
                    strokeWidth={1.8}
                  />
                </div>

                <Link
                  href={`/courses/${category.slug}`}
                  className="min-w-0"
                >
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-emerald-700">
                    {category.name}
                  </h3>
                </Link>
              </div>

              <div className="my-5 h-px bg-slate-100" />

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Popular courses
                </p>

                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {category.courses.map((course) => (
                    <li key={course.slug}>
                      <Link
                        href={`/courses/${category.slug}/${course.slug}`}
                        className="relative text-sm font-semibold text-slate-700 transition-colors hover:text-emerald-600"
                      >
                        {course.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <Link
              href={`/courses/${category.slug}`}
              className="mt-auto flex items-center justify-center gap-2 border-t border-slate-100 bg-white px-5 py-4 text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:bg-emerald-50"
            >
              Explore all courses

              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </article>
        );
      })}
    </div>
  </div>
</section>

    </main>
  );
}