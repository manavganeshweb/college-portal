import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  Newspaper,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const categories = [
  "All",
  "Admission",
  "Exams",
  "Colleges",
  "Courses",
  "Results",
  "Scholarships",
  "Study Abroad",
];

const featuredArticle = {
  category: "Admissions",
  title: "Complete Guide to College Admissions 2026",
  description:
    "Explore admission timelines, eligibility requirements, entrance exams, application processes and important dates for students planning their higher education journey.",
  date: "September 28, 2026",
  readTime: "8 min read",
  image:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80",
  href: "/articles/complete-guide-college-admissions-2026",
};

const latestArticles = [
  {
    category: "Courses",
    title: "B.Tech Computer Science: Courses, Eligibility, Fees & Career Options",
    description:
      "Everything students need to know about pursuing Computer Science Engineering after Class 12.",
    date: "September 27, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    href: "/articles/btech-computer-science-guide",
  },
  {
    category: "Exams",
    title: "Engineering Entrance Exams Students Should Know About",
    description:
      "Understand major engineering entrance examinations, eligibility criteria and admission routes.",
    date: "September 26, 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
    href: "/articles/engineering-entrance-exams",
  },
  {
    category: "Scholarships",
    title: "Scholarships for College Students: A Complete Guide",
    description:
      "Discover scholarship opportunities, eligibility requirements and how to apply successfully.",
    date: "September 25, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=900&q=80",
    href: "/articles/college-scholarships-guide",
  },
  {
    category: "Colleges",
    title: "How to Choose the Right College for Your Career",
    description:
      "Important factors to compare before selecting a college or university.",
    date: "September 24, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80",
    href: "/articles/how-to-choose-right-college",
  },
  {
    category: "Study Abroad",
    title: "Study Abroad: What Students Should Plan Before Applying",
    description:
      "A practical overview of universities, applications, finances, exams and student visas.",
    date: "September 23, 2026",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    href: "/articles/study-abroad-guide",
  },
  {
    category: "Results",
    title: "What to Do After Entrance Exam Results Are Declared",
    description:
      "Understand counselling, college selection, documentation and admission steps after results.",
    date: "September 22, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
    href: "/articles/after-entrance-exam-results",
  },
];

const trendingTopics = [
  "College Admissions 2026",
  "B.Tech Computer Science",
  "Engineering Entrance Exams",
  "Scholarships",
  "Study Abroad",
  "MBA Admissions",
];

export const metadata = {
  title: "News & Articles | College Aadhar",
  description:
    "Latest education news, college updates, admission guides, exam information, scholarships, courses and career articles.",
};

export default function NewsAndArticlesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-green-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-2 text-sm text-slate-500"
          >
            <Link
              href="/"
              className="transition hover:text-[#15945c]"
            >
              Home
            </Link>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="font-medium text-slate-700">
              News & Articles
            </span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-[#15945c] shadow-sm">
                <Newspaper className="h-4 w-4" />
                College Aadhar Newsroom
              </div>

              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                News, Insights &
                <span className="block text-[#15945c]">
                  Education Articles
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Stay updated with college admissions, entrance exams,
                courses, scholarships, results and the latest developments
                in higher education.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <Newspaper className="h-5 w-5 text-[#15945c]" />
                  <span className="text-sm font-semibold text-slate-700">
                    Latest Education News
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <GraduationCap className="h-5 w-5 text-[#15945c]" />
                  <span className="text-sm font-semibold text-slate-700">
                    Student Guides
                  </span>
                </div>
              </div>
            </div>

            {/* Search card */}
            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-xl shadow-green-900/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <Search className="h-5 w-5 text-[#15945c]" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Find an Article
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Search for admission guides, exams, colleges, courses and
                other education topics.
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />

                <input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center gap-2 py-3">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  index === 0
                    ? "bg-[#15945c] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-[#15945c]",
                ].join(" ")}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#15945c]">
                Featured
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Featured Article
              </h2>
            </div>

            <Sparkles className="hidden h-6 w-6 text-[#15945c] sm:block" />
          </div>

          <Link
            href={featuredArticle.href}
            className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[1.15fr_1fr]"
          >
            <div className="relative min-h-[260px] overflow-hidden sm:min-h-[360px]">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#15945c]">
                  {featuredArticle.category}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {featuredArticle.date}
                </span>

                <span className="text-slate-300">•</span>

                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {featuredArticle.readTime}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#15945c] sm:text-3xl">
                {featuredArticle.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {featuredArticle.description}
              </p>

              <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#15945c]">
                Read Full Article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
          {/* Articles */}
          <div>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#15945c]">
                  Latest
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Latest Articles
                </h2>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#15945c]">
                Updated Regularly
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {latestArticles.map((article) => (
                <Link
                  key={article.href}
                  href={article.href}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#15945c] shadow-sm">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {article.date}
                      </span>

                      <span>•</span>

                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-7 text-slate-900 transition-colors group-hover:text-[#15945c]">
                      {article.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {article.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-semibold text-slate-600">
                        Read Article
                      </span>

                      <ArrowRight className="h-4 w-4 text-[#15945c] transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Trending */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                  <TrendingUp className="h-4 w-4 text-[#15945c]" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#15945c]">
                    Trending
                  </p>

                  <h3 className="font-bold text-slate-900">
                    Popular Topics
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {trendingTopics.map((topic, index) => (
                  <Link
                    key={topic}
                    href={`/news?topic=${encodeURIComponent(topic)}`}
                    className="group flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-green-50"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 group-hover:bg-green-100 group-hover:text-[#15945c]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1 text-sm font-medium text-slate-700 group-hover:text-[#15945c]">
                      {topic}
                    </span>

                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#15945c]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Save / Personalize */}
            <div className="overflow-hidden rounded-2xl bg-[#15945c] p-6 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Bookmark className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Save Articles for Later
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-50">
                Create your College Aadhar account to save useful articles,
                courses and colleges.
              </p>

              <Link
                href="/register"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#15945c] transition hover:bg-green-50"
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="border-t border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
            <Newspaper className="h-6 w-6 text-[#15945c]" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
            Stay Updated With Education News
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Follow the latest college updates, admission information,
            entrance exams, scholarships and career opportunities.
          </p>

          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#15945c] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#117d4e]"
          >
            Start Your Journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}