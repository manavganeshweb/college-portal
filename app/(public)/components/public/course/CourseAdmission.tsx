import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  UserCheck,
} from "lucide-react";

type CourseAdmissionStep = {
  title: string;
  description?: string | null;
};

type CourseAdmissionProps = {
  courseName: string;
  steps?: CourseAdmissionStep[] | null;
};

const stepIcons = [
  UserCheck,
  FileCheck2,
  ClipboardCheck,
  GraduationCap,
];

export default function CourseAdmission({
  courseName,
  steps,
}: CourseAdmissionProps) {
  const validSteps = steps?.filter(
    (step): step is CourseAdmissionStep =>
      Boolean(step?.title?.trim())
  );

  if (!validSteps || validSteps.length === 0) {
    return null;
  }

  return (
    <section
      id="admission"
      aria-labelledby="course-admission-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <GraduationCap size={17} />
            <span>Admission</span>
          </div>

          <h2
            id="course-admission-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {courseName} Admission Process
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Admission steps available for this course.
          </p>
        </div>

        <div className="space-y-0">
          {validSteps.map((step, index) => {
            const Icon = stepIcons[index % stepIcons.length];
            const isLast = index === validSteps.length - 1;

            return (
              <div
                key={`${step.title}-${index}`}
                className="relative flex gap-4"
              >
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-11 h-[calc(100%-18px)] w-px bg-slate-200"
                  />
                )}

                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1 pb-7">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                      Step {index + 1}
                    </span>

                    {!isLast && (
                      <ArrowRight
                        size={13}
                        className="text-slate-300"
                      />
                    )}
                  </div>

                  <h3 className="mt-1 text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  {step.description?.trim() && (
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}