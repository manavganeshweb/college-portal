import { prisma } from "@/lib/prisma";
import { NewsType } from "@/src/generated/prisma/client";
export async function getHomepageStats() {
  const [colleges, courses, exams, categories] = await Promise.all([
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

    prisma.category.count(),
  ]);

  return {
    colleges,
    courses,
    exams,
    categories,
  };
}

/**
 * Top colleges for the homepage.
 *
 * Ranking is based on:
 * 1. Verified colleges
 * 2. Published reviews / rating
 * 3. Latest college update
 *
 * This does NOT use hardcoded college names.
 */
export async function getTopTenColleges() {
  const colleges = await prisma.college.findMany({
    where: {
      status: "ACTIVE",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      logo: true,
      coverImage: true,
      collegeType: true,
      verified: true,
      establishedYear: true,

      state: {
        select: {
          name: true,
        },
      },

      city: {
        select: {
          name: true,
        },
      },

      courses: {
        take: 3,

        select: {
          fees: true,

          course: {
            select: {
              name: true,
              shortName: true,

              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },

        orderBy: {
          course: {
            name: "asc",
          },
        },
      },

      reviews: {
        where: {
          isPublished: true,
        },

        select: {
          rating: true,
        },
      },
    },

    orderBy: [
      {
        verified: "desc",
      },
      {
        lastUpdated: "desc",
      },
      {
        name: "asc",
      },
    ],

    take: 10,
  });

  return colleges.map((college, index) => {
    const ratings = college.reviews.map((review) => review.rating);

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) /
          ratings.length
        : null;

    const fees = college.courses
      .map((item) => item.fees)
      .filter(
        (fee): fee is NonNullable<typeof fee> => fee !== null,
      )
      .map(Number);

    return {
      rank: index + 1,

      id: college.id,
      name: college.name,
      slug: college.slug,
      shortName: college.shortName,

      logo: college.logo,
      coverImage: college.coverImage,

      collegeType: college.collegeType,
      verified: college.verified,
      establishedYear: college.establishedYear,

      state: college.state,
      city: college.city,

      courses: college.courses.map((item) => ({
        fees: item.fees === null ? null : Number(item.fees),

        course: {
          name: item.course.name,
          shortName: item.course.shortName,
          category: item.course.category,
        },
      })),

      averageRating,
      reviewCount: ratings.length,

      minimumFee: fees.length > 0 ? Math.min(...fees) : null,
      maximumFee: fees.length > 0 ? Math.max(...fees) : null,
    };
  });
}

/**
 * Top study places are calculated from the existing
 * State / City / College relationship.
 *
 * No hardcoded city list.
 */
export async function getTopStudyPlaces(limit = 10) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);

  const cities = await prisma.city.findMany({
    select: {
      id: true,
      name: true,
      slug: true,

      state: {
        select: {
          name: true,
          slug: true,
        },
      },

      _count: {
        select: {
          colleges: true,
        },
      },
    },

    where: {
      colleges: {
        some: {
          status: "ACTIVE",
        },
      },
    },

    orderBy: {
      colleges: {
        _count: "desc",
      },
    },

    take: safeLimit,
  });

  return cities.map((city) => ({
    id: city.id,
    name: city.name,
    slug: city.slug,

    state: city.state,

    collegeCount: city._count.colleges,
  }));
}

/**
 * Homepage courses.
 *
 * Uses the actual Course table.
 */
export async function getHomepageCourses(limit = 6) {
  const safeLimit = Math.min(Math.max(limit, 1), 12);

  return prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      degree: true,
      level: true,

      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },

    take: safeLimit,
  });
}

/**
 * Published 2026 college rankings.
 *
 * Empty result is valid when the database does not
 * contain published ranking data yet.
 */
export async function getCollegeRankings(
  year = 2026,
  category?: string,
  rankingBody?: string,
  limit = 10,
) {
  const safeLimit = Math.min(Math.max(limit, 1), 50);

  const rankings = await prisma.collegeRanking.findMany({
  where: {
    year,

    status: "PUBLISHED",

    ...(category
      ? {
          category,
        }
      : {}),

    ...(rankingBody
      ? {
          rankingBody,
        }
      : {}),
  },

  select: {
    id: true,
    rank: true,
    year: true,
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
          },
        },

        state: {
          select: {
            name: true,
          },
        },
      },
    },
  },

  orderBy: {
    rank: "asc",
  },

  take: safeLimit,
});

return rankings.map((ranking) => ({
  ...ranking,
  score: ranking.score === null ? null : Number(ranking.score),
}));
}

/**
 * Latest published news.
 */
export async function getLatestNews(
  type?: NewsType,
  limit = 6
) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);

  return prisma.newsArticle.findMany({
    where: {
      status: "PUBLISHED",
      ...(type ? { type } : {}),
    },

    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      type: true,
      sourceName: true,
      sourceUrl: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },

    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],

    take: safeLimit,
  });
}

/**
 * Published board exam information.
 */
export async function getHomepageBoardExams(limit = 6) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);

  return prisma.boardExam.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      board: true,
      className: true,
      examYear: true,
      examDate: true,
      resultDate: true,
      description: true,
      officialUrl: true,
    },

    orderBy: [
      {
        examYear: "desc",
      },
      {
        examDate: "asc",
      },
    ],

    take: safeLimit,
  });
}

/**
 * Published study-abroad destinations.
 */
export async function getStudyAbroadDestinations(limit = 6) {
  const safeLimit = Math.min(Math.max(limit, 1), 12);

  return prisma.studyAbroadDestination.findMany({
    where: {
      status: "PUBLISHED",
    },

    select: {
      id: true,
      country: true,
      slug: true,
      description: true,
      coverImage: true,
      currency: true,
      averageTuition: true,
      popularCourses: true,
    },

    orderBy: {
      country: "asc",
    },

    take: safeLimit,
  });
}