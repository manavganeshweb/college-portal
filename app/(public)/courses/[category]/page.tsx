import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  IndianRupee,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

type CourseCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: {
      slug,
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
          degree: true,
          level: true,
          description: true,
          durationYears: true,
          eligibility: true,
          averageFees: true,
          careerOptions: true,
          _count: {
            select: {
              colleges: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });
}

function formatLevel(level: string) {
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

function formatFees(value: unknown) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "Not available";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatCategoryTitle(name: string) {
  return `${name} Courses`;
}

export async function generateMetadata({
  params,
}: CourseCategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  const normalizedCategory = decodeURIComponent(category)
    .trim()
    .toLowerCase();

  const courseCategory = await getCategoryBySlug(normalizedCategory);

  if (!courseCategory) {
    return {
      title: "Course Category Not Found | College Aadhar",
      description: "The requested course category could not be found.",
    };
  }

  const title = `${formatCategoryTitle(courseCategory.name)} - Fees, Eligibility, Colleges & Careers | College Aadhar`;

  const description =
    courseCategory.description ||
    `Explore ${courseCategory.name} courses, eligibility, fees, colleges, admissions, careers and more on College Aadhar.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/courses/${courseCategory.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/courses/${courseCategory.slug}`,
      siteName: "College Aadhar",
      type: "website",
    },
  };
}

export default async function CourseCategoryPage({
  params,
}: CourseCategoryPageProps) {
  const { category } = await params;

  const normalizedCategory = decodeURIComponent(category)
    .trim()
    .toLowerCase();

  const courseCategory = await getCategoryBySlug(normalizedCategory);

  if (!courseCategory) {
    notFound();
  }

  const courses = courseCategory.courses;

  const undergraduateCourses = courses.filter(
    (course) => course.level === "UG",
  );

  const postgraduateCourses = courses.filter(
    (course) => course.level === "PG",
  );

  const diplomaCourses = courses.filter(
    (course) => course.level === "DIPLOMA",
  );

  const phdCourses = courses.filter(
    (course) => course.level === "PHD",
  );

  const totalColleges = courses.reduce(
    (total, course) => total + course._count.colleges,
    0,
  );



  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link
                href="/courses"
                className="transition-colors hover:text-emerald-600"
              >
                Courses
              </Link>

              <span>/</span>

              <span className="font-medium text-slate-700">
                {courseCategory.name}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <GraduationCap size={16} />
              Course Category
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {formatCategoryTitle(courseCategory.name)}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {courseCategory.description ||
                `Explore ${courseCategory.name} courses, including eligibility, fees, duration, colleges, admissions and career opportunities.`}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700">
                <BookOpen
                  size={17}
                  className="text-emerald-600"
                />

                {courses.length}{" "}
                {courses.length === 1 ? "Course" : "Courses"}
              </div>

              {undergraduateCourses.length > 0 && (
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700">
                  <GraduationCap
                    size={17}
                    className="text-emerald-600"
                  />

                  {undergraduateCourses.length} Undergraduate
                </div>
              )}

              {postgraduateCourses.length > 0 && (
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700">
                  <GraduationCap
                    size={17}
                    className="text-emerald-600"
                  />

                  {postgraduateCourses.length} Postgraduate
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK NAVIGATION
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1320px] overflow-x-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex min-w-max items-center gap-1 py-2">
            <a
              href="#courses"
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Courses
            </a>

            {undergraduateCourses.length > 0 && (
              <a
                href="#undergraduate"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
              >
                Undergraduate
              </a>
            )}

            {postgraduateCourses.length > 0 && (
              <a
                href="#postgraduate"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
              >
                Postgraduate
              </a>
            )}

            {diplomaCourses.length > 0 && (
              <a
                href="#diploma"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
              >
                Diploma
              </a>
            )}

            {phdCourses.length > 0 && (
              <a
                href="#phd"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
              >
                PhD
              </a>
            )}

            <a
              href="#faqs"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
            >
              FAQs
            </a>
          </nav>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* =================================================
              MAIN
          ================================================== */}
          <div className="min-w-0">
            {/* INTRODUCTION */}
            <section
              id="courses"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <BookOpen size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {courseCategory.name} Courses
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Explore the available {courseCategory.name.toLowerCase()}{" "}
                    courses on College Aadhar. Compare course duration,
                    eligibility, fees, colleges and career opportunities before
                    choosing a program.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <BookOpen
                    size={19}
                    className="text-emerald-600"
                  />

                  <p className="mt-3 text-xs text-slate-500">
                    Courses
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {courses.length}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <GraduationCap
                    size={19}
                    className="text-emerald-600"
                  />

                  <p className="mt-3 text-xs text-slate-500">
                    Study Levels
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {
                      new Set(
                        courses.map((course) => course.level),
                      ).size
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <Users
                    size={19}
                    className="text-emerald-600"
                  />

                  <p className="mt-3 text-xs text-slate-500">
                    College Listings
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {totalColleges}
                  </p>
                </div>
              </div>
            </section>

            {/* ALL COURSES */}
            <section className="mt-6">
              <div className="mb-5">
                <p className="text-sm font-semibold text-emerald-600">
                  Explore Programs
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Popular {courseCategory.name} Courses
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Explore available programs and open a course to view
                  detailed information.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="hidden grid-cols-[minmax(0,1.5fr)_130px_140px_120px_110px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                  <span>Course</span>
                  <span>Level</span>
                  <span>Duration</span>
                  <span>Colleges</span>
                  <span>Fees</span>
                </div>

                {courses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${courseCategory.slug}/${course.slug}`}
                    className={[
                      "group block border-slate-100 px-5 py-5 transition-colors hover:bg-emerald-50/40",
                      index !== courses.length - 1
                        ? "border-b"
                        : "",
                    ].join(" ")}
                  >
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_130px_140px_120px_110px] md:items-center">
                      <div className="min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <GraduationCap size={19} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-emerald-700">
                              {course.name}
                            </h3>

                            {course.shortName && (
                              <p className="mt-1 text-xs font-medium text-emerald-600">
                                {course.shortName}
                              </p>
                            )}

                            {course.description && (
                              <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
                                {course.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {formatLevel(course.level)}
                        </span>
                      </div>

                      <div className="text-sm text-slate-600">
                        {course.durationYears
                          ? `${course.durationYears} Years`
                          : "Varies"}
                      </div>

                      <div className="text-sm text-slate-600">
                        {course._count.colleges}
                      </div>

                      <div className="text-sm font-semibold text-slate-800">
                        {formatFees(course.averageFees)}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 md:hidden">
                      <span className="text-xs text-slate-500">
                        View course details
                      </span>

                      <ArrowRight
                        size={16}
                        className="text-emerald-600"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* UNDERGRADUATE */}
            {undergraduateCourses.length > 0 && (
              <CourseLevelSection
                id="undergraduate"
                title="Undergraduate Courses"
                description={`Explore undergraduate ${courseCategory.name.toLowerCase()} programs.`}
                courses={undergraduateCourses}
                categorySlug={courseCategory.slug}
              />
            )}

            {/* POSTGRADUATE */}
            {postgraduateCourses.length > 0 && (
              <CourseLevelSection
                id="postgraduate"
                title="Postgraduate Courses"
                description={`Explore postgraduate ${courseCategory.name.toLowerCase()} programs.`}
                courses={postgraduateCourses}
                categorySlug={courseCategory.slug}
              />
            )}

            {/* DIPLOMA */}
            {diplomaCourses.length > 0 && (
              <CourseLevelSection
                id="diploma"
                title="Diploma Courses"
                description={`Explore diploma programs in ${courseCategory.name.toLowerCase()}.`}
                courses={diplomaCourses}
                categorySlug={courseCategory.slug}
              />
            )}

            {/* PHD */}
            {phdCourses.length > 0 && (
              <CourseLevelSection
                id="phd"
                title="PhD Courses"
                description={`Explore PhD programs related to ${courseCategory.name.toLowerCase()}.`}
                courses={phdCourses}
                categorySlug={courseCategory.slug}
              />
            )}

            {/* WHY CHOOSE */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-semibold text-emerald-600">
                Before Choosing a Course
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                What should you compare?
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Eligibility",
                    description:
                      "Check academic qualifications and admission requirements.",
                  },
                  {
                    title: "Course Duration",
                    description:
                      "Compare the duration of different programs before applying.",
                  },
                  {
                    title: "Fees",
                    description:
                      "Review average course fees and compare available colleges.",
                  },
                  {
                    title: "Career Opportunities",
                    description:
                      "Understand potential career paths after completing the course.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={18}
                        className="text-emerald-600"
                      />

                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section
              id="faqs"
              className="mt-6 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <p className="text-sm font-semibold text-emerald-600">
                FAQs
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>

              <div className="mt-6 divide-y divide-slate-200">
                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-semibold text-slate-900">
                    What {courseCategory.name} courses are available?
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    College Aadhar currently lists {courses.length} active{" "}
                    {courseCategory.name.toLowerCase()}{" "}
                    {courses.length === 1 ? "course" : "courses"}.
                  </p>
                </details>

                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-semibold text-slate-900">
                    How can I compare these courses?
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Open an individual course page to review its duration,
                    eligibility, fees, colleges, admission information and
                    career opportunities.
                  </p>
                </details>

                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-semibold text-slate-900">
                    Where can I find colleges offering these courses?
                  </summary>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Each course page contains the colleges currently connected
                    to that course in the College Aadhar database.
                  </p>
                </details>
              </div>
            </section>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================== */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="font-bold text-slate-900">
                  {courseCategory.name} Courses
                </h2>

                <div className="mt-4 space-y-3">
                  <SidebarStat
                    icon={<BookOpen size={17} />}
                    label="Total Courses"
                    value={String(courses.length)}
                  />

                  <SidebarStat
                    icon={<GraduationCap size={17} />}
                    label="Undergraduate"
                    value={String(undergraduateCourses.length)}
                  />

                  <SidebarStat
                    icon={<GraduationCap size={17} />}
                    label="Postgraduate"
                    value={String(postgraduateCourses.length)}
                  />

                  <SidebarStat
                    icon={<Users size={17} />}
                    label="College Listings"
                    value={String(totalColleges)}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="font-bold text-slate-900">
                  Explore Courses
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Browse all course categories available on College Aadhar.
                </p>

                <Link
                  href="/courses"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
                >
                  View all courses
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

type CourseListItem = Awaited<
  ReturnType<typeof getCategoryBySlug>
> extends infer T
  ? T extends { courses: infer C }
    ? C extends readonly (infer I)[]
      ? I
      : never
    : never
  : never;

function CourseLevelSection({
  id,
  title,
  description,
  courses,
  categorySlug,
}: {
  id: string;
  title: string;
  description: string;
  courses: CourseListItem[];
  categorySlug: string;
}) {
  return (
    <section
      id={id}
      className="mt-6 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
    >
      <div>
        <p className="text-sm font-semibold text-emerald-600">
          Course Level
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        {courses.map((course, index) => (
          <Link
            key={course.id}
            href={`/courses/${categorySlug}/${course.slug}`}
            className={[
              "flex items-center justify-between gap-4 p-4 transition-colors hover:bg-emerald-50/50",
              index !== courses.length - 1
                ? "border-b border-slate-200"
                : "",
            ].join(" ")}
          >
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 hover:text-emerald-700">
                {course.name}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                {course.degree && (
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {course.degree}
                  </span>
                )}

                {course.durationYears && (
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {course.durationYears
  ? `${course.durationYears} Years`
  : "Varies"} Years
                  </span>
                )}

                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                  {course._count.colleges}{" "}
                  {course._count.colleges === 1
                    ? "College"
                    : "Colleges"}
                </span>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-emerald-600"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

function SidebarStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-2.5">
        <span className="text-emerald-600">{icon}</span>

        <span className="text-sm text-slate-600">
          {label}
        </span>
      </div>

      <span className="text-sm font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}