"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  GitCompareArrows,
  MapPin,
  Star,
} from "lucide-react";

const STORAGE_KEY = "college-aadhar-compare";

type CompareCollege = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  establishedYear: number | null;
  collegeType: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  verified: boolean;
  lastUpdated: string;

  state: {
    name: string;
  };

  city: {
    name: string;
  };

  averageRating: number | null;
  reviewCount: number;

  minimumFee: number | null;
  maximumFee: number | null;

  courses: {
    id: string;
    fees: number | null;
    seats: number | null;
    duration: number | null;

    course: {
      id: string;
      name: string;
      slug: string;
      shortName: string | null;
      degree: string | null;
      level: string;
      durationYears: number | null;
      averageFees: number | null;

      category: {
        name: string;
        slug: string;
      };
    };
  }[];

  rankings: {
    year: number;
    rank: number;
    category: string;
    rankingBody: string;
    score: number | null;
  }[];

  cutoffs: {
    year: number;
    category: string;
    gender: string | null;
    course: string | null;
    openingRank: number | null;
    closingRank: number | null;

    exam: {
      name: string;
      shortName: string | null;
    };
  }[];

  departments: {
    id: string;
    name: string;
    slug: string;
  }[];

  placements: {
    year: number;
    course: string | null;
    placementType: string;
    totalStudents: number | null;
    studentsPlaced: number | null;
    averagePackage: number | null;
    medianPackage: number | null;
    highestPackage: number | null;
    totalOffers: number | null;
    participatingCompanies: number | null;

    recruiters: {
      recruiter: {
        id: string;
        name: string;
        logo: string | null;
      };
    }[];
  }[];
};

export default function ComparePage() {
  const [colleges, setColleges] = useState<CompareCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComparison = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
          setError("No colleges selected for comparison.");
          setLoading(false);
          return;
        }

        const selected: {
          id: string;
        }[] = JSON.parse(stored);

        const ids = selected.map((college) => college.id);

        if (ids.length < 3) {
          setError(
            "Please select at least 3 colleges to compare."
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/colleges/compare?ids=${ids.join(",")}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load comparison."
          );
        }

        /*
         * Preserve the order in which the user selected
         * the colleges.
         */
        const orderedColleges = ids
          .map((id) =>
            result.data.find(
              (college: CompareCollege) => college.id === id
            )
          )
          .filter(Boolean);

        setColleges(orderedColleges);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load comparison."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="h-10 w-72 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || colleges.length < 3) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <GitCompareArrows className="h-7 w-7" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Select colleges to compare
            </h1>

            <p className="mt-3 text-slate-500">
              {error ||
                "Please select at least three colleges before comparing."}
            </p>

            <Link
              href="/colleges"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Explore Colleges
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Colleges
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <GitCompareArrows className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Compare Colleges
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Compare courses, fees, rankings, placements and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* College headers */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `220px repeat(${colleges.length}, minmax(260px, 1fr))`,
            }}
          >
            <div className="border-b border-r border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                College
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-700">
                Comparison
              </p>
            </div>

            {colleges.map((college) => (
              <CollegeHeader
                key={college.id}
                college={college}
              />
            ))}
          </div>

          {/* Basic information */}
          <ComparisonSection title="Basic Information">
            <ComparisonRow
              label="Location"
              colleges={colleges}
              render={(college) => (
                <div className="flex items-center justify-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span>
                    {college.city.name}, {college.state.name}
                  </span>
                </div>
              )}
            />

            <ComparisonRow
              label="College Type"
              colleges={colleges}
              render={(college) => college.collegeType}
            />

            <ComparisonRow
              label="Established"
              colleges={colleges}
              render={(college) =>
                college.establishedYear ?? "—"
              }
            />

            <ComparisonRow
              label="Verification"
              colleges={colleges}
              render={(college) =>
                college.verified ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Not verified
                  </span>
                )
              }
            />
          </ComparisonSection>

          {/* Ratings */}
          <ComparisonSection title="Ratings & Reviews">
            <ComparisonRow
              label="Rating"
              colleges={colleges}
              render={(college) =>
                college.averageRating !== null ? (
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Star className="h-4 w-4 fill-current text-amber-400" />
                    {college.averageRating.toFixed(1)} / 5
                  </span>
                ) : (
                  "No rating"
                )
              }
            />

            <ComparisonRow
              label="Reviews"
              colleges={colleges}
              render={(college) =>
                college.reviewCount > 0
                  ? `${college.reviewCount} reviews`
                  : "No reviews"
              }
            />
          </ComparisonSection>

          {/* Fees */}
          <ComparisonSection title="Fees">
            <ComparisonRow
              label="Minimum Course Fee"
              colleges={colleges}
              render={(college) =>
                formatCurrency(college.minimumFee)
              }
            />

            <ComparisonRow
              label="Maximum Course Fee"
              colleges={colleges}
              render={(college) =>
                formatCurrency(college.maximumFee)
              }
            />
          </ComparisonSection>

          {/* Courses */}
          <ComparisonSection title="Courses">
            <ComparisonRow
              label="Total Courses"
              colleges={colleges}
              render={(college) =>
                `${college.courses.length} courses`
              }
            />

            <ComparisonRow
              label="Course Levels"
              colleges={colleges}
              render={(college) => {
                const levels = [
                  ...new Set(
                    college.courses.map(
                      (item) => item.course.level
                    )
                  ),
                ];

                return levels.length > 0
                  ? levels.join(", ")
                  : "—";
              }}
            />
          </ComparisonSection>

          {/* Rankings */}
          <ComparisonSection title="Rankings">
            <ComparisonRow
              label="Latest Ranking"
              colleges={colleges}
              render={(college) => {
                const ranking = college.rankings[0];

                if (!ranking) {
                  return "No ranking available";
                }

                return (
                  <div>
                    <p className="font-bold text-slate-900">
                      #{ranking.rank}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {ranking.rankingBody} ·{" "}
                      {ranking.year}
                    </p>
                  </div>
                );
              }}
            />
          </ComparisonSection>

          {/* Placements */}
          <ComparisonSection title="Placements">
            <ComparisonRow
              label="Average Package"
              colleges={colleges}
              render={(college) => {
                const placement = college.placements[0];

                return formatPackage(
                  placement?.averagePackage ?? null
                );
              }}
            />

            <ComparisonRow
              label="Highest Package"
              colleges={colleges}
              render={(college) => {
                const placement = college.placements[0];

                return formatPackage(
                  placement?.highestPackage ?? null
                );
              }}
            />

            <ComparisonRow
              label="Students Placed"
              colleges={colleges}
              render={(college) => {
                const placement = college.placements[0];

                return placement?.studentsPlaced ?? "—";
              }}
            />
          </ComparisonSection>

          {/* Departments */}
          <ComparisonSection title="Departments">
            <ComparisonRow
              label="Departments"
              colleges={colleges}
              render={(college) =>
                college.departments.length > 0 ? (
                  <div className="space-y-1">
                    {college.departments
                      .slice(0, 5)
                      .map((department) => (
                        <p key={department.id}>
                          {department.name}
                        </p>
                      ))}

                    {college.departments.length > 5 && (
                      <p className="text-xs text-slate-400">
                        +{college.departments.length - 5} more
                      </p>
                    )}
                  </div>
                ) : (
                  "No departments available"
                )
              }
            />
          </ComparisonSection>
        </div>
      </section>
    </main>
  );
}

/* ---------------------------------- */
/* Components */
/* ---------------------------------- */

function CollegeHeader({
  college,
}: {
  college: CompareCollege;
}) {
  const initials = college.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="border-b border-slate-200 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {college.logo ? (
            <Image
              src={college.logo}
              alt={college.name}
              width={64}
              height={64}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <span className="text-lg font-bold text-emerald-600">
              {initials}
            </span>
          )}
        </div>

        <div className="min-w-0">
          {college.verified && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified
            </span>
          )}

          <h2 className="mt-1 line-clamp-2 text-base font-bold text-slate-900">
            {college.name}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {college.city.name}, {college.state.name}
          </p>

          <Link
            href={`/colleges/${college.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View College
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ComparisonSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function ComparisonRow({
  label,
  colleges,
  render,
}: {
  label: string;
  colleges: CompareCollege[];
  render: (college: CompareCollege) => React.ReactNode;
}) {
  return (
    <div
      className="grid border-b border-slate-100 last:border-b-0"
      style={{
        gridTemplateColumns: `220px repeat(${colleges.length}, minmax(260px, 1fr))`,
      }}
    >
      <div className="border-r border-slate-100 bg-white px-5 py-4 text-sm font-semibold text-slate-600">
        {label}
      </div>

      {colleges.map((college) => (
        <div
          key={college.id}
          className="border-r border-slate-100 px-5 py-4 text-center text-sm text-slate-700 last:border-r-0"
        >
          {render(college)}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

function formatCurrency(value: number | null) {
  if (value === null) {
    return "—";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatPackage(value: number | null) {
  if (value === null) {
    return "—";
  }

  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} LPA`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}