import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
} from "lucide-react";

type ExamCardExam = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  conductingBody: string | null;
  examType: string | null;
  description: string | null;
  eligibility: string | null;
  applicationFee: number | null;
  website: string | null;
};

type ExamCardProps = {
  exam: ExamCardExam;
};

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FileText className="h-5 w-5" />
        </div>

        {exam.examType && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {exam.examType}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-5 flex-1">
        <h3 className="text-lg font-bold leading-7 text-slate-900 transition group-hover:text-emerald-700">
          {exam.name}
        </h3>

        {exam.shortName && (
          <p className="mt-1 text-sm font-semibold text-emerald-600">
            {exam.shortName}
          </p>
        )}

        {exam.conductingBody && (
          <p className="mt-3 text-sm text-slate-500">
            Conducted by{" "}
            <span className="font-medium text-slate-700">
              {exam.conductingBody}
            </span>
          </p>
        )}

        {exam.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
            {exam.description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-5 space-y-2">
          {exam.eligibility && (
            <div className="flex items-start gap-2 text-sm text-slate-500">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

              <span className="line-clamp-2">
                {exam.eligibility}
              </span>
            </div>
          )}

          {exam.applicationFee !== null && (
            <div className="text-sm text-slate-500">
              Application fee:{" "}
              <span className="font-semibold text-slate-700">
                ₹{exam.applicationFee.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <Link
          href={`/exams/${exam.slug}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </Link>

        {exam.website && (
          <a
            href={exam.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${exam.name} official website`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}