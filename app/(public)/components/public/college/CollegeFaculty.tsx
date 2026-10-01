import Image from "next/image";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Mail,
  UserRound,
} from "lucide-react";

import type { CollegeDetail } from "@/services/college.service";

type CollegeFacultyProps = {
  collegeName: string;
  departments: CollegeDetail["departments"];
};

type Department = CollegeDetail["departments"][number];
type FacultyMember = Department["faculty"][number];

export default function CollegeFaculty({
  collegeName,
  departments,
}: CollegeFacultyProps) {
  const publishedFaculty = departments.flatMap((department) =>
    department.faculty.filter((member) => member.isPublished)
  );

  return (
    <article
      id="faculty"
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10">
            <GraduationCap className="h-5 w-5 text-[#15945c]" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {collegeName} Faculty
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore faculty members, departments, designations,
              qualifications and areas of specialization available at{" "}
              {collegeName}.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        {departments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Faculty Overview */}
            <section>
              <h3 className="text-lg font-bold text-slate-900">
                Faculty Overview
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <OverviewCard
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Departments"
                  value={departments.length.toString()}
                />

                <OverviewCard
                  icon={<UserRound className="h-4 w-4" />}
                  label="Published Faculty"
                  value={publishedFaculty.length.toString()}
                />

                <OverviewCard
  icon={<BookOpen className="h-4 w-4" />}
  label="Departments With Faculty"
  value={
    departments.filter(
      (department) =>
        department.faculty.some((member) => member.isPublished)
    ).length.toString()
  }
/>
              </div>
            </section>

            {/* Departments */}
            <section>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Departments & Faculty
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Faculty information grouped by academic department.
                </p>
              </div>

              <div className="mt-5 space-y-6">
                {departments.map((department) => (
                  <DepartmentSection
                    key={department.id}
                    department={department}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </article>
  );
}

function DepartmentSection({
  department,
}: {
  department: Department;
}) {
  const faculty = department.faculty.filter(
    (member) => member.isPublished
  );

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200">
      {/* Department Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="font-bold text-slate-900">
              {department.name}
            </h4>

            {department.description && (
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                {department.description}
              </p>
            )}
          </div>

          {department.establishedYear && (
            <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
              Established {department.establishedYear}
            </span>
          )}
        </div>

        {department.hodName && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-700">
              Head of Department:
            </span>

            <span className="text-slate-600">
              {department.hodName}
            </span>
          </div>
        )}
      </div>

      {/* Faculty */}
      {faculty.length === 0 ? (
        <div className="px-5 py-6 text-sm text-slate-500">
          No published faculty profiles are available for this
          department.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {faculty.map((member) => (
            <FacultyCard
              key={member.id}
              faculty={member}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function FacultyCard({
  faculty,
}: {
  faculty: FacultyMember;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:px-5">
      {/* Profile Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {faculty.profileImage ? (
          <Image
            src={faculty.profileImage}
            alt={faculty.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound className="h-8 w-8 text-slate-400" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h5 className="font-semibold text-slate-900">
              {faculty.name}
            </h5>

            {faculty.designation && (
              <p className="mt-0.5 text-sm font-medium text-[#15945c]">
                {faculty.designation}
              </p>
            )}
          </div>

          {faculty.experienceYears !== null && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {faculty.experienceYears}{" "}
              {faculty.experienceYears === 1 ? "Year" : "Years"}{" "}
              Experience
            </span>
          )}
        </div>

        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          {faculty.qualification && (
            <InfoItem
              icon={<GraduationCap className="h-4 w-4" />}
              label="Qualification"
              value={faculty.qualification}
            />
          )}

          {faculty.specialization && (
            <InfoItem
              icon={<BookOpen className="h-4 w-4" />}
              label="Specialization"
              value={faculty.specialization}
            />
          )}

          {faculty.email && (
            <a
              href={`mailto:${faculty.email}`}
              className="flex items-start gap-2 transition hover:text-[#15945c]"
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />

              <span className="min-w-0 break-all">
                {faculty.email}
              </span>
            </a>
          )}
        </div>

        {faculty.profileUrl && (
          <a
            href={faculty.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm font-semibold text-[#15945c] hover:underline"
          >
            View Faculty Profile
          </a>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-[#15945c]">
        {icon}
      </span>

      <span>
        <span className="font-medium text-slate-700">
          {label}:
        </span>{" "}
        {value}
      </span>
    </div>
  );
}

function OverviewCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2">
        <span className="text-[#15945c]">{icon}</span>

        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <GraduationCap className="mx-auto h-8 w-8 text-slate-400" />

      <h3 className="mt-3 font-semibold text-slate-900">
        Faculty information unavailable
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        Faculty and department information has not been added for
        this college yet.
      </p>
    </div>
  );
}