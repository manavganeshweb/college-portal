"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  MapPin,
  Trash2,
} from "lucide-react";

type Application = {
  id: string;
  collegeId: string;
  status: string;
  courseName: string | null;
  notes: string | null;
  appliedAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;

  college: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    logo: string | null;
    coverImage: string | null;
    collegeType: string;
    verified: boolean;
    status: string;

   city: {
  name: string;
  state: {
    name: string;
  };
} | null;
  };
};

type ApplicationsPageClientProps = {
  applications: Application[];
};

function formatDate(date: string | Date | null) {
  if (!date) return "Not applied yet";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function getStatusClasses(status: string) {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";

    case "APPLIED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "SHORTLISTED":
      return "bg-purple-50 text-purple-700 border-purple-200";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export default function ApplicationsPageClient({
  applications: initialApplications,
}: ApplicationsPageClientProps) {
  const [applications, setApplications] =
    useState(initialApplications);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(applicationId: string) {
    const confirmed = window.confirm(
      "Remove this college from your applications?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(applicationId);

      const response = await fetch(
        `/api/user/applications/${applicationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to remove application."
        );
      }

      setApplications((current) =>
        current.filter(
          (application) => application.id !== applicationId
        )
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to remove application."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#15945c]/10 px-3 py-1.5 text-sm font-medium text-[#15945c]">
              <FileText className="h-4 w-4" />
              My Applications
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your college applications
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-600">
              Keep track of the colleges you are interested in and
              manage your application progress in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {applications.length === 0 ? (
          <EmptyApplications />
        ) : (
          <div className="space-y-5">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                deleting={deletingId === application.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ApplicationCard({
  application,
  deleting,
  onDelete,
}: {
  application: Application;
  deleting: boolean;
  onDelete: (id: string) => void;
}) {
  const { college } = application;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-48 w-full shrink-0 bg-slate-100 lg:h-auto lg:w-64">
          {college.coverImage ? (
            <Image
              src={college.coverImage}
              alt={college.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-10 w-10 text-slate-300" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="flex-1 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                {college.logo && (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <Image
                      src={college.logo}
                      alt=""
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {college.name}
                  </h2>

                  {college.shortName && (
                    <p className="mt-0.5 text-sm text-slate-500">
                      {college.shortName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {college.city?.name || "Not specified"},{" "}
                  {college.city?.state.name || "Not specified"}
                </span>

                <span>{college.collegeType}</span>

                {college.verified && (
                  <span className="inline-flex items-center gap-1 text-[#15945c]">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                application.status
              )}`}
            >
              {getStatusLabel(application.status)}
            </span>
          </div>

          <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Course
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {application.courseName || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Applied date
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                {formatDate(application.appliedAt)}
              </p>
            </div>
          </div>

          {application.notes && (
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Notes
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {application.notes}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/colleges/${college.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#15945c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117a4b]"
            >
              View College
              <ExternalLink className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => onDelete(application.id)}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Removing..." : "Remove"}
            </button>

            {application.status === "INTERESTED" && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <Clock3 className="h-3.5 w-3.5" />
                Application not submitted yet
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyApplications() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#15945c]/10">
        <FileText className="h-7 w-7 text-[#15945c]" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">
        No applications yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        When you add a college from its page, it will appear here
        so you can keep track of your application progress.
      </p>

      <Link
        href="/colleges"
        className="mt-6 inline-flex items-center rounded-xl bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117a4b]"
      >
        Explore Colleges
      </Link>
    </div>
  );
}