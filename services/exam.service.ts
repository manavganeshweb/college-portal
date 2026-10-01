import { prisma } from "@/lib/prisma";

type GetExamsParams = {
  search?: string;
  conductingBody?: string;
  page?: number;
  limit?: number;
};

export async function getExams({
  search,
  conductingBody,
  page = 1,
  limit = 12,
}: GetExamsParams = {}) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 50);
  const skip = (safePage - 1) * safeLimit;

  const where = {
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              shortName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(conductingBody
      ? {
          conductingBody: {
            contains: conductingBody,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const [exams, total] = await Promise.all([
    prisma.exam.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        description: true,
        conductingBody: true,
        examType: true,
        eligibility: true,
        applicationFee: true,
        website: true,
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: safeLimit,
    }),

    prisma.exam.count({
      where,
    }),
  ]);

  const data = exams.map((exam) => ({
    ...exam,
    applicationFee:
      exam.applicationFee !== null
        ? Number(exam.applicationFee)
        : null,
  }));

  return {
    exams: data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: safePage * safeLimit < total,
      hasPreviousPage: safePage > 1,
    },
  };
}

export async function getExamBySlug(slug: string) {
  const exam = await prisma.exam.findFirst({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      description: true,
      conductingBody: true,
      examType: true,
      eligibility: true,
      applicationFee: true,
      website: true,

      colleges: {
        select: {
          id: true,
          year: true,
          category: true,
          gender: true,
          course: true,
          openingRank: true,
          closingRank: true,

          college: {
            select: {
              id: true,
              name: true,
              slug: true,
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

        orderBy: [
          {
            year: "desc",
          },
          {
            closingRank: "asc",
          },
        ],
      },
    },
  });

  if (!exam) {
    return null;
  }

  return {
    ...exam,

    applicationFee:
      exam.applicationFee !== null
        ? Number(exam.applicationFee)
        : null,

    cutoffs: exam.colleges,
  };
}