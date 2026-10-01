import { prisma } from "@/lib/prisma";

export async function getFeaturedNews() {
  return prisma.newsArticle.findFirst({
    where: {
      status: "PUBLISHED",
      isFeatured: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getLatestNews(limit = 9) {
  return prisma.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getTrendingNews(limit = 5) {
  return prisma.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      {
        views: "desc",
      },
      {
        publishedAt: "desc",
      },
    ],
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}