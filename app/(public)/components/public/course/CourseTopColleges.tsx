import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  Users,
} from "lucide-react";

type CourseCollege = {
  id: string;
  fees: number | null;
  seats: number | null;
  college: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    logo: string | null;
    coverImage: string | null;
    collegeType: string;
    verified: boolean;
    establishedYear: number | null;
    state: {
      name: string;
    };
    city: {
      name: string;
    };
  };
};

type CourseTopCollegesProps = {
  courseName: string;
  colleges: CourseCollege[];
};

function formatFee(value: number | null) {
  if (value === null) {
    return "Fee not available";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatCollegeType(type: string) {
  switch (type) {
    case "GOVERNMENT":
      return "Government";
    case "PRIVATE":
      return "Private";
    case "PUBLIC":
      return "Public";
    case "DEEMED":
      return "Deemed";
    case "AUTONOMOUS":
      return "Autonomous";
    default:
      return type;
  }
}

export default function CourseTopColleges({
  courseName,
  colleges,
}: CourseTopCollegesProps) {
  if (colleges.length === 0) {
    return null;
  }

  return (
    <section
      id="top-colleges"
      aria-labelledby="top-colleges-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <Building2 size={17} />
              <span>Colleges</span>
            </div>

            <h2
              id="top-colleges-heading"
              className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Top Colleges for {courseName}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Colleges offering this course in the College Aadhar database.
            </p>
          </div>

          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            {colleges.length}{" "}
            {colleges.length === 1 ? "College" : "Colleges"}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {colleges.map((item) => {
            const college = item.college;

            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex gap-4 p-5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {college.logo ? (
                      <Image
                        src={college.logo}
                        alt={`${college.name} logo`}
                        fill
                        sizes="64px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-emerald-600">
                        <Building2 size={25} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-2">
                      <Link
                        href={`/colleges/${college.slug}`}
                        className="text-base font-bold leading-6 text-slate-900 transition-colors hover:text-emerald-600"
                      >
                        {college.name}
                      </Link>

                      {college.verified && (
                        <span
                          title="Verified college"
                          className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600"
                        >
                          <CheckCircle2 size={14} />
                          Verified
                        </span>
                      )}
                    </div>

                    {college.shortName && (
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {college.shortName}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} />
                        {college.city.name}, {college.state.name}
                      </span>

                      <span>
                        {formatCollegeType(college.collegeType)}
                      </span>

                      {college.establishedYear && (
                        <span>
                          Est. {college.establishedYear}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/60">
                  <div className="border-r border-slate-100 px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Course Fee
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatFee(item.fees)}
                    </p>
                  </div>

                  <div className="px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Seats
                    </p>

                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      <Users size={14} className="text-emerald-600" />
                      {item.seats !== null
                        ? item.seats.toLocaleString("en-IN")
                        : "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                  >
                    View College
                  </Link>

                  <Link
                    href={`/colleges/${college.slug}//courses-fees`}
                    aria-label={`View ${college.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}