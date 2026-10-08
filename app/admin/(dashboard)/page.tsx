import {
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  Newspaper,
  Upload,
} from "lucide-react";

import AdminStatCard from "../components/AdminStatCard";
import AdminQuickAction from "../components/AdminQuickAction";
import RecentActivity from "../components/RecentActivity";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getAdminDashboardData() {
  const [
    colleges,
    courses,
    exams,
    news,
    publishedNews,
    rankings,
    placements,
  ] = await Promise.all([
    prisma.college.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.course.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.exam.count(),

    prisma.newsArticle.count(),

    prisma.newsArticle.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.collegeRanking.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.collegePlacement.count({
      where: {
        status: "PUBLISHED",
      },
    }),
  ]);

  return {
    colleges,
    courses,
    exams,
    news,
    publishedNews,
    rankings,
    placements,
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-[#15945c]">
          Admin Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Welcome back, Administrator
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Manage College Aadhar education data, content and
          platform information from one secure dashboard.
        </p>
      </section>

      {/* Statistics */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            title="Active Colleges"
            value={data.colleges}
            description="Currently visible on the platform"
            icon={Building2}
          />

          <AdminStatCard
            title="Active Courses"
            value={data.courses}
            description="Courses available for discovery"
            icon={BookOpen}
          />

          <AdminStatCard
            title="Exams"
            value={data.exams}
            description="Education exams in the database"
            icon={GraduationCap}
          />

          <AdminStatCard
            title="Published News"
            value={data.publishedNews}
            description="Currently published news"
            icon={Newspaper}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Data Management
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access the areas you manage most often.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminQuickAction
            title="Manage Colleges"
            description="Create, update, verify and manage college information."
            href="/admin/colleges"
            icon={Building2}
          />

          <AdminQuickAction
            title="Manage Courses"
            description="Maintain courses, fees, eligibility and categories."
            href="/admin/courses"
            icon={BookOpen}
          />

          <AdminQuickAction
            title="Manage Content"
            description="Maintain news and other education content."
            href="/admin/news"
            icon={Newspaper}
          />

          <AdminQuickAction
            title="Import Data"
            description="Upload CSV education datasets."
            href="/admin/imports"
            icon={Upload}
          />
        </div>
      </section>

      {/* Platform overview */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <RecentActivity activities={[]} />

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Platform Overview
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Current education database
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <FileText
                  size={18}
                  className="text-gray-400"
                />

                <span className="text-sm text-gray-600">
                  Total news
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                {data.news.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Newspaper
                  size={18}
                  className="text-gray-400"
                />

                <span className="text-sm text-gray-600">
                  Published news
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                {data.publishedNews.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <GraduationCap
                  size={18}
                  className="text-gray-400"
                />

                <span className="text-sm text-gray-600">
                  Published rankings
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                {data.rankings.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <BookOpen
                  size={18}
                  className="text-gray-400"
                />

                <span className="text-sm text-gray-600">
                  Published placements
                </span>
              </div>

              <span className="font-semibold text-gray-900">
                {data.placements.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}