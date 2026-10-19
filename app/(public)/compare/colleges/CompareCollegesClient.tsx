"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

type ComparisonCourse = {
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
    } | null;
  };
};

type College = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  establishedYear: number | null;
  collegeType: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  verified: boolean;
  lastUpdated: string | Date | null;

  state: { name: string } | null;
  city: { name: string } | null;

  courses: ComparisonCourse[];

  averageRating: number | null;
  reviewCount: number;

  minimumFee: number | null;
  maximumFee: number | null;

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
    } | null;
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

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: College[];
};

const GREEN = "#15945c";

function formatCurrency(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPackage(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) {
    return "Not available";
  }

  return `${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })} LPA`;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <span className="text-emerald-700">{icon}</span>
        <h2 className="text-base font-bold text-slate-900">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function ComparisonTable({
  colleges,
  rows,
}: {
  colleges: College[];
  rows: {
    label: string;
    values: (college: College) => React.ReactNode;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-white">
            <th className="sticky left-0 z-10 w-52 border-b border-r border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-700">
              Comparison
            </th>

            {colleges.map((college) => (
              <th
                key={college.id}
                className="min-w-[230px] border-b border-r border-slate-200 px-5 py-4 align-top last:border-r-0"
              >
                <Link
                  href={`/colleges/${college.slug}`}
                  className="font-bold text-slate-900 transition hover:text-emerald-700"
                >
                  {college.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={
                index % 2 === 0
                  ? "bg-white"
                  : "bg-[#fafafa]"
              }
            >
              <th className="sticky left-0 z-10 border-b border-r border-slate-200 bg-inherit px-5 py-4 font-medium text-slate-600">
                {row.label}
              </th>

              {colleges.map((college) => (
                <td
                  key={college.id}
                  className="border-b border-r border-slate-200 px-5 py-4 align-top text-slate-800 last:border-r-0"
                >
                  {row.values(college)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CompareCollegesClient() {
      const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ids = Array.from(
    new Set(
      idsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    )
  );

  useEffect(() => {
    let cancelled = false;

    async function loadColleges() {
      setLoading(true);
      setError("");
      setColleges([]);

      if (ids.length < 3 || ids.length > 4) {
        setError(
          "Please select between 3 and 4 colleges to compare."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/colleges/compare?ids=${encodeURIComponent(
            ids.join(",")
          )}`,
          {
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as ApiResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Unable to load the selected colleges."
          );
        }

        if (!result.data || result.data.length !== ids.length) {
          throw new Error(
            "Some selected colleges could not be found."
          );
        }

        if (!cancelled) {
          const collegesById = new Map(
            result.data.map((college) => [
              college.id,
              college,
            ])
          );

          // Preserve the order in which the user selected colleges.
          setColleges(
            ids
              .map((id) => collegesById.get(id))
              .filter(
                (college): college is College =>
                  Boolean(college)
              )
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadColleges();

    return () => {
      cancelled = true;
    };
  }, [idsParam]);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Comparing colleges
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Fetching details for your selected colleges...
          </p>
        </div>
      </main>
    );
  }

  if (error || colleges.length === 0) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Building2 className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Unable to compare colleges
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error ||
              "Select at least three colleges to compare their details."}
          </p>

          <Link
            href="/compare"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Select colleges
          </Link>
        </div>
      </main>
    );
  }

  const sections = [
    {
      title: "Overview",
      icon: <Building2 className="h-5 w-5" />,
      rows: [
        {
          label: "Institution type",
          values: (c: College) => formatValue(c.collegeType),
        },
        {
          label: "Established",
          values: (c: College) => formatValue(c.establishedYear),
        },
        {
          label: "Verified",
          values: (c: College) =>
            c.verified ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Verified
              </span>
            ) : (
              "Not verified"
            ),
        },
        {
          label: "Website",
          values: (c: College) =>
            c.website ? (
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-700 hover:underline"
              >
                Visit website
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              "Not available"
            ),
        },
        {
          label: "Description",
          values: (c: College) => (
            <p className="max-w-sm leading-6 text-slate-600">
              {c.description
                ? `${c.description.slice(0, 220)}${
                    c.description.length > 220 ? "…" : ""
                  }`
                : "Not available"}
            </p>
          ),
        },
      ],
    },
    {
      title: "Location",
      icon: <MapPin className="h-5 w-5" />,
      rows: [
        {
          label: "State",
          values: (c: College) =>
            formatValue(c.state?.name),
        },
        {
          label: "City",
          values: (c: College) =>
            formatValue(c.city?.name),
        },
        {
          label: "Address",
          values: (c: College) => formatValue(c.address),
        },
        {
          label: "Phone",
          values: (c: College) => formatValue(c.phone),
        },
        {
          label: "Email",
          values: (c: College) => formatValue(c.email),
        },
      ],
    },
    {
      title: "Fees and ratings",
      icon: <Wallet className="h-5 w-5" />,
      rows: [
        {
          label: "Minimum course fee",
          values: (c: College) => (
            <span className="font-semibold">
              {formatCurrency(c.minimumFee)}
            </span>
          ),
        },
        {
          label: "Maximum course fee",
          values: (c: College) => (
            <span className="font-semibold">
              {formatCurrency(c.maximumFee)}
            </span>
          ),
        },
        {
          label: "Average rating",
          values: (c: College) =>
            c.averageRating == null ? (
              "Not rated"
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {c.averageRating.toFixed(1)} / 5
              </span>
            ),
        },
        {
          label: "Published reviews",
          values: (c: College) => formatValue(c.reviewCount),
        },
      ],
    },
    {
      title: "Courses",
      icon: <GraduationCap className="h-5 w-5" />,
      rows: [
        {
          label: "Available courses",
          values: (c: College) => c.courses.length,
        },
        {
          label: "Course list",
          values: (c: College) =>
            c.courses.length ? (
              <ul className="space-y-3">
                {c.courses.slice(0, 12).map((item) => (
                  <li key={item.id}>
                    <p className="font-semibold text-slate-800">
                      {item.course.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.course.level}
                      {item.course.degree
                        ? ` · ${item.course.degree}`
                        : ""}
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">
                      {formatCurrency(item.fees)}
                    </p>
                  </li>
                ))}

                {c.courses.length > 12 && (
                  <li className="text-xs text-slate-500">
                    And {c.courses.length - 12} more courses
                  </li>
                )}
              </ul>
            ) : (
              "No course details available"
            ),
        },
        {
          label: "Departments",
          values: (c: College) =>
            c.departments.length
              ? c.departments.map((d) => d.name).join(", ")
              : "Not available",
        },
      ],
    },
    {
      title: "Rankings",
      icon: <Trophy className="h-5 w-5" />,
      rows: [
        {
          label: "Published rankings",
          values: (c: College) => c.rankings.length,
        },
        {
          label: "Ranking details",
          values: (c: College) =>
            c.rankings.length ? (
              <ul className="space-y-3">
                {c.rankings.slice(0, 8).map((r, index) => (
                  <li key={`${r.rankingBody}-${r.year}-${index}`}>
                    <p className="font-semibold">
                      {r.rankingBody}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {r.category} · {r.year}
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      Rank: {r.rank}
                      {r.score != null
                        ? ` · Score: ${r.score}`
                        : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              "No published rankings"
            ),
        },
      ],
    },
    {
      title: "Placements",
      icon: <Trophy className="h-5 w-5" />,
      rows: [
        {
          label: "Placement records",
          values: (c: College) => c.placements.length,
        },
        {
          label: "Placement statistics",
          values: (c: College) =>
            c.placements.length ? (
              <ul className="space-y-4">
                {c.placements.slice(0, 8).map((p, index) => (
                  <li
                    key={`${p.year}-${p.placementType}-${index}`}
                    className="border-b border-slate-100 pb-3 last:border-0"
                  >
                    <p className="font-semibold text-slate-800">
                      {p.year} · {p.placementType}
                    </p>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <p>
                        Average: {formatPackage(p.averagePackage)}
                      </p>
                      <p>
                        Median: {formatPackage(p.medianPackage)}
                      </p>
                      <p>
                        Highest: {formatPackage(p.highestPackage)}
                      </p>
                      <p>
                        Students placed:{" "}
                        {formatValue(p.studentsPlaced)}
                      </p>
                      <p>
                        Offers: {formatValue(p.totalOffers)}
                      </p>
                    </div>

                    {p.recruiters.length > 0 && (
                      <p className="mt-2 text-xs text-slate-500">
                        Recruiters:{" "}
                        {p.recruiters
                          .map((r) => r.recruiter.name)
                          .join(", ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              "Placement statistics not available"
            ),
        },
      ],
    },
    {
      title: "Cutoffs",
      icon: <ShieldCheck className="h-5 w-5" />,
      rows: [
        {
          label: "Available cutoff records",
          values: (c: College) => c.cutoffs.length,
        },
        {
          label: "Cutoff details",
          values: (c: College) =>
            c.cutoffs.length ? (
              <ul className="space-y-3">
                {c.cutoffs.slice(0, 10).map((cutoff, index) => (
                  <li
                    key={`${cutoff.year}-${cutoff.category}-${index}`}
                  >
                    <p className="font-semibold">
                      {cutoff.exam?.shortName ||
                        cutoff.exam?.name ||
                        cutoff.course ||
                        "Admission cutoff"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {cutoff.year} · {cutoff.category}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Opening: {formatValue(cutoff.openingRank)}
                    </p>
                    <p className="text-xs text-slate-600">
                      Closing: {formatValue(cutoff.closingRank)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              "No cutoff data available"
            ),
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to college selection
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              College Aadhar
            </p>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Compare Colleges
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Compare fees, courses, rankings, placements and
              other available information side by side to make
              a more informed college decision.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
                {colleges.length} colleges selected
              </span>

              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
                Side-by-side comparison
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0 lg:grid-cols-4">
            {colleges.map((college) => (
              <div
                key={college.id}
                className="p-5 sm:p-6"
              >
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {college.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={college.logo}
                      alt={`${college.name} logo`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Building2 className="h-7 w-7 text-slate-400" />
                  )}
                </div>

                <div className="mt-4 flex items-start gap-2">
                  <h2 className="font-bold leading-6 text-slate-900">
                    {college.name}
                  </h2>

                  {college.verified && (
                    <CheckCircle2
                      className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                      aria-label="Verified college"
                    />
                  )}
                </div>

                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {[college.city?.name, college.state?.name]
                    .filter(Boolean)
                    .join(", ") || "Location unavailable"}
                </p>

                <p className="mt-3 text-sm font-semibold text-emerald-700">
                  {college.averageRating != null
                    ? `${college.averageRating.toFixed(1)} / 5`
                    : "Not rated"}

                  <span className="ml-1 font-normal text-slate-500">
                    ({college.reviewCount} reviews)
                  </span>
                </p>

                <Link
                  href={`/colleges/${college.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-emerald-700"
                >
                  View college
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <Section
              key={section.title}
              title={section.title}
              icon={section.icon}
            >
              <ComparisonTable
                colleges={colleges}
                rows={section.rows}
              />
            </Section>
          ))}
        </div>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Comparison results are based on information currently
          available in College Aadhar. Missing values indicate
          that information has not been provided; they do not
          necessarily mean that a college lacks that facility
          or outcome.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Compare other colleges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}