import {
  Award,
  BookOpenCheck,
  ExternalLink,
  FileText,
} from "lucide-react";

type CourseEntranceExam = {
  name: string;
  description?: string | null;
  officialUrl?: string | null;
};

type CourseEntranceExamsProps = {
  courseName: string;
  exams?: CourseEntranceExam[] | null;
};

export default function CourseEntranceExams({
  courseName,
  exams,
}: CourseEntranceExamsProps) {
  const validExams = exams?.filter(
    (exam): exam is CourseEntranceExam =>
      Boolean(exam?.name?.trim())
  );

  if (!validExams || validExams.length === 0) {
    return null;
  }

  return (
    <section
      id="entrance-exams"
      aria-labelledby="entrance-exams-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <Award size={17} />
            <span>Entrance Exams</span>
          </div>

          <h2
            id="entrance-exams-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {courseName} Entrance Exams
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Entrance examinations associated with this course.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {validExams.map((exam) => (
            <article
              key={exam.name}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FileText size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {exam.name}
                  </h3>

                  {exam.description?.trim() && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {exam.description}
                    </p>
                  )}

                  {exam.officialUrl?.trim() && (
                    <a
                      href={exam.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                      Official Website
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <BookOpenCheck
            size={18}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <p className="text-sm leading-6 text-slate-600">
            Entrance-exam information shown here is based only on the
            examinations configured for this course.
          </p>
        </div>
      </div>
    </section>
  );
}