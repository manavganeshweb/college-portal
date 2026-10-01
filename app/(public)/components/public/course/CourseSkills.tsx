import {
  CheckCircle2,
  Code2,
  Lightbulb,
} from "lucide-react";

type CourseSkillsProps = {
  courseName: string;
  skills?: string[] | null;
};

export default function CourseSkills({
  courseName,
  skills,
}: CourseSkillsProps) {
  const validSkills = skills?.filter(
    (skill): skill is string =>
      typeof skill === "string" && skill.trim().length > 0
  );

  if (!validSkills || validSkills.length === 0) {
    return null;
  }

  return (
    <section
      id="skills"
      aria-labelledby="course-skills-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <Lightbulb size={17} />
            <span>Skills</span>
          </div>

          <h2
            id="course-skills-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Skills You Can Develop in {courseName}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Skills associated with this course based on the available course
            data.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {validSkills.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                {index === 0 ? (
                  <Code2 size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </div>

              <span className="text-sm font-medium text-slate-700">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}