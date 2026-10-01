
import Link from "next/link";
import type { CollegeDetail } from "@/services/college.service";
import ShortlistCollegeButton from "@/app/(public)/components/public/college/ShortlistCollegeButton";
import ApplyCollegeButton from "./ApplyCollegeButton";

type CategoryCourse = {
  name: string;
  slug: string;
};

type CategoryDisplay = {
  slug: string;
  name: string;
  courses: CategoryCourse[];
};

const categoryDirectory: CategoryDisplay[] = [
  {
    slug: "engineering",
    name: "Engineering",
    courses: [
      { name: "BE/B.Tech", slug: "btech" },
      { name: "ME/M.Tech", slug: "mtech" },
      { name: "Polytechnic", slug: "polytechnic" },
    ],
  },
  {
    slug: "medical",
    name: "Medical",
    courses: [
      { name: "BAMS", slug: "bams" },
      { name: "B.Sc (Medicine)", slug: "bsc-medicine" },
      { name: "BHMS", slug: "bhms" },
      {
        name: "Bachelor of Physiotherapy (BPT)",
        slug: "bachelor-of-physiotherapy",
      },
    ],
  },
  {
    slug: "science",
    name: "Science",
    courses: [
      { name: "M.Sc", slug: "msc" },
      { name: "B.Sc", slug: "bsc" },
      { name: "B.F.Sc", slug: "bfsc" },
      { name: "M.F.Sc", slug: "mfsc" },
    ],
  },
  {
    slug: "commerce",
    name: "Commerce",
    courses: [
      { name: "M.Com", slug: "mcom" },
      { name: "B.Com", slug: "bcom" },
    ],
  },
  {
    slug: "management",
    name: "Management",
    courses: [
      { name: "BBA/BMS", slug: "bba" },
      { name: "MBA/PGDM", slug: "mba" },
      {
        name: "BHM (Hospital)",
        slug: "bachelor-of-hospital-management",
      },
      { name: "Executive MBA", slug: "executive-mba" },
    ],
  },
  {
    slug: "arts",
    name: "Arts",
    courses: [
      { name: "BA", slug: "ba" },
      { name: "BFA", slug: "bfa" },
      { name: "BSW", slug: "bsw" },
      { name: "MA", slug: "ma" },
    ],
  },
  {
    slug: "computer-applications",
    name: "Computer Applications",
    courses: [
      { name: "BCA", slug: "bca" },
      { name: "MCA", slug: "mca" },
    ],
  },
  {
    slug: "education",
    name: "Education",
    courses: [
      { name: "B.Ed", slug: "bed" },
      { name: "B.P.Ed", slug: "bped" },
      { name: "M.Ed", slug: "med" },
      { name: "M.P.Ed", slug: "mped" },
    ],
  },
  {
    slug: "law",
    name: "Law",
    courses: [
      { name: "LLB", slug: "llb" },
      { name: "LLM", slug: "llm" },
      { name: "BA/BBA LLB", slug: "ba-llb" },
    ],
  },
];

type CollegeSidebarProps = {
  college: CollegeDetail;
};

function SuggestedCategories() {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-5">
        <h2 className="text-xl font-bold text-gray-900">
          Suggested Categories
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Explore courses by category
        </p>
      </div>

      {/* Scrollable Categories */}
      <div className="h-[420px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        <div className="divide-y divide-gray-200">
          {categoryDirectory.map((category) => (
            <Link
              key={category.slug}
              href={`/courses/${category.slug}`}
              className="group block px-5 py-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-gray-900 transition group-hover:text-[#15945c]">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {category.courses.length} courses
                  </p>
                </div>

                <span className="shrink-0 text-sm font-medium text-[#15945c]">
                  View →
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {category.courses.slice(0, 4).map((course) => (
                  <span
                    key={course.slug}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                  >
                    {course.name}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function CollegeSidebar({
  college,
}: CollegeSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
      <ShortlistCollegeButton collegeId={college.id} />
      <div className="rounded-2xl mt-6 flex flex-wrap gap-3 bg-white p-5" >

      <ApplyCollegeButton collegeId={college.id} />

      <button
        type="button"
        className="w-full  rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Download Brochure
      </button>

      {/* <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          College Information
        </h2>

        Keep your existing college information content here-----
      </section> */}
      </div>

      <SuggestedCategories />
    </aside>
  );
}
