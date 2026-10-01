import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /*
   * ---------------------------------------------------------
   * Static public pages
   * ---------------------------------------------------------
   */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/colleges`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/exams`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/college-predictor`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/study-abroad`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  /*
   * ---------------------------------------------------------
   * Colleges
   * ---------------------------------------------------------
   *
   * Your College model does not have isActive.
   * Therefore we use the colleges directly.
   */
  const colleges = await prisma.college.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const collegePages: MetadataRoute.Sitemap = colleges.map((college) => ({
    url: `${BASE_URL}/colleges/${college.slug}`,
    lastModified: college.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  /*
   * ---------------------------------------------------------
   * Course categories
   * ---------------------------------------------------------
   */
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  });

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/courses/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  /*
   * ---------------------------------------------------------
   * Courses
   * ---------------------------------------------------------
   *
   * Course has categoryId, but the generated Prisma type
   * does not expose a category relation.
   *
   * Therefore fetch categories separately and build a map.
   */
  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      slug: true,
      categoryId: true,
      updatedAt: true,
    },
  });

  const categoryMap = new Map(
    categories.map((category) => [category.slug, category.slug]),
  );

  /*
   * Fetch category IDs separately so we can resolve
   * Course.categoryId -> Category.slug.
   */
  const categoryRecords = await prisma.category.findMany({
    select: {
      id: true,
      slug: true,
    },
  });

  const categorySlugById = new Map(
    categoryRecords.map((category) => [category.id, category.slug]),
  );
const coursePages: MetadataRoute.Sitemap = [];

for (const course of courses) {
  const categorySlug = categorySlugById.get(course.categoryId);

  if (!categorySlug) {
    continue;
  }

  coursePages.push({
    url: `${BASE_URL}/courses/${categorySlug}/${course.slug}`,
    lastModified: course.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  });
}
  /*
   * ---------------------------------------------------------
   * Course level directory pages
   * ---------------------------------------------------------
   */
  const courseLevelPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/courses/levels/after-10th`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/courses/levels/after-12th`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  /*
   * ---------------------------------------------------------
   * Exams
   * ---------------------------------------------------------
   */
  const exams = await prisma.exam.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const examPages: MetadataRoute.Sitemap = exams.map((exam) => ({
    url: `${BASE_URL}/exams/${exam.slug}`,
    lastModified: exam.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  /*
   * ---------------------------------------------------------
   * News
   * ---------------------------------------------------------
   */
  const newsArticles = await prisma.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const newsPages: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  /*
   * ---------------------------------------------------------
   * Final sitemap
   * ---------------------------------------------------------
   */
  return [
    ...staticPages,
    ...collegePages,
    ...categoryPages,
    ...coursePages,
    ...courseLevelPages,
    ...examPages,
    ...newsPages,
  ];
}