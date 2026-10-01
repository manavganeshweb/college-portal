import Link from "next/link";
import { getAdminApplications } from "@/services/admin-application.service";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusClasses(status: string) {
  switch (status) {
    case "APPLIED":
      return "bg-blue-50 text-blue-700";

    case "SHORTLISTED":
      return "bg-purple-50 text-purple-700";

    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700";

    case "REJECTED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default async function AdminApplicationsPage() {
  const applications = await getAdminApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Applications
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage student college applications.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Student Applications
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {applications.length} application
                {applications.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <span className="text-xl">📋</span>
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No applications yet
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Student applications will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
  Phone
</th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    College
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Course
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Applied
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.user.name}
                        </p>

                        <p className="mt-0.5 text-sm text-gray-500">
                          {application.user.email}
                        </p>
                      </div>
                    </td>
                   <td className="px-6 py-4 text-sm text-gray-700">
  {application.user.phone || "Not provided"}
</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/colleges/${application.college.slug}`}
                        target="_blank"
                        className="font-medium text-gray-900 hover:text-[#15945c]"
                      >
                        {application.college.shortName ||
                          application.college.name}
                      </Link>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {application.college.city.name},{" "}
                        {application.college.city.state.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {application.courseName || "Not specified"}
                    </td>
                    

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(
                        application.appliedAt ||
                          application.createdAt
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}