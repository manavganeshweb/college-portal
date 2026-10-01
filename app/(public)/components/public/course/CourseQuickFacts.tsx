import {
  Building2,
  Clock3,
  GraduationCap,
  IndianRupee,
} from "lucide-react";

type CourseQuickFactsProps = {
  durationYears: number | null;
  averageFees: number | null;
  level: string;
  degree: string | null;
  collegeCount: number;
};

function formatDuration(years: number | null): string {
  if (years === null || years === undefined) {
    return "Not available";
  }

  return `${years} ${years === 1 ? "Year" : "Years"}`;
}

function formatFees(value: number | null): string {
  if (value === null || value === undefined) {
    return "Not available";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatLevel(level: string): string {
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

type Fact = {
  label: string;
  value: string;
  icon: typeof Clock3;
};

export default function CourseQuickFacts({
  durationYears,
  averageFees,
  level,
  degree,
  collegeCount,
}: CourseQuickFactsProps) {
  const facts: Fact[] = [
    {
      label: "Duration",
      value: formatDuration(durationYears),
      icon: Clock3,
    },
    {
      label: "Course Level",
      value: formatLevel(level),
      icon: GraduationCap,
    },
    {
      label: "Average Fees",
      value: formatFees(averageFees),
      icon: IndianRupee,
    },
    {
      label: "Colleges",
      value: collegeCount.toLocaleString("en-IN"),
      icon: Building2,
    },
  ];

  return (
    <section
      id="course-highlights"
      className="scroll-mt-24"
      aria-labelledby="course-highlights-heading"
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
            Course Highlights
          </p>

          <h2
            id="course-highlights-heading"
            className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl"
          >
            Course Quick Facts
          </h2>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {facts.map((fact) => {
            const Icon = fact.icon;

            return (
              <div
                key={fact.label}
                className="flex items-center gap-4 px-5 py-5 sm:px-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon size={20} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    {fact.label}
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-slate-800">
                    {fact.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {degree && (
          <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-medium text-slate-500">
                Degree:
              </span>

              <span className="font-semibold text-slate-800">
                {degree}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}