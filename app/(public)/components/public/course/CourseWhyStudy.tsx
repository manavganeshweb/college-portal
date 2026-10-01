import {
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  BriefcaseBusiness,
} from "lucide-react";

type CourseWhyStudyProps = {
  courseName: string;
  reasons?: string[] | null;
};

const fallbackIcons = [
  Lightbulb,
  TrendingUp,
  BriefcaseBusiness,
  CheckCircle2,
];

export default function CourseWhyStudy({
  courseName,
  reasons,
}: CourseWhyStudyProps) {
  const validReasons = reasons?.filter(
    (reason): reason is string =>
      typeof reason === "string" && reason.trim().length > 0
  );

  if (!validReasons || validReasons.length === 0) {
    return null;
  }

  return (
    <section
      id="why-study"
      aria-labelledby="why-study-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <Lightbulb size={17} />
            <span>Why Study</span>
          </div>

          <h2
            id="why-study-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Why Study {courseName}?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Key reasons to consider this course based on the available course
            information.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {validReasons.map((reason, index) => {
            const Icon =
              fallbackIcons[index % fallbackIcons.length];

            return (
              <div
                key={`${reason}-${index}`}
                className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon size={20} />
                </div>

                <p className="pt-1 text-sm leading-6 text-slate-700">
                  {reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}