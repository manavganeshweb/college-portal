import Image from "next/image";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

type CollegeHeaderProps = {
  college: {
    name: string;
    shortName: string | null;
    logo: string | null;
    collegeType: string;
    establishedYear: number | null;
    website: string | null;
    phone: string | null;
    verified: boolean;
    address: string | null;
    city: {
      name: string;
    };
    state: {
      name: string;
    };
    reviews: {
      rating: number;
    }[];
  };
};

function getAverageRating(reviews: { rating: number }[]) {
  if (!reviews.length) {
    return null;
  }

  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  );

  return total / reviews.length;
}

function formatCollegeType(type: string) {
  return type
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function CollegeHeader({
  college,
}: CollegeHeaderProps) {
  const averageRating = getAverageRating(college.reviews);
  const reviewCount = college.reviews.length;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-6">
        <div className="flex flex-col gap-5">

          {/* Breadcrumb-like top metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Colleges</span>
            <span>/</span>
            <span>{college.state.name}</span>
            <span>/</span>
            <span>{college.city.name}</span>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            {/* Logo */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {college.logo ? (
                <Image
                  src={college.logo}
                  alt={`${college.name} logo`}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <GraduationCap className="h-10 w-10 text-[#15945c]" />
              )}
            </div>

            {/* Main information */}
            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  {college.name}
                </h1>

                {college.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-[#15945c]">
                    <BadgeCheck className="h-4 w-4" />
                    Verified
                  </span>
                )}
              </div>

              {college.shortName && (
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {college.shortName}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">

                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#15945c]" />
                  {college.city.name}, {college.state.name}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#15945c]" />
                  {formatCollegeType(college.collegeType)}
                </span>

                {college.establishedYear && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-[#15945c]" />
                    Estd. {college.establishedYear}
                  </span>
                )}
              </div>

              {/* Rating */}
              {averageRating !== null && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-1 rounded-md bg-[#15945c] px-2.5 py-1.5 text-sm font-bold text-white">
                    <Star className="h-4 w-4 fill-current" />
                    {averageRating.toFixed(1)}
                  </div>

                  <span className="text-sm text-slate-600">
                    Based on {reviewCount}{" "}
                    {reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-wrap items-start gap-2 md:flex-col">
              {college.website && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#15945c] hover:text-[#15945c]"
                >
                  Official Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {college.phone && (
                <a
                  href={`tel:${college.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#15945c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117a4b]"
                >
                  <Phone className="h-4 w-4" />
                  Contact College
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}