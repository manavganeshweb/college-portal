
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  BriefcaseBusiness,
  Award,
  Microscope,
  School,
} from "lucide-react";
import { CourseLevel } from "@/src/generated/prisma/enums";
type CourseItem = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  level: CourseLevel;
  category: {
    name: string;
    slug: string;
  };
};

type CourseLevelDirectoryProps = {
  courses: CourseItem[];
};

type LevelCard = {
  key: CourseLevel | "AFTER_10TH" | "AFTER_12TH" | "AFTER_DIPLOMA";
  title: string;
  description: string;
  image: string;
  href: string;
  icon: typeof GraduationCap;
};

const levelCards: LevelCard[] = [
  {
    key: "AFTER_10TH",
    title: "After 10th Courses",
    description:
      "Explore diploma, certificate and skill-based courses after Class 10.",
    image: "/images/courses/after-10th.jpg",
    href: "/courses/levels/after-10th",
    icon: School,
  },
  {
    key: "AFTER_12TH",
    title: "After 12th Courses",
    description:
      "Explore undergraduate and professional courses after Class 12.",
    image: "/images/courses/after-12th.jpg",
    href: "/courses/levels/after-12th",
    icon: GraduationCap,
  },
  {
    key: "AFTER_DIPLOMA",
    title: "After Diploma Courses",
    description:
      "Explore degree and advanced study options after completing a diploma.",
    image: "/images/courses/after-diploma.jpg",
    href: "/courses/levels/after-diploma",
    icon: BriefcaseBusiness,
  },
  {
    key: "UG",
    title: "Undergraduate Courses",
    description:
      "Explore bachelor's degree and undergraduate programs across fields.",
    image: "/images/courses/undergraduate.jpg",
    href: "/courses/levels/undergraduate",
    icon: BookOpen,
  },
  {
    key: "PG",
    title: "Postgraduate Courses",
    description:
      "Explore master's degree and postgraduate programs for career growth.",
    image: "/images/courses/postgraduate.jpg",
    href: "/courses/levels/postgraduate",
    icon: Award,
  },
  {
    key: "PHD",
    title: "Ph.D & Research Courses",
    description:
      "Explore doctoral and research-oriented academic programs.",
    image: "/images/courses/phd.jpg",
    href: "/courses/levels/phd",
    icon: Microscope,
  },
];

function getCoursesForLevel(
  courses: CourseItem[],
  level: LevelCard["key"],
): CourseItem[] {
  if (level === "AFTER_10TH") {
    return courses
      .filter(
        (course) =>
          course.level === "DIPLOMA" ||
          course.level === "CERTIFICATE",
      )
      .slice(0, 6);
  }

  if (level === "AFTER_12TH") {
    return courses
      .filter((course) => course.level === "UG")
      .slice(0, 6);
  }

  if (level === "AFTER_DIPLOMA") {
    return courses
      .filter((course) => course.level === "UG")
      .slice(0, 6);
  }

  return courses
    .filter((course) => course.level === level)
    .slice(0, 6);
}

function getCourseCount(
  courses: CourseItem[],
  categorySlug: string,
  level: LevelCard["key"],
): number {
  if (level === "AFTER_10TH") {
    return courses.filter(
      (course) =>
        course.category.slug === categorySlug &&
        (course.level === "DIPLOMA" ||
          course.level === "CERTIFICATE"),
    ).length;
  }

  if (
    level === "AFTER_12TH" ||
    level === "AFTER_DIPLOMA"
  ) {
    return courses.filter(
      (course) =>
        course.category.slug === categorySlug &&
        course.level === "UG",
    ).length;
  }

  return courses.filter(
    (course) =>
      course.category.slug === categorySlug &&
      course.level === level,
  ).length;
}

export default function CourseLevelDirectory({
  courses,
}: CourseLevelDirectoryProps) {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
            <GraduationCap size={14} />
            Find your path
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Don&apos;t know what to choose?
            <span className="block text-emerald-600">
              Choose by your education level
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            Explore courses based on your current qualification and
            find the right academic path for your next step.
          </p>
        </div>

        {/* Level cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {levelCards.map((level) => {
            const LevelIcon = level.icon;
            const levelCourses = getCoursesForLevel(
              courses,
              level.key,
            );

            /*
             * Build category groups from the actual courses.
             * This gives us tags similar to the reference design:
             * Engineering, Management, Computer Applications, etc.
             */
            const categoryMap = new Map<
              string,
              {
                name: string;
                slug: string;
                count: number;
              }
            >();

            levelCourses.forEach((course) => {
              const existing = categoryMap.get(
                course.category.slug,
              );

              if (existing) {
                existing.count += 1;
              } else {
                categoryMap.set(course.category.slug, {
                  name: course.category.name,
                  slug: course.category.slug,
                  count: 1,
                });
              }
            });

            const categoryTags = Array.from(
              categoryMap.values(),
            ).slice(0, 6);

            return (
              <article
                key={level.key}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                {/* Image area */}
                <div className="relative h-[225px] overflow-hidden">
                  <Image
                    src={level.image}
                    alt={level.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-slate-900/10" />

                  {/* Icon */}
                  <div className="absolute left-5 top-5 flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white backdrop-blur-md">
                    <LevelIcon size={21} strokeWidth={1.8} />
                  </div>

                  {/* Content */}
                  <Link
                    href={level.href}
                    className="absolute inset-x-0 bottom-0 p-5"
                  >
                    <h3 className="text-2xl font-extrabold tracking-tight text-white">
                      {level.title}
                    </h3>

                    <p className="mt-2 max-w-md text-sm font-medium leading-5 text-white/85">
                      {level.description}
                    </p>
                  </Link>
                </div>

                {/* Tags */}
                <div className="min-h-[145px] px-5 pb-4 pt-4">
                  {categoryTags.length > 0 ? (
                    <>
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                        Explore by category
                      </p>

                      <ul className="flex flex-wrap gap-2">
                        {categoryTags.map((category) => {
                          const count = getCourseCount(
                            courses,
                            category.slug,
                            level.key,
                          );

                          return (
                            <li key={category.slug}>
                              <Link
                                href={`/courses/${category.slug}`}
                                className="group/tag inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-700"
                              >
                                <span className="flex min-w-7 items-center justify-center self-stretch bg-emerald-600 px-1.5 text-xs font-bold text-white">
                                  {count}
                                </span>

                                <span className="px-2.5 py-1.5">
                                  {category.name}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <div className="flex min-h-[100px] items-center justify-center text-center">
                      <p className="text-sm text-slate-500">
                        Courses will be available here soon.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <Link
                  href={level.href}
                  className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3.5 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  Explore {level.title}
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
  );
}
