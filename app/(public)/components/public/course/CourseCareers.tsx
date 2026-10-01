import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

type CourseCareersProps = {
  courseName: string;
  careerOptions: string | null;
};

export default function CourseCareers({
  courseName,
  careerOptions,
}: CourseCareersProps) {
  if (!careerOptions?.trim()) {
    return null;
  }

  const options = careerOptions
    .split(/\r?\n/)
    .map((option) => option.trim())
    .filter(Boolean);

  return (
    <section
      id="careers"
      aria-labelledby="course-careers-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <BriefcaseBusiness size={17} />
            <span>Career Opportunities</span>
          </div>

          <h2
            id="course-careers-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {courseName} Career Options
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Career information available for this course.
          </p>
        </div>

        {options.length === 1 ? (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <TrendingUp size={21} />
              </div>

              <p className="text-[15px] leading-7 text-slate-700">
                {options[0]}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {options.map((option, index) => (
              <div
                key={`${option}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
              >
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div className="min-w-0">
                  <p className="text-sm leading-6 text-slate-700">
                    {option}
                  </p>
                </div>

                <ArrowRight
                  size={15}
                  className="mt-1 ml-auto shrink-0 text-slate-300"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <BriefcaseBusiness
              size={17}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-xs leading-5 text-slate-500">
              Career options shown here are based on the information
              currently stored for this course in College Aadhar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}