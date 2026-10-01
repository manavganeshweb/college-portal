import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
} from "lucide-react";

import type { CollegeDetail } from "@/services/college.service";

type CollegeAdmissionProps = {
  college: CollegeDetail;
};

export default function CollegeAdmission({
  college,
}: CollegeAdmissionProps) {
  const courses = college.courses ?? [];

  return (
    <article
      id="admission"
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10">
            <ClipboardList className="h-5 w-5 text-[#15945c]" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {college.name} Admission 2026
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Get information about the admission process, eligibility
              requirements and available courses at {college.name}.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        {/* Admission Overview */}
        <section>
          <h3 className="text-lg font-bold text-slate-900">
            Admission Overview
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Admission requirements and selection procedures may vary depending
            on the course and level of study. Students should check the
            eligibility requirements and admission instructions applicable to
            their selected programme.
          </p>
        </section>

        {/* Available Courses */}
        {courses.length > 0 && (
          <section>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#15945c]" />

              <h3 className="text-lg font-bold text-slate-900">
                Courses Available for Admission
              </h3>
            </div>

            <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {courses.map((collegeCourse) => {
                const course = collegeCourse.course;

                return (
                  <div
                    key={collegeCourse.id}
                    className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900">
                        {course.name}
                      </h4>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        {course.degree && (
                          <span>{course.degree}</span>
                        )}

                        {course.level && (
                          <span>{formatValue(course.level)}</span>
                        )}

                        {course.durationYears && (
                          <span>
                            {formatDuration(course.durationYears)}
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={`/colleges/${college.slug}/courses-fees?slug=${course.slug}`}
                      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#15945c] transition hover:text-[#087a49]"
                    >
                      View Course
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Eligibility */}
        {courses.length > 0 && (
          <section>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#15945c]" />

              <h3 className="text-lg font-bold text-slate-900">
                Eligibility Criteria
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {courses.map((collegeCourse) => {
                const course = collegeCourse.course;

                if (!course.eligibility) {
                  return null;
                }

                return (
                  <div
                    key={collegeCourse.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h4 className="font-semibold text-slate-900">
                      {course.name}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {course.eligibility}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Admission Process */}
        <section>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#15945c]" />

            <h3 className="text-lg font-bold text-slate-900">
              Admission Process
            </h3>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <AdmissionStep
              number="01"
              title="Select Course"
              description="Choose the programme you want to pursue."
            />

            <AdmissionStep
              number="02"
              title="Check Eligibility"
              description="Review the eligibility requirements for the selected programme."
            />

            <AdmissionStep
              number="03"
              title="Apply"
              description="Complete the admission process according to the college's instructions."
            />
          </div>
        </section>

        {/* Important Note */}
        <div className="rounded-xl border border-[#15945c]/20 bg-[#15945c]/5 p-4">
          <p className="text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">
              Important:
            </span>{" "}
            Admission requirements, application procedures and deadlines can
            differ by programme. Students should verify the latest information
            before applying.
          </p>
        </div>
      </div>
    </article>
  );
}

type AdmissionStepProps = {
  number: string;
  title: string;
  description: string;
};

function AdmissionStep({
  number,
  title,
  description,
}: AdmissionStepProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#15945c]/10 text-xs font-bold text-[#15945c]">
          {number}
        </span>

        <h4 className="font-semibold text-slate-900">{title}</h4>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function formatValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDuration(value: unknown): string {
  const years = Number(value);

  if (!Number.isFinite(years)) {
    return "";
  }

  return `${years} ${years === 1 ? "Year" : "Years"}`;
}