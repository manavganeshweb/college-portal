import {
  BookOpen,
  ChevronDown,
  FileText,
} from "lucide-react";

type CourseSyllabusItem = {
  title: string;
  topics?: string[] | null;
};

type CourseSyllabusProps = {
  courseName: string;
  semesters?: CourseSyllabusItem[] | null;
};

export default function CourseSyllabus({
  courseName,
  semesters,
}: CourseSyllabusProps) {
  const validSemesters = semesters?.filter(
    (semester): semester is CourseSyllabusItem =>
      Boolean(semester?.title?.trim())
  );

  if (!validSemesters || validSemesters.length === 0) {
    return null;
  }

  return (
    <section
      id="syllabus"
      aria-labelledby="course-syllabus-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <BookOpen size={17} />
            <span>Syllabus</span>
          </div>

          <h2
            id="course-syllabus-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {courseName} Syllabus
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Semester-wise syllabus information available for this course.
          </p>
        </div>

        <div className="space-y-3">
          {validSemesters.map((semester, index) => {
            const topics = semester.topics?.filter(
              (topic): topic is string =>
                typeof topic === "string" && topic.trim().length > 0
            );

            return (
              <details
                key={`${semester.title}-${index}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <FileText size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Semester {index + 1}
                      </p>

                      <h3 className="mt-0.5 text-sm font-semibold text-slate-900 sm:text-base">
                        {semester.title}
                      </h3>
                    </div>
                  </div>

                  <ChevronDown
                    size={18}
                    className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>

                {topics && topics.length > 0 && (
                  <div className="border-t border-slate-200 bg-white px-5 py-4">
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {topics.map((topic, topicIndex) => (
                        <li
                          key={`${topic}-${topicIndex}`}
                          className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}