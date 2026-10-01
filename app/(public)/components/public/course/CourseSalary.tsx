import {
  IndianRupee,
  TrendingUp,
  Wallet,
} from "lucide-react";

type CourseSalaryData = {
  average?: number | null;
  minimum?: number | null;
  maximum?: number | null;
};

type CourseSalaryProps = {
  courseName: string;
  salary?: CourseSalaryData | null;
};

function formatSalary(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

export default function CourseSalary({
  courseName,
  salary,
}: CourseSalaryProps) {
  if (!salary) {
    return null;
  }

  const hasSalaryData =
    salary.average !== null &&
    salary.average !== undefined ||
    salary.minimum !== null &&
    salary.minimum !== undefined ||
    salary.maximum !== null &&
    salary.maximum !== undefined;

  if (!hasSalaryData) {
    return null;
  }

  return (
    <section
      id="salary"
      aria-labelledby="course-salary-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <TrendingUp size={17} />
            <span>Salary</span>
          </div>

          <h2
            id="course-salary-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {courseName} Salary
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Salary information available for this course.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {salary.minimum !== null &&
            salary.minimum !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Wallet size={19} />
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Minimum Salary
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatSalary(salary.minimum)}
                </p>
              </div>
            )}

          {salary.average !== null &&
            salary.average !== undefined && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                  <IndianRupee size={19} />
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Average Salary
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatSalary(salary.average)}
                </p>
              </div>
            )}

          {salary.maximum !== null &&
            salary.maximum !== undefined && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp size={19} />
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Maximum Salary
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatSalary(salary.maximum)}
                </p>
              </div>
            )}
        </div>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Salary figures are shown only when salary information is available
          in the course data source.
        </p>
      </div>
    </section>
  );
}