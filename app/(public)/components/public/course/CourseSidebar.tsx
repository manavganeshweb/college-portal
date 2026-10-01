import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  GraduationCap,
  IndianRupee,
} from "lucide-react";

type CourseSidebarProps = {
  courseName: string;
  degree: string | null;
  level: string;
  durationYears: number | null;
  averageFees: number | null;
  collegeCount: number;
  categoryName: string;
  categorySlug: string;
};

function formatLevel(level: string) {
  switch (level) {
    case "UG":
      return "Undergraduate";
    case "PG":
      return "Postgraduate";
    case "DIPLOMA":
      return "Diploma";
    case "PHD":
      return "Doctoral";
    case "CERTIFICATE":
      return "Certificate";
    default:
      return level;
  }
}

function formatDuration(durationYears: number | null) {
  if (durationYears === null) {
    return "Not specified";
  }

  return durationYears === 1
    ? "1 Year"
    : `${durationYears} Years`;
}

function formatFees(averageFees: number | null) {
  if (averageFees === null) {
    return "Not specified";
  }

  return `₹${averageFees.toLocaleString("en-IN")}`;
}

export default function CourseSidebar({
  courseName,
  degree,
  level,
  durationYears,
  averageFees,
  collegeCount,
  categoryName,
  categorySlug,
}: CourseSidebarProps) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-emerald-600 px-5 py-5">
          <div className="flex items-center gap-2 text-emerald-50">
            <BookOpen size={18} />

            <span className="text-sm font-semibold">
              Course Information
            </span>
          </div>

          <h2 className="mt-2 text-lg font-bold text-white">
            {courseName}
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <GraduationCap
                size={17}
                className="text-emerald-600"
              />

              <span className="text-sm text-slate-600">
                Level
              </span>
            </div>

            <span className="text-right text-sm font-semibold text-slate-900">
              {formatLevel(level)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <Clock3
                size={17}
                className="text-emerald-600"
              />

              <span className="text-sm text-slate-600">
                Duration
              </span>
            </div>

            <span className="text-right text-sm font-semibold text-slate-900">
              {formatDuration(durationYears)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <IndianRupee
                size={17}
                className="text-emerald-600"
              />

              <span className="text-sm text-slate-600">
                Average Fees
              </span>
            </div>

            <span className="text-right text-sm font-semibold text-slate-900">
              {formatFees(averageFees)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <Building2
                size={17}
                className="text-emerald-600"
              />

              <span className="text-sm text-slate-600">
                Colleges
              </span>
            </div>

            <span className="text-sm font-semibold text-slate-900">
              {collegeCount}
            </span>
          </div>

          {degree && (
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={17}
                  className="text-emerald-600"
                />

                <span className="text-sm text-slate-600">
                  Degree
                </span>
              </div>

              <span className="text-right text-sm font-semibold text-slate-900">
                {degree}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
          <Building2 size={19} />
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900">
          Explore Colleges
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Explore colleges offering {courseName} and compare the
          available course information.
        </p>

        <Link
          href="#top-colleges"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          View Colleges
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <GraduationCap
            size={18}
            className="text-emerald-600"
          />

          <h3 className="text-base font-bold text-slate-900">
            Related Courses
          </h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Explore other courses from the same academic category.
        </p>

        <Link
          href={`/courses?category=${categorySlug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
        >
          Browse {categoryName}
          <ArrowRight size={15} />
        </Link>
      </div>
    </aside>
  );
}