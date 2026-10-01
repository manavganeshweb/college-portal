import { prisma } from "@/lib/prisma";

export type PublicRankingFilters = {
  search?: string;
  year?: number;
  rankingBody?: string;
  category?: string;
};

export async function getPublicRankings(
  filters: PublicRankingFilters = {},
) {
  const search = filters.search?.trim();

  return prisma.collegeRanking.findMany({
    where: {
      status: "PUBLISHED",

      ...(filters.year
        ? {
            year: filters.year,
          }
        : {}),

      ...(filters.rankingBody
        ? {
            rankingBody: filters.rankingBody,
          }
        : {}),

      ...(filters.category
        ? {
            category: filters.category,
          }
        : {}),

      ...(search
        ? {
            college: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  shortName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          }
        : {}),
    },

    orderBy: [
      {
        year: "desc",
      },
      {
        rank: "asc",
      },
    ],

    select: {
      id: true,
      year: true,
      rank: true,
      category: true,
      rankingBody: true,
      score: true,
      totalColleges: true,
      sourceUrl: true,
      publishedAt: true,

      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          logo: true,
          verified: true,

          city: {
            select: {
              name: true,

              state: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getPublicRankingFilters() {
  const [years, rankingBodies, categories] = await Promise.all([
    prisma.collegeRanking.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        year: true,
      },
      distinct: ["year"],
      orderBy: {
        year: "desc",
      },
    }),

    prisma.collegeRanking.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        rankingBody: true,
      },
      distinct: ["rankingBody"],
      orderBy: {
        rankingBody: "asc",
      },
    }),

    prisma.collegeRanking.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        category: true,
      },
      distinct: ["category"],
      orderBy: {
        category: "asc",
      },
    }),
  ]);

  return {
    years: years.map((item) => item.year),
    rankingBodies: rankingBodies.map((item) => item.rankingBody),
    categories: categories.map((item) => item.category),
  };
}