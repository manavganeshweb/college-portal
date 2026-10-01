import {
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type CollegeAboutProps = {
  college: {
    name: string;
    description: string | null;
    establishedYear: number | null;
    collegeType: string;
    verified: boolean;
    city: {
      name: string;
    };
    state: {
      name: string;
    };
  };
};

function formatCollegeType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function CollegeAbout({
  college,
}: CollegeAboutProps) {
  const location = `${college.city.name}, ${college.state.name}`;

  const highlights = [
    college.verified
      ? {
          icon: ShieldCheck,
          label: "Verification",
          value: "Verified College",
        }
      : null,
    college.establishedYear
      ? {
          icon: CalendarDays,
          label: "Established",
          value: String(college.establishedYear),
        }
      : null,
    {
      icon: GraduationCap,
      label: "College Type",
      value: formatCollegeType(college.collegeType),
    },
    {
      icon: MapPin,
      label: "Location",
      value: location,
    },
  ].filter(Boolean) as {
    icon: typeof ShieldCheck;
    label: string;
    value: string;
  }[];

  return (
    <section
      id="overview"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
    >
      {/* Heading */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              College Overview
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              About {college.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-5">
        {college.description ? (
          <div className="space-y-3 text-sm leading-7 text-slate-600">
            {college.description
              .split(/\n+/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 20)}`}>
                  {paragraph}
                </p>
              ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              About information is not available yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Detailed information about this college has not been
              published on College Aadhar yet.
            </p>
          </div>
        )}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="mt-7 border-t border-slate-100 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              College Highlights
            </h3>

            {college.verified && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified information
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}