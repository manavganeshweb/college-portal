import {
  BookOpen,
  Clock3,
  GraduationCap,
  Layers3,
} from "lucide-react";

type CourseOverviewProps = {
  courseName: string;
  description: string | null;
  degree: string | null;
  level: string;
  durationYears: number | null;
  categoryName: string;
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

  if (durationYears === 1) {
    return "1 Year";
  }

  return `${durationYears} Years`;
}

export default function CourseOverview({
  courseName,
  description,
  degree,
  level,
  durationYears,
  categoryName,
}: CourseOverviewProps) {
  if (!description && !degree && !categoryName && !durationYears) {
    return null;
  }

  return (
    <section
      id="overview"
      aria-labelledby="course-overview-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <BookOpen size={17} />
            <span>Course Overview</span>
          </div>

          <h2
            id="course-overview-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            About {courseName}
          </h2>
        </div>

        {description && (
          <div className="mb-7">
            <p className="whitespace-pre-line text-[15px] leading-7 text-slate-600">
              {description}
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <GraduationCap size={20} />
            </div>

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Course Level
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatLevel(level)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Layers3 size={20} />
            </div>

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Category
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {categoryName}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Clock3 size={20} />
            </div>

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Duration
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatDuration(durationYears)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen size={20} />
            </div>

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Degree
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {degree || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}