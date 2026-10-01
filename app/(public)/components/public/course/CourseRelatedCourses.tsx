import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
} from "lucide-react";

type RelatedCourse = {
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

type CourseRelatedCoursesProps = {
  currentCourseId: string;
  courses: RelatedCourse[];
};

function formatLevel(level: string) {
  switch (level) {
    case "UG":
      return "Undergraduate";
    case "PG":
      return "Postgraduate";
    case "DIPLOMA":
      return "Diploma";
    case "PHD":
      return "Doctoral";
    case "CERTIFICATE":
      return "Certificate";
    default:
      return level;
  }
}

function formatDuration(durationYears: number | null) {
  if (durationYears === null) {
    return "Duration not specified";
  }

  return durationYears === 1
    ? "1 Year"
    : `${durationYears} Years`;
}

function formatFees(averageFees: number | null) {
  if (averageFees === null) {
    return "Fees not specified";
  }

  return `₹${averageFees.toLocaleString("en-IN")}`;
}

export default function CourseRelatedCourses({
  currentCourseId,
  courses,
}: CourseRelatedCoursesProps) {
  const relatedCourses = courses.filter(
    (course) => course.id !== currentCourseId
  );

  if (relatedCourses.length === 0) {
    return null;
  }

  return (
    <section
      id="related-courses"
      aria-labelledby="related-courses-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <BookOpen size={17} />
            <span>Related Courses</span>
          </div>

          <h2
            id="related-courses-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Related Courses
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Other courses available in the College Aadhar course database.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {relatedCourses.map((course) => (
            <article
              key={course.id}
              className="group rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/20 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <GraduationCap size={20} />
                </div>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  {course.category.name}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                <Link
                  href={`/btech/${course.slug}`}
                  className="transition-colors hover:text-emerald-600"
                >
                  {course.name}
                </Link>
              </h3>

              {course.shortName && (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {course.shortName}
                </p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <GraduationCap size={13} />
                    Level
                  </div>

                  <p className="mt-1 text-xs font-semibold text-slate-800">
                    {formatLevel(course.level)}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock3 size={13} />
                    Duration
                  </div>

                  <p className="mt-1 text-xs font-semibold text-slate-800">
                    {formatDuration(course.durationYears)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-semibold text-slate-700">
                  {formatFees(course.averageFees)}
                </span>

                <Link
                  href={`/btech/${course.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  View Course
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}