"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Heart,
  MapPin,
  Trash2,
} from "lucide-react";

type ShortlistedCollege = {
  id: string;
  collegeId: string;
  createdAt: Date | string;
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

type ShortlistPageClientProps = {
  shortlists: ShortlistedCollege[];
};

export default function ShortlistPageClient({
  shortlists: initialShortlists,
}: ShortlistPageClientProps) {
  const [shortlists, setShortlists] =
    useState(initialShortlists);
  const [removingId, setRemovingId] = useState<string | null>(
    null,
  );

  async function removeFromShortlist(collegeId: string) {
    setRemovingId(collegeId);

    try {
      const response = await fetch("/api/user/shortlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to remove college.",
        );
      }

      setShortlists((current) =>
        current.filter(
          (item) => item.collegeId !== collegeId,
        ),
      );

      window.dispatchEvent(
        new CustomEvent("college-shortlist-updated"),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to remove college.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eaf7f1] px-3 py-1.5 text-sm font-semibold text-[#15945c]">
                <Heart size={15} fill="currentColor" />
                My Shortlist
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Shortlisted Colleges
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Keep track of the colleges you are interested in
                and compare them before making your decision.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center shadow-sm sm:block">
              <p className="text-2xl font-bold text-[#15945c]">
                {shortlists.length}
              </p>
              <p className="text-xs font-medium text-gray-500">
                Shortlisted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {shortlists.length === 0 ? (
          <EmptyShortlist />
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Your Colleges
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {shortlists.length}{" "}
                  {shortlists.length === 1
                    ? "college"
                    : "colleges"}{" "}
                  saved
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {shortlists.map((item) => (
                <CollegeShortlistCard
                  key={item.id}
                  item={item}
                  removing={
                    removingId === item.collegeId
                  }
                  onRemove={removeFromShortlist}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function CollegeShortlistCard({
  item,
  removing,
  onRemove,
}: {
  item: ShortlistedCollege;
  removing: boolean;
  onRemove: (collegeId: string) => void;
}) {
  const { college } = item;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Cover */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#eaf7f1] to-[#dff2e9]">
        {college.coverImage ? (
          <img
            src={college.coverImage}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2
              size={42}
              className="text-[#15945c]/30"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => onRemove(college.id)}
          disabled={removing}
          aria-label={`Remove ${college.name} from shortlist`}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/95 text-gray-500 shadow-sm transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={16} />
        </button>

        {college.verified && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#15945c] shadow-sm">
            <CheckCircle2 size={13} />
            Verified
          </div>
        )}
      </div>

      {/* College info */}
      <div className="p-5">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white">
            {college.logo ? (
              <img
                src={college.logo}
                alt={`${college.name} logo`}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <Building2
                size={21}
                className="text-gray-400"
              />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-bold leading-5 text-gray-900">
              {college.name}
            </h3>

            {college.shortName && (
              <p className="mt-1 text-xs font-medium text-gray-500">
                {college.shortName}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {college.city && (
            <div className="flex items-center gap-2">
              <MapPin
                size={15}
                className="shrink-0 text-gray-400"
              />
              <span>
                {college.city.name},{" "}
                {college.city.state.name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Building2
              size={15}
              className="shrink-0 text-gray-400"
            />
            <span>{formatCollegeType(college.collegeType)}</span>
          </div>
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <Link
            href={`/colleges/${college.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#15945c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117a4b]"
          >
            View College
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyShortlist() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf7f1] text-[#15945c]">
        <Heart size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">
        Your shortlist is empty
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        Save colleges you're interested in and come back here
        to review them before making your decision.
      </p>

      <Link
        href="/colleges"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117a4b]"
      >
        Explore Colleges
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function formatCollegeType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}