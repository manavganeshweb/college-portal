import {
  Building2,
  IndianRupee,
  Info,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

type CourseFeeCollege = {
  id: string;
  fees: number | null;
  college: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    logo: string | null;
    collegeType: string;
    verified: boolean;
    state: {
      name: string;
    };
    city: {
      name: string;
    };
  };
};

type CourseFeesProps = {
  courseName: string;
  averageFees: number | null;
  colleges: CourseFeeCollege[];
};

function formatFee(value: number | null) {
  if (value === null) {
    return "Not specified";
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

export default function CourseFees({
  courseName,
  averageFees,
  colleges,
}: CourseFeesProps) {
  const collegesWithFees = colleges.filter(
    (item): item is CourseFeeCollege & { fees: number } =>
      item.fees !== null
  );

  if (averageFees === null && collegesWithFees.length === 0) {
    return null;
  }

  return (
    <section
      id="fees"
      aria-labelledby="course-fees-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <WalletCards size={17} />
            <span>Fees</span>
          </div>

          <h2
            id="course-fees-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {courseName} Fees
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Course fee information available in the College Aadhar database.
          </p>
        </div>

        {averageFees !== null && (
          <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <IndianRupee size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Average Course Fee
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatFee(averageFees)}
                </p>
              </div>
            </div>
          </div>
        )}

        {collegesWithFees.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-emerald-600" />

              <h3 className="text-lg font-semibold text-slate-900">
                College-wise Fees
              </h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="hidden grid-cols-[minmax(0,1fr)_140px_130px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
                <span>College</span>
                <span>Type</span>
                <span>Course Fee</span>
              </div>

              <div className="divide-y divide-slate-200">
                {collegesWithFees.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_140px_130px] sm:items-center"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/colleges/${item.college.slug}`}
                        className="font-semibold text-slate-900 transition-colors hover:text-emerald-600"
                      >
                        {item.college.name}
                      </Link>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.college.city.name},{" "}
                        {item.college.state.name}
                      </p>
                    </div>

                    <div>
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {formatCollegeType(item.college.collegeType)}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-900">
                      {formatFee(item.fees)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <Info
            size={17}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <p className="text-xs leading-5 text-slate-500">
            Fees shown are based on the course and college fee information
            currently available in College Aadhar. Actual fees may vary by
            institution, category, year, or other applicable conditions.
          </p>
        </div>
      </div>
    </section>
  );
}