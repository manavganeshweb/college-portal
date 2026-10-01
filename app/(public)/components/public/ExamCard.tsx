import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
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
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FileText size={21} />
        </div>

        {exam.examType && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {exam.examType}
          </span>
        )}
      </div>

      {/* Exam information */}
      <div className="mt-5">
        <h3 className="text-xl font-bold text-slate-900">
          {exam.name}
        </h3>

        {exam.shortName && (
          <p className="mt-1 text-sm font-medium text-emerald-600">
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
      </div>

      {/* Description */}
      {exam.description && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {exam.description}
        </p>
      )}

      {/* Details */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {exam.applicationFee !== null && (
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">
              Application Fee
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              ₹{exam.applicationFee.toLocaleString("en-IN")}
            </p>
          </div>
        )}

        {exam.eligibility && (
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">
              Eligibility
            </p>

            <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
              {exam.eligibility}
            </p>
          </div>
        )}
      </div>

      {/* Cutoff information */}
      <div className="mt-5 flex items-center gap-1.5 text-sm text-slate-500">
        <CheckCircle2 size={15} className="text-emerald-600" />
        Cutoff information available
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center gap-3 pt-6">
        <Link
          href={`/exams/${exam.slug}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View Details
          <ArrowRight size={16} />
        </Link>

        {exam.website && (
          <a
            href={exam.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
            aria-label={`Visit ${exam.name} official website`}
          >
            <ExternalLink size={17} />
          </a>
        )}
      </div>
    </article>
  );
}