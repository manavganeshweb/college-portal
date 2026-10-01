import { prisma } from "@/lib/prisma";

type GetCoursesParams = {
  search?: string;
  categoryId?: string;
  level?: string;
  page?: number;
  limit?: number;
};

export async function getCourses({
  search,
  categoryId,
  level,
  page = 1,
  limit = 12,
}: GetCoursesParams = {}) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 50);
  const skip = (safePage - 1) * safeLimit;

  const where = {
    status: "ACTIVE" as const,

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

    ...(categoryId ? { categoryId } : {}),

    ...(level
      ? {
          level: level as
            | "UG"
            | "PG"
            | "DIPLOMA"
            | "PHD"
            | "CERTIFICATE",
        }
      : {}),
  };

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,

      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        degree: true,
        level: true,
        description: true,
        durationYears: true,
        eligibility: true,
        averageFees: true,
        careerOptions: true,

        category: {
          select: {
            id: true,
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

      orderBy: {
        name: "asc",
      },

      skip,
      take: safeLimit,
    }),

    prisma.course.count({
      where,
    }),
  ]);

  const data = courses.map((course) => ({
    ...course,

    durationYears:
      course.durationYears !== null
        ? Number(course.durationYears)
        : null,

    averageFees:
      course.averageFees !== null
        ? Number(course.averageFees)
        : null,
  }));

  return {
    courses: data,

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

export async function getCourseBySlug(slug: string) {
  const course = await prisma.course.findFirst({
    where: {
      slug,
      status: "ACTIVE",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      degree: true,
      level: true,
      description: true,
      durationYears: true,
      eligibility: true,
      averageFees: true,
      careerOptions: true,
      createdAt: true,
      updatedAt: true,

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
      navigationItems: {
  where: { isActive: true },
  select: {
    id: true,
    title: true,
    
    slug: true,
    sortOrder: true,
  },
  orderBy: {
    sortOrder: "asc",
  },
},

      colleges: {
        select: {
          id: true,
          fees: true,
          seats: true,

          college: {
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
            },
          },
        },

        orderBy: {
          college: {
            name: "asc",
          },
        },
      },
    },
    
  });

  if (!course) {
    return null;
  }

  return {
    ...course,

    durationYears:
      course.durationYears !== null
        ? Number(course.durationYears)
        : null,

    averageFees:
      course.averageFees !== null
        ? Number(course.averageFees)
        : null,

    colleges: course.colleges.map((item) => ({
      ...item,

      fees:
        item.fees !== null
          ? Number(item.fees)
          : null,
    })),
  };
}
async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,

      courses: {
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
          description: true,
          durationYears: true,
          eligibility: true,
          averageFees: true,
          careerOptions: true,

          _count: {
            select: {
              colleges: true,
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!category) {
    return null;
  }

  return {
    ...category,

    courses: category.courses.map((course) => ({
      ...course,

      durationYears:
        course.durationYears !== null
          ? Number(course.durationYears)
          : null,

      averageFees:
        course.averageFees !== null
          ? Number(course.averageFees)
          : null,
    })),
  };
}

export async function getCoursesForComparison(ids: string[]) {
  const courses = await prisma.course.findMany({
    where: {
      id: {
        in: ids,
      },
      status: "ACTIVE",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      degree: true,
      level: true,
      description: true,
      durationYears: true,
      eligibility: true,
      averageFees: true,
      careerOptions: true,
      createdAt: true,
      updatedAt: true,

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      colleges: {
        select: {
          id: true,
          fees: true,
          seats: true,
          duration: true,

          college: {
            select: {
              id: true,
              name: true,
              slug: true,
              shortName: true,
              logo: true,
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
            },
          },
        },

        orderBy: {
          college: {
            name: "asc",
          },
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  return courses.map((course) => {
    const collegeFees = course.colleges
      .map((item) =>
        item.fees !== null ? Number(item.fees) : null
      )
      .filter((fee): fee is number => fee !== null);

    const totalSeats = course.colleges.reduce(
      (total, item) => total + (item.seats ?? 0),
      0
    );

    return {
      ...course,

      durationYears:
        course.durationYears !== null
          ? Number(course.durationYears)
          : null,

      averageFees:
        course.averageFees !== null
          ? Number(course.averageFees)
          : null,

      collegeCount: course.colleges.length,

      minimumCollegeFee:
        collegeFees.length > 0
          ? Math.min(...collegeFees)
          : null,

      maximumCollegeFee:
        collegeFees.length > 0
          ? Math.max(...collegeFees)
          : null,

      totalSeats: totalSeats > 0 ? totalSeats : null,

      colleges: course.colleges.map((item) => ({
        ...item,

        fees:
          item.fees !== null
            ? Number(item.fees)
            : null,

        duration:
          item.duration !== null
            ? Number(item.duration)
            : null,
      })),
    };
  });
}