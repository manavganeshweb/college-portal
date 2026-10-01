import {
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

type CourseEligibilityProps = {
  eligibility: string | null;
};

export default function CourseEligibility({
  eligibility,
}: CourseEligibilityProps) {
  if (!eligibility?.trim()) {
    return null;
  }

  const eligibilityItems = eligibility
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section
      id="eligibility"
      aria-labelledby="course-eligibility-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <GraduationCap size={17} />
            <span>Eligibility</span>
          </div>

          <h2
            id="course-eligibility-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Course Eligibility
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Eligibility requirements available for this course.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
          {eligibilityItems.length === 1 ? (
            <p className="text-[15px] leading-7 text-slate-700">
              {eligibilityItems[0]}
            </p>
          ) : (
            <ul className="space-y-3">
              {eligibilityItems.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-start gap-3 text-[15px] leading-7 text-slate-700"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-1 shrink-0 text-emerald-600"
                  />

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}