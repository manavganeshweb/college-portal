import { getHomepageStats } from "@/services/home.service";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Layers3,
} from "lucide-react";

const statsConfig = [
  {
    key: "colleges",
    label: "Colleges",
    icon: GraduationCap,
  },
  {
    key: "courses",
    label: "Courses",
    icon: BookOpen,
  },
  {
    key: "exams",
    label: "Entrance Exams",
    icon: Layers3,
  },
  {
    key: "categories",
    label: "Study Categories",
    icon: ArrowUpRight,
  },
] as const;

export default async function TrustStats() {
  const stats = await getHomepageStats();

  const values = {
    colleges: stats.colleges,
    courses: stats.courses,
    exams: stats.exams,
    categories: stats.categories,
  };

  return (
    <section className="relative overflow-hidden bg-[#075c3a] py-14 text-white">
      {/* Decorative shapes */}
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-white/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
            Explore with confidence
          </p>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need to make a better education decision
          </h2>

          <p className="mt-3 text-sm leading-6 text-emerald-100 sm:text-base">
            Discover colleges, courses and entrance exams through structured
            information designed to help you compare and choose.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 divide-x divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm lg:grid-cols-4 lg:divide-y-0">
          {statsConfig.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="group flex items-center gap-4 px-5 py-7 transition-colors duration-300 hover:bg-white/10 sm:px-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="h-6 w-6 text-emerald-100" />
                </div>

                <div>
                  <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {values[item.key]}
                  </p>

                  <p className="mt-1 text-xs font-medium text-emerald-100 sm:text-sm">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust line */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-emerald-100 sm:text-sm">
          <span>✓ Structured education information</span>
          <span>✓ Compare before you decide</span>
          <span>✓ Built for students</span>
        </div>
      </div>
    </section>
  );
}