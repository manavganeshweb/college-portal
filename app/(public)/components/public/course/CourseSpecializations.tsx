import {
  ArrowUpRight,
  Layers3,
  Sparkles,
} from "lucide-react";

type CourseSpecialization = {
  name: string;
  description?: string | null;
  slug?: string | null;
};

type CourseSpecializationsProps = {
  courseName: string;
  specializations?: CourseSpecialization[] | null;
};

export default function CourseSpecializations({
  courseName,
  specializations,
}: CourseSpecializationsProps) {
  const validSpecializations = specializations?.filter(
    (specialization): specialization is CourseSpecialization =>
      Boolean(specialization?.name?.trim())
  );

  if (
    !validSpecializations ||
    validSpecializations.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="specializations"
      aria-labelledby="course-specializations-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <Layers3 size={17} />
            <span>Specializations</span>
          </div>

          <h2
            id="course-specializations-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {courseName} Specializations
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Specialization options available for this course.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {validSpecializations.map(
            (specialization, index) => (
              <article
                key={
                  specialization.slug ||
                  `${specialization.name}-${index}`
                }
                className="group rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Sparkles size={19} />
                  </div>

                  {specialization.slug && (
                    <span className="text-slate-300 transition-colors group-hover:text-emerald-500">
                      <ArrowUpRight size={17} />
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {specialization.name}
                </h3>

                {specialization.description?.trim() && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {specialization.description}
                  </p>
                )}
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}