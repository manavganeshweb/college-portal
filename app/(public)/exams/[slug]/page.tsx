import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Trophy,
} from "lucide-react";

import { getExamBySlug } from "@/services/exam.service";

export const revalidate = 3600;

type ExamDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ExamDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const exam = await getExamBySlug(slug);

  if (!exam) {
    return {
      title: "Exam Not Found | College Aadhar",
      description: "The requested entrance exam could not be found.",
    };
  }

  const title = `${exam.name} - Eligibility, Cutoffs & Details | College Aadhar`;

  const description =
    exam.description ??
    `Explore ${exam.name}, including eligibility, conducting body, colleges and cutoff information.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/exams/${exam.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/exams/${exam.slug}`,
      siteName: "College Aadhar",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function formatRank(value: number | null) {
  if (value === null) {
    return "—";
  }

  return value.toLocaleString("en-IN");
}

function formatGender(value: string | null) {
  if (!value) {
    return "All";
  }

  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default async function ExamDetailPage({
  params,
}: ExamDetailPageProps) {
  const { slug } = await params;

  const exam = await getExamBySlug(slug);

  if (!exam) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link
              href="/exams"
              className="transition hover:text-emerald-600"
            >
              Exams
            </Link>

            <span>/</span>

            <span className="text-slate-700">{exam.name}</span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Main Hero Content */}
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                <GraduationCap size={32} />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  Entrance Exam
                </span>

                {exam.examType && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                    {exam.examType}
                  </span>
                )}

                {exam.shortName && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                    {exam.shortName}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {exam.name}
              </h1>

              {exam.conductingBody && (
                <p className="mt-3 text-lg font-medium text-emerald-700">
                  Conducted by {exam.conductingBody}
                </p>
              )}

              {exam.description && (
                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                  {exam.description}
                </p>
              )}

              {exam.website && (
                <a
                  href={exam.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Official Website
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            {/* Quick Facts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Exam Information
              </h2>

              <div className="mt-5 space-y-5">
                {/* Conducting Body */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <GraduationCap size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Conducting Body
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {exam.conductingBody ?? "Not available"}
                    </p>
                  </div>
                </div>

                {/* Exam Type */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <Trophy size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Exam Type
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {exam.examType ?? "Not available"}
                    </p>
                  </div>
                </div>

                {/* Application Fee */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Application Fee
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {exam.applicationFee !== null
                        ? `₹${exam.applicationFee.toLocaleString("en-IN")}`
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {/* Eligibility */}
            {exam.eligibility && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={21} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Eligibility
                  </h2>
                </div>

                <p className="mt-5 leading-7 text-slate-600">
                  {exam.eligibility}
                </p>
              </section>
            )}

            {/* Cutoffs */}
            <section>
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Trophy size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-emerald-600">
                      ADMISSION DATA
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900">
                      College Cutoffs
                    </h2>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Explore available cutoff records associated
                  with this entrance exam.
                </p>
              </div>

              {exam.cutoffs.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-5 py-4 font-semibold">
                            College
                          </th>

                          <th className="px-5 py-4 font-semibold">
                            Year
                          </th>

                          <th className="px-5 py-4 font-semibold">
                            Course
                          </th>

                          <th className="px-5 py-4 font-semibold">
                            Category
                          </th>

                          <th className="px-5 py-4 font-semibold">
                            Gender
                          </th>

                          <th className="px-5 py-4 font-semibold">
                            Opening Rank
                          </th>

                          <th className="px-5 py-4 font-semibold">
                            Closing Rank
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {exam.cutoffs.map((cutoff) => (
                          <tr
                            key={cutoff.id}
                            className="transition hover:bg-emerald-50/40"
                          >
                            <td className="px-5 py-4">
                              <Link
                                href={`/colleges/${cutoff.college.slug}`}
                                className="font-semibold text-slate-900 hover:text-emerald-700"
                              >
                                {cutoff.college.name}
                              </Link>

                              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                <MapPin size={12} />

                                {cutoff.college.city.name},{" "}
                                {cutoff.college.state.name}
                              </div>

                              {cutoff.college.verified && (
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                  <CheckCircle2 size={11} />
                                  Verified
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4 font-medium text-slate-700">
                              {cutoff.year}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {cutoff.course ?? "All"}
                            </td>

                            <td className="px-5 py-4 font-medium text-slate-700">
                              {cutoff.category}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {formatGender(cutoff.gender)}
                            </td>

                            <td className="px-5 py-4 font-medium text-slate-700">
                              {formatRank(cutoff.openingRank)}
                            </td>

                            <td className="px-5 py-4 font-semibold text-emerald-700">
                              {formatRank(cutoff.closingRank)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                    <p className="text-xs leading-5 text-slate-500">
                      Cutoff information is provided for reference.
                      Admission requirements and closing ranks may
                      change by year, category, counselling round and
                      institution. Always verify current information
                      with the official examination or college
                      authority.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <Trophy
                    size={36}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No cutoff records available
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Cutoff information for this exam has not been
                    added yet.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-emerald-600 p-6 text-white shadow-lg shadow-emerald-100">
              <p className="text-sm font-medium text-emerald-100">
                Plan your admission
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Find colleges through{" "}
                {exam.shortName ?? exam.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-emerald-50">
                Explore colleges, compare your options and review
                available admission information.
              </p>

              <Link
                href="/colleges"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                Explore Colleges
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Exam Information
              </h3>

              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Conducting Body
                  </dt>

                  <dd className="text-right font-medium text-slate-800">
                    {exam.conductingBody ?? "Not available"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Exam Type
                  </dt>

                  <dd className="text-right font-medium text-slate-800">
                    {exam.examType ?? "Not available"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Application Fee
                  </dt>

                  <dd className="text-right font-medium text-slate-800">
                    {exam.applicationFee !== null
                      ? `₹${exam.applicationFee.toLocaleString("en-IN")}`
                      : "Not available"}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Cutoff Records
                  </dt>

                  <dd className="font-medium text-slate-800">
                    {exam.cutoffs.length}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}