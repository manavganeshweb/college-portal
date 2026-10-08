import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CutoffEditForm from "./CutoffEditForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CutoffDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const cutoff = await prisma.collegeCutoff.findUnique({
    where: {
      id,
    },
    include: {
      college: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      exam: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!cutoff) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/admin/cutoffs"
              className="hover:text-green-600"
            >
              Cutoffs
            </Link>
            <span>/</span>
            <span>{cutoff.id.slice(0, 8)}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Cutoff Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage examination cutoff information.
          </p>
        </div>

        <Link
          href="/admin/cutoffs"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back to Cutoffs
        </Link>
      </div>

      {/* Linked Information */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Examination
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            {cutoff.exam.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {cutoff.exam.slug}
          </p>

          <Link
            href={`/admin/exams/${cutoff.exam.id}`}
            className="mt-4 inline-block text-sm font-medium text-green-600 hover:text-green-700"
          >
            View Exam →
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            College
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            {cutoff.college.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {cutoff.college.slug}
          </p>

          <Link
            href={`/admin/colleges/${cutoff.college.id}`}
            className="mt-4 inline-block text-sm font-medium text-green-600 hover:text-green-700"
          >
            View College →
          </Link>
        </div>
      </div>

      {/* Edit Form */}
      <CutoffEditForm
        cutoff={{
          id: cutoff.id,
          collegeId: cutoff.collegeId,
          examId: cutoff.examId,
          year: cutoff.year,
          category: cutoff.category,
          gender: cutoff.gender,
          course: cutoff.course,
          openingRank: cutoff.openingRank,
          closingRank: cutoff.closingRank,
        }}
      />
    </div>
  );
}