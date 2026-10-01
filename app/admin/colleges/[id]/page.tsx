import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CircleX,
  Edit,
  ExternalLink,
  FileText,
  GraduationCap,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import CollegeCourses from "./courses/CollegeCourses";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReviewModerationActions from "./ReviewModerationActions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getCollege(id: string) {
  const college = await prisma.college.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      logo: true,
      coverImage: true,
      description: true,
      establishedYear: true,
      collegeType: true,
      website: true,
      email: true,
      phone: true,
      address: true,
      verified: true,
      status: true,
      lastUpdated: true,
      seoTitle: true,
      seoDescription: true,
      createdAt: true,

      state: {
        select: {
          id: true,
          name: true,
        },
      },

      city: {
        select: {
          id: true,
          name: true,
        },
      },

      courses: {
        select: {
          id: true,
          fees: true,
          seats: true,
          course: {
            select: {
              id: true,
              name: true,
              shortName: true,
              level: true,
            },
          },
        },
        orderBy: {
          course: {
            name: "asc",
          },
        },
        take: 8,
      },

      departments: {
        select: {
          id: true,
          name: true,
          hodName: true,
          _count: {
            select: {
              faculty: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        take: 8,
      },

      rankings: {
        select: {
          id: true,
          year: true,
          rank: true,
          category: true,
          rankingBody: true,
          score: true,
          status: true,
        },
        orderBy: [
          {
            year: "desc",
          },
          {
            rank: "asc",
          },
        ],
        take: 8,
      },

      placements: {
        select: {
          id: true,
          year: true,
          course: true,
          placementType: true,
          averagePackage: true,
          highestPackage: true,
          studentsPlaced: true,
          status: true,
        },
        orderBy: {
          year: "desc",
        },
        take: 8,
      },

      cutoffs: {
        select: {
          id: true,
          year: true,
          category: true,
          course: true,
          openingRank: true,
          closingRank: true,
          exam: {
            select: {
              name: true,
              shortName: true,
            },
          },
        },
        orderBy: {
          year: "desc",
        },
        take: 8,
      },
reviews: {
  select: {
    id: true,
    rating: true,
    title: true,
    content: true,
    isVerifiedStudent: true,
    isPublished: true,
    createdAt: true,
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 5,
},

      questions: {
        select: {
          id: true,
          question: true,
          askerName: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              answers: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },

      _count: {
        select: {
          courses: true,
          departments: true,
          rankings: true,
          placements: true,
          cutoffs: true,
          reviews: true,
          questions: true,
        },
      },
    },
  });

  if (!college) {
    return null;
  }

  return {
    ...college,

    courses: college.courses.map((item) => ({
      ...item,
      fees:
        item.fees !== null
          ? Number(item.fees)
          : null,
    })),

    rankings: college.rankings.map((item) => ({
      ...item,
      score:
        item.score !== null
          ? Number(item.score)
          : null,
    })),

    placements: college.placements.map((item) => ({
      ...item,
      averagePackage:
        item.averagePackage !== null
          ? Number(item.averagePackage)
          : null,
      highestPackage:
        item.highestPackage !== null
          ? Number(item.highestPackage)
          : null,
    })),
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(value: number | null) {
  if (value === null) return "—";

  return `₹${value.toLocaleString("en-IN")}`;
}

export default async function AdminCollegeDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const college = await getCollege(id);

  if (!college) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/colleges"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-[#15945c] hover:text-[#15945c]"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white">
              {college.logo ? (
                <img
                  src={college.logo}
                  alt=""
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <Building2
                  size={28}
                  className="text-gray-400"
                />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {college.name}
                </h1>

                {college.verified && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <ShieldCheck size={14} />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {college.shortName || college.slug}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {college.city.name},{" "}
                  {college.state.name}
                </span>

                <span>
                  {college.collegeType}
                </span>

                {college.establishedYear && (
                  <span>
                    Est. {college.establishedYear}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/colleges/${college.slug}`}
            target="_blank"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 hover:border-[#15945c] hover:text-[#15945c]"
          >
            <ExternalLink size={16} />
            View Website
          </Link>

          <Link
            href={`/admin/colleges/${college.id}/edit`}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#15945c] px-4 text-sm font-semibold text-white hover:bg-[#117a4b]"
          >
            <Edit size={16} />
            Edit College
          </Link>
        </div>
      </section>

      {/* Status */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {college.status === "ACTIVE" ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2
                size={20}
                className="text-emerald-600"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <CircleX
                size={20}
                className="text-red-600"
              />
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {college.status === "ACTIVE"
                ? "College is active"
                : "College is inactive"}
            </p>

            <p className="text-xs text-gray-500">
              Last updated{" "}
              {formatDate(college.lastUpdated)}
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Created {formatDate(college.createdAt)}
        </div>
      </section>

      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          icon={GraduationCap}
          label="Courses"
          value={college._count.courses}
        />

        <OverviewCard
          icon={Users}
          label="Departments"
          value={college._count.departments}
        />

        <OverviewCard
          icon={Trophy}
          label="Rankings"
          value={college._count.rankings}
        />

        <OverviewCard
          icon={Star}
          label="Reviews"
          value={college._count.reviews}
        />
      </section>

      {/* Basic Information */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <SectionHeader
            title="Basic Information"
            description="College profile information"
          />

          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <InfoItem
              label="College Name"
              value={college.name}
            />

            <InfoItem
              label="Short Name"
              value={college.shortName}
            />

            <InfoItem
              label="Slug"
              value={college.slug}
            />

            <InfoItem
              label="College Type"
              value={college.collegeType}
            />

            <InfoItem
              label="Established"
              value={
                college.establishedYear
                  ? String(college.establishedYear)
                  : null
              }
            />

            <InfoItem
              label="Website"
              value={college.website}
            />

            <InfoItem
              label="Email"
              value={college.email}
            />

            <InfoItem
              label="Phone"
              value={college.phone}
            />

            <div className="sm:col-span-2">
              <InfoItem
                label="Address"
                value={college.address}
              />
            </div>

            <div className="sm:col-span-2">
              <InfoItem
                label="Description"
                value={college.description}
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <SectionHeader
            title="SEO"
            description="Search engine metadata"
          />

          <div className="space-y-5 p-5">
            <InfoItem
              label="SEO Title"
              value={college.seoTitle}
            />

            <InfoItem
              label="SEO Description"
              value={college.seoDescription}
            />
          </div>
        </div>
      </section>

      {/* Courses */}
      <ManagementSection
        title="Courses"
        description="Courses offered by this college"
        icon={GraduationCap}
        count={college._count.courses}
        href={`/admin/colleges/${college.id}/courses`}
      >
        {college.courses.length === 0 ? (
          <EmptySection text="No courses have been added yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Course
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Level
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Fees
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Seats
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {college.courses.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {item.course.name}
                      </p>
                      {item.course.shortName && (
                        <p className="text-xs text-gray-400">
                          {item.course.shortName}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600">
                      {item.course.level}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600">
                      {formatAmount(item.fees)}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600">
                      {item.seats ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ManagementSection>

      {/* Departments */}
      <ManagementSection
        title="Departments"
        description="Academic departments and faculty"
        icon={Building2}
        count={college._count.departments}
        href={`/admin/colleges/${college.id}/departments`}
      >
        {college.departments.length === 0 ? (
          <EmptySection text="No departments have been added yet." />
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2">
            {college.departments.map((department) => (
              <div
                key={department.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <p className="font-semibold text-gray-900">
                  {department.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  HOD: {department.hodName || "Not added"}
                </p>

                <p className="mt-2 text-xs font-medium text-[#15945c]">
                  {department._count.faculty} faculty
                </p>
              </div>
            ))}
          </div>
        )}
      </ManagementSection>

      {/* Rankings */}
      <ManagementSection
        title="Rankings"
        description="Published and draft college rankings"
        icon={Trophy}
        count={college._count.rankings}
        href={`/admin/colleges/${college.id}/rankings`}
      >
        {college.rankings.length === 0 ? (
          <EmptySection text="No rankings have been added yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Year
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Ranking Body
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Rank
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {college.rankings.map((ranking) => (
                  <tr key={ranking.id}>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {ranking.year}
                    </td>

                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {ranking.rankingBody}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600">
                      {ranking.category}
                    </td>

                    <td className="px-5 py-3 text-sm font-bold text-[#15945c]">
                      #{ranking.rank}
                    </td>

                    <td className="px-5 py-3">
                      <StatusBadge
                        status={ranking.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ManagementSection>

      {/* Placements */}
      <ManagementSection
        title="Placements"
        description="Placement performance data"
        icon={Trophy}
        count={college._count.placements}
        href={`/admin/colleges/${college.id}/placements`}
      >
        {college.placements.length === 0 ? (
          <EmptySection text="No placement data has been added yet." />
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {college.placements.map((placement) => (
              <div
                key={placement.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">
                    {placement.year}
                  </p>

                  <span className="rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                    {placement.placementType}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {placement.course || "All Courses"}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-gray-400">
                      Average
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatAmount(
                        placement.averagePackage
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-400">
                      Highest
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatAmount(
                        placement.highestPackage
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ManagementSection>

      {/* Cutoffs */}
      <ManagementSection
        title="Cutoffs"
        description="Admission cutoff information"
        icon={FileText}
        count={college._count.cutoffs}
        href={`/admin/colleges/${college.id}/cutoffs`}
      >
        {college.cutoffs.length === 0 ? (
          <EmptySection text="No cutoff data has been added yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Exam
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Year
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Course
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Rank Range
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {college.cutoffs.map((cutoff) => (
                  <tr key={cutoff.id}>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {cutoff.exam.shortName ||
                        cutoff.exam.name}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600">
                      {cutoff.year}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600">
                      {cutoff.category}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600">
                      {cutoff.course || "—"}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600">
                      {cutoff.openingRank ?? "—"} –{" "}
                      {cutoff.closingRank ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ManagementSection>
      <CollegeCourses collegeId={college.id} />

      {/* Reviews + Questions */}
      <section   id="reviews"
 className="grid gap-6 lg:grid-cols-2">
      <ManagementSection
  title="Reviews"
  description="Latest college reviews"
  icon={Star}
  count={college._count.reviews}
  href="#reviews"
>
          {college.reviews.length === 0 ? (
            <EmptySection text="No reviews yet." />
          ) : (
            <div className="divide-y divide-gray-100">
           {college.reviews.map((review) => (
  <div
    key={review.id}
    className="p-5"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              className={
                index < review.rating
                  ? "fill-current text-amber-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        <p className="mt-2 text-sm font-semibold text-gray-900">
          {review.title || "College Review"}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {review.content}
        </p>
      </div>

      <span
        className={
          review.isPublished
            ? "shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
            : "shrink-0 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"
        }
      >
        {review.isPublished ? "Published" : "Pending"}
      </span>
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
      <span>
        {review.user?.name || "Anonymous"}
      </span>

      {review.user?.email && (
        <span>{review.user.email}</span>
      )}

      <span>
        {formatDate(review.createdAt)}
      </span>

      {review.isVerifiedStudent && (
        <span className="font-semibold text-[#15945c]">
          Verified Student
        </span>
      )}
    </div>

    <ReviewModerationActions
      collegeId={college.id}
      reviewId={review.id}
      isPublished={review.isPublished}
    />
  </div>
))}
            </div>
          )}
        </ManagementSection>

        <ManagementSection
          title="Questions"
          description="Latest student questions"
          icon={MessageSquare}
          count={college._count.questions}
          href={`/admin/colleges/${college.id}/questions`}
        >
          {college.questions.length === 0 ? (
            <EmptySection text="No questions yet." />
          ) : (
            <div className="divide-y divide-gray-100">
              {college.questions.map((question) => (
                <div
                  key={question.id}
                  className="p-5"
                >
                  <p className="line-clamp-2 text-sm font-medium text-gray-900">
                    {question.question}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">
                      {question.askerName ||
                        "Anonymous"}
                    </span>

                    <span className="text-xs font-medium text-gray-500">
                      {question._count.answers}{" "}
                      answers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ManagementSection>
      </section>
    </div>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15945c]/10 text-[#15945c]">
        <Icon size={20} />
      </div>

      <p className="mt-4 text-2xl font-bold text-gray-900">
        {value.toLocaleString("en-IN")}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {label}
      </p>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-gray-100 px-5 py-4">
      <h2 className="font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-gray-700">
        {value || "Not added"}
      </p>
    </div>
  );
}
function ManagementSection({
  title,
  description,
  icon: Icon,
  count,
  href,
  id,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Building2;
  count: number;
  href: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#15945c]/10 text-[#15945c]">
            <Icon size={18} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              {description}
            </p>
          </div>
        </div>

        <Link
          href={href}
          className="text-xs font-semibold text-[#15945c] hover:underline"
        >
          Manage ({count})
        </Link>
      </div>

      {children}
    </section>
  );
}

function EmptySection({
  text,
}: {
  text: string;
}) {
  return (
    <div className="px-5 py-10 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const published = status === "PUBLISHED";

  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
        published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}