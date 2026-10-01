import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type CollegeQuickInfoProps = {
  college: {
    name: string;
    collegeType: string;
    establishedYear: number | null;
    website: string | null;
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

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3.5 last:border-b-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function CollegeQuickInfo({
  college,
}: CollegeQuickInfoProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-4.5 w-4.5" />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">
            Quick Information
          </h2>

          {college.verified && (
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3 w-3" />
              Verified college
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        {college.establishedYear && (
          <InfoRow
            icon={CalendarDays}
            label="Established"
            value={String(college.establishedYear)}
          />
        )}

        <InfoRow
          icon={GraduationCap}
          label="Type"
          value={formatCollegeType(college.collegeType)}
        />

        <InfoRow
          icon={MapPin}
          label="Location"
          value={`${college.city.name}, ${college.state.name}`}
        />

        {college.website && (
          <div className="flex items-start gap-3 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ExternalLink className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">
                Official Website
              </p>

              <Link
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Visit Website
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}