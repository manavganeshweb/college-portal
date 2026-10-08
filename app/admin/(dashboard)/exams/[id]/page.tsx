import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ExamEditForm from "./ExamEditForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminExamDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      description: true,
      conductingBody: true,
      examType: true,
      eligibility: true,
      applicationFee: true,
      website: true,
      createdAt: true,
      updatedAt: true,
      colleges: {
        select: {
          id: true,
          year: true,
          category: true,
          gender: true,
          course: true,
          openingRank: true,
          closingRank: true,
          college: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          year: "desc",
        },
      },
    },
  });

  if (!exam) {
    notFound();
  }

  const serializedExam = {
    ...exam,
    applicationFee:
      exam.applicationFee !== null
        ? Number(exam.applicationFee)
        : null,
    createdAt: exam.createdAt.toISOString(),
    updatedAt: exam.updatedAt.toISOString(),
    colleges: exam.colleges.map((cutoff) => ({
      ...cutoff,
      openingRank: cutoff.openingRank,
      closingRank: cutoff.closingRank,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <a
                href="/admin/exams"
                className="text-sm text-green-600 hover:text-green-700"
              >
                Exams
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-500">
                {exam.name}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              {exam.name}
            </h1>

            {exam.shortName && (
              <p className="mt-1 text-sm text-gray-500">
                {exam.shortName}
              </p>
            )}
          </div>

          {exam.website && (
            <a
              href={exam.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Official Website ↗
            </a>
          )}
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Exam Type</p>
            <p className="mt-1 font-semibold text-gray-900">
              {exam.examType || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Conducting Body</p>
            <p className="mt-1 font-semibold text-gray-900">
              {exam.conductingBody || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Cutoff Records</p>
            <p className="mt-1 font-semibold text-gray-900">
              {exam.colleges.length}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ExamEditForm exam={serializedExam} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Exam Information
              </h2>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Slug</p>
                  <p className="mt-1 break-all font-medium text-gray-900">
                    {exam.slug}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Application Fee</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {exam.applicationFee !== null
                      ? `₹${Number(exam.applicationFee).toLocaleString(
                          "en-IN"
                        )}`
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {exam.createdAt.toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {exam.updatedAt.toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <h2 className="font-semibold text-green-900">
                Public Page
              </h2>

              <p className="mt-2 text-sm text-green-700">
                View how this exam appears on the public portal.
              </p>

              <a
                href={`/exams/${exam.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-green-700 hover:text-green-800"
              >
                Open Public Page →
              </a>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              College Cutoffs
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Colleges and cutoff information associated with this exam.
            </p>
          </div>

          {exam.colleges.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
              <p className="font-medium text-gray-700">
                No cutoff records yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Cutoff management will be added next.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Opening</th>
                    <th className="px-4 py-3">Closing</th>
                  </tr>
                </thead>

                <tbody>
                  {exam.colleges.map((cutoff) => (
                    <tr
                      key={cutoff.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-4 py-4 font-medium text-gray-900">
                        {cutoff.college.name}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {cutoff.year}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {cutoff.category || "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {cutoff.course || "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {cutoff.openingRank ?? "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {cutoff.closingRank ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}