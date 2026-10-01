import {
  Building2,
  BriefcaseBusiness,
  ExternalLink,
  IndianRupee,
  Users,
} from "lucide-react";

import type { CollegeDetail } from "@/services/college.service";

type CollegePlacementsProps = {
  college: CollegeDetail;
};

type PlacementRecord = CollegeDetail["placements"][number];

export default function CollegePlacements({
  college,
}: CollegePlacementsProps) {
  const placements = [...college.placements].sort(
    (a, b) => b.year - a.year
  );

  const latestPlacement = placements[0];

  const recruiters = getUniqueRecruiters(placements);

  return (
    <article
      id="placements"
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10">
            <BriefcaseBusiness className="h-5 w-5 text-[#15945c]" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {college.name} Placements 2026
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore placement information, placement statistics and
              recruiting companies available in the placement records of{" "}
              {college.name}.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        {placements.length === 0 ? (
          <EmptyPlacements />
        ) : (
          <>
            {/* Latest Placement Overview */}
            {latestPlacement && (
              <section>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Placement Overview
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Latest available placement record
                    </p>
                  </div>

                  <span className="rounded-full bg-[#15945c]/10 px-3 py-1 text-xs font-semibold text-[#15945c]">
                    {latestPlacement.year}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <PlacementStat
                    icon={<IndianRupee className="h-4 w-4" />}
                    label="Average Package"
                    value={formatPackage(
                      latestPlacement.averagePackage
                    )}
                  />

                  <PlacementStat
                    icon={<IndianRupee className="h-4 w-4" />}
                    label="Median Package"
                    value={formatPackage(
                      latestPlacement.medianPackage
                    )}
                  />

                  <PlacementStat
                    icon={<IndianRupee className="h-4 w-4" />}
                    label="Highest Package"
                    value={formatPackage(
                      latestPlacement.highestPackage
                    )}
                  />

                  <PlacementStat
                    icon={<Users className="h-4 w-4" />}
                    label="Students Placed"
                    value={formatNumber(
                      latestPlacement.studentsPlaced
                    )}
                  />
                </div>
              </section>
            )}

            {/* Placement Records */}
            <section>
              <h3 className="text-lg font-bold text-slate-900">
                Placement Records
              </h3>

              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Year
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Course
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Students
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Placed
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Average
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Highest
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {placements.map((placement) => (
                        <PlacementRow
                          key={placement.id}
                          placement={placement}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Placement Details */}
            {latestPlacement && (
              <section>
                <h3 className="text-lg font-bold text-slate-900">
                  Placement Details
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCard
                    label="Placement Type"
                    value={formatValue(
                      latestPlacement.placementType
                    )}
                  />

                  <InfoCard
                    label="Total Offers"
                    value={formatNumber(
                      latestPlacement.totalOffers
                    )}
                  />

                  <InfoCard
                    label="Participating Companies"
                    value={formatNumber(
                      latestPlacement.participatingCompanies
                    )}
                  />

                  <InfoCard
                    label="Total Students"
                    value={formatNumber(
                      latestPlacement.totalStudents
                    )}
                  />

                  <InfoCard
                    label="Students Placed"
                    value={formatNumber(
                      latestPlacement.studentsPlaced
                    )}
                  />

                  <InfoCard
                    label="Placement Year"
                    value={String(latestPlacement.year)}
                  />
                </div>
              </section>
            )}

            {/* Recruiters */}
            {recruiters.length > 0 && (
              <section>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#15945c]" />

                  <h3 className="text-lg font-bold text-slate-900">
                    Top Recruiters
                  </h3>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Companies associated with the placement records available
                  for {college.name}.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recruiters.map((recruiter) => (
                    <div
                      key={recruiter.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                        {recruiter.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={recruiter.logo}
                            alt={`${recruiter.name} logo`}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">
                          {recruiter.name}
                        </p>

                        {recruiter.website && (
                          <a
                            href={recruiter.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#15945c] hover:underline"
                          >
                            Visit website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reports / Sources */}
            {latestPlacement &&
              (latestPlacement.placementReportUrl ||
                latestPlacement.sourceUrl) && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900">
                    Placement Sources
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {latestPlacement.placementReportUrl && (
                      <a
                        href={latestPlacement.placementReportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#15945c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#087a49]"
                      >
                        Placement Report
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    {latestPlacement.sourceUrl && (
                      <a
                        href={latestPlacement.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#15945c] hover:text-[#15945c]"
                      >
                        Source
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </section>
              )}
          </>
        )}
      </div>
    </article>
  );
}

function PlacementStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-[#15945c]">
        {icon}

        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function PlacementRow({
  placement,
}: {
  placement: PlacementRecord;
}) {
  return (
    <tr className="bg-white transition hover:bg-slate-50">
      <td className="px-4 py-4 font-semibold text-slate-900">
        {placement.year}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {placement.course || "All Courses"}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatNumber(placement.totalStudents)}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatNumber(placement.studentsPlaced)}
      </td>

      <td className="px-4 py-4 font-medium text-slate-900">
        {formatPackage(placement.averagePackage)}
      </td>

      <td className="px-4 py-4 font-medium text-slate-900">
        {formatPackage(placement.highestPackage)}
      </td>
    </tr>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EmptyPlacements() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-400" />

      <h3 className="mt-3 font-semibold text-slate-900">
        Placement information unavailable
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        Placement records have not been added for this college yet.
      </p>
    </div>
  );
}

function formatPackage(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN")} LPA`;
}

function formatNumber(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return number.toLocaleString("en-IN");
}

function formatValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getUniqueRecruiters(
  placements: CollegeDetail["placements"]
) {
  const map = new Map<
    string,
    {
      id: string;
      name: string;
      logo: string | null;
      website: string | null;
    }
  >();

  for (const placement of placements) {
    for (const relation of placement.recruiters) {
      const recruiter = relation.recruiter;

      if (!recruiter || map.has(recruiter.id)) {
        continue;
      }

      map.set(recruiter.id, {
        id: recruiter.id,
        name: recruiter.name,
        logo: recruiter.logo,
        website: recruiter.website,
      });
    }
  }

  return Array.from(map.values());
}