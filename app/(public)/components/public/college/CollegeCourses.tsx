
"use client";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  IndianRupee,
  Users,
} from "lucide-react";

type CollegeCourse = {
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
    description: string | null;
    durationYears: number | null;
    eligibility: string | null;
    averageFees: number | null;
    careerOptions: string | null;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
};

type CollegeCoursesProps = {
  courses: CollegeCourse[];
  selectedCourse?: CollegeCourse;
  onCourseSelect: (
    courseSlug: string,
    courseType?: string,
  ) => void;
  onCourseBack: () => void;
  courseType: string;
};

function formatMoney(value: number | null) {
  if (value === null) {
    return "Not available";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatLevel(level: string) {
  return level
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function CourseCard({
  item,
  onSelect,
}: {
  item: CollegeCourse;
  onSelect: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#15945c]/40 hover:shadow-md">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#15945c]">
              {formatLevel(item.course.level)}
            </span>

            {item.course.degree && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {item.course.degree}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900">
            {item.course.name}
          </h3>

          {item.course.shortName && (
            <p className="mt-1 text-sm font-medium text-slate-500">
              {item.course.shortName}
            </p>
          )}

          {item.course.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
              {item.course.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onSelect}
          className="shrink-0 rounded-xl bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117d4e]"
        >
          View Details
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">Fees</p>
          <p className="mt-1 font-semibold text-slate-900">
            {formatMoney(item.fees)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Seats</p>
          <p className="mt-1 font-semibold text-slate-900">
            {item.seats ?? "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Duration</p>
          <p className="mt-1 font-semibold text-slate-900">
            {item.duration !== null
              ? `${item.duration} years`
              : item.course.durationYears !== null
                ? `${item.course.durationYears} years`
                : "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Category</p>
          <p className="mt-1 truncate font-semibold text-slate-900">
            {item.course.category.name}
          </p>
        </div>
      </div>
    </article>
  );
}

function CourseDetails({
  item,
  courseType,
  onBack,
}: {
  item: CollegeCourse;
  courseType: string;
  onBack: () => void;
}) {
  const course = item.course;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5 sm:p-7">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#15945c] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </button>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#15945c]">
            {formatLevel(course.level)}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {courseType}
          </span>

          {course.degree && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {course.degree}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {course.name}
        </h2>

        {course.shortName && (
          <p className="mt-1 text-sm font-medium text-slate-500">
            {course.shortName}
          </p>
        )}
      </div>

      <div className="grid gap-px bg-slate-200 sm:grid-cols-3">
        <InfoBox
          icon={<IndianRupee size={18} />}
          label="College Fees"
          value={formatMoney(item.fees)}
        />

        <InfoBox
          icon={<Clock3 size={18} />}
          label="Duration"
          value={
            item.duration !== null
              ? `${item.duration} years`
              : course.durationYears !== null
                ? `${course.durationYears} years`
                : "Not available"
          }
        />

        <InfoBox
          icon={<Users size={18} />}
          label="Seats"
          value={
            item.seats !== null
              ? String(item.seats)
              : "Not available"
          }
        />
      </div>

      <div className="space-y-8 p-5 sm:p-7">
        {course.description && (
          <DetailSection title="Course Overview">
            <p>{course.description}</p>
          </DetailSection>
        )}

        {course.eligibility && (
          <DetailSection
            title="Eligibility"
            icon={<CheckCircle2 size={19} />}
          >
            <p>{course.eligibility}</p>
          </DetailSection>
        )}

        {course.careerOptions && (
          <DetailSection
            title="Career Options"
            icon={<GraduationCap size={19} />}
          >
            <p>{course.careerOptions}</p>
          </DetailSection>
        )}

        <DetailSection
          title="Course Information"
          icon={<BookOpen size={19} />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              label="Course"
              value={course.name}
            />

            <DetailItem
              label="Level"
              value={formatLevel(course.level)}
            />

            <DetailItem
              label="Category"
              value={course.category.name}
            />

            <DetailItem
              label="Course Type"
              value={courseType}
            />

            <DetailItem
              label="Average Course Fee"
              value={formatMoney(course.averageFees)}
            />

            <DetailItem
              label="College-specific Fee"
              value={formatMoney(item.fees)}
            />
          </div>
        </DetailSection>
      </div>
    </article>
  );
}

function DetailSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-[#15945c]">
            {icon}
          </span>
        )}

        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>
      </div>

      <div className="mt-3 text-sm leading-7 text-slate-600">
        {children}
      </div>
    </section>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-2 text-[#15945c]">
        {icon}

        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function CollegeCourses({
  courses,
  selectedCourse,
  onCourseSelect,
  onCourseBack,
  courseType,
}: CollegeCoursesProps) {
  if (selectedCourse) {
    return (
      <CourseDetails
        item={selectedCourse}
        courseType={courseType}
        onBack={onCourseBack}
      />
    );
  }

  return (
    <section
      id="courses-fees"
      className="space-y-5"
    >
      {courses.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <GraduationCap
            size={38}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Course information is not available
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Course details for this college have not been added yet.
          </p>
        </div>
      ) : (
        courses.map((item) => (
          <CourseCard
            key={item.id}
            item={item}
            onSelect={() =>
              onCourseSelect(
                item.course.slug,
                "Part-Time",
              )
            }
          />
        ))
      )}
    </section>
  );
}
