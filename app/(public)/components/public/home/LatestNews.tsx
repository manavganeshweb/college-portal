import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";

import { getLatestNews } from "@/services/home.service";

const tabs = [
  {
    label: "Exam Alerts",
    type: "EXAM_ALERT" as const,
  },
  {
    label: "College Alerts",
    type: "COLLEGE_ALERT" as const,
  },
  {
    label: "Admission Alerts",
    type: "ADMISSION_ALERT" as const,
  },
  {
    label: "Education News",
    type: "EDUCATION_NEWS" as const,
  },
  {
    label: "Results",
    type: "RESULT" as const,
  },
  {
    label: "Career",
    type: "CAREER" as const,
  },
];

function formatDate(date: Date | null) {
  if (!date) return "Recently updated";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function LatestNews() {
  const sections = await Promise.all(
    tabs.map(async (tab) => ({
      ...tab,
      articles: await getLatestNews(tab.type, 3),
    })),
  );

  const hasNews = sections.some((section) => section.articles.length > 0);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Stay Updated
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Latest News & Stories
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Get the latest updates on exams, colleges, admissions and
              education.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            View all news
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {!hasNews ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <Newspaper className="mx-auto h-9 w-9 text-slate-400" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              News and stories are not published yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Latest education updates will appear here once they are
              published from the backend.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {sections.map((section) => (
              <div key={section.type}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    {section.label}
                  </h3>

                  <Link
                    href={`/news?type=${section.type}`}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View all
                  </Link>
                </div>

                {section.articles.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm text-slate-500">
                      No {section.label.toLowerCase()} published yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.articles.map((article) => (
                      <article
                        key={article.id}
                        className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
                      >
                        {article.coverImage ? (
                          <div className="mb-4 aspect-[16/8] overflow-hidden rounded-xl bg-slate-100">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            />
                          </div>
                        ) : null}

                        <h4 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900">
                          <Link
                            href={`/news/${article.slug}`}
                            className="transition hover:text-emerald-700"
                          >
                            {article.title}
                          </Link>
                        </h4>

                        {article.excerpt ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
                            {article.excerpt}
                          </p>
                        ) : null}

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(article.publishedAt)}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}