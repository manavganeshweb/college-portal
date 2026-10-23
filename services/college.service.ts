import { prisma } from "@/lib/prisma";

export type CollegeFilters = {
  search?: string;
  state?: string | string[];
  city?: string | string[];
  collegeType?: string | string[];
  institutionKind?: "UNIVERSITY" | "COLLEGE" | "OTHER";
  verified?: boolean;
  course?: string | string[];
minFee?: number;
  maxFee?: number;
  stream?: string | string[];
  programType?: string | string[];
  category?: string | string[];
  degree?: string | string[];
  duration?: string | string[];
  fee?: string | string[];
courseType?: string | string[];
  page?: number;
  limit?: number;
};


export async function getColleges(filters: CollegeFilters = {}) {
  const page = Math.max(filters.page ?? 1, 1);
  const limit = Math.min(Math.max(filters.limit ?? 12, 1), 499);
  const skip = (page - 1) * limit;

 
const toArray = (value?: string | string[]) =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const states = toArray(filters.state);
const cities = toArray(filters.city);

const types = toArray(filters.collegeType).map((value) =>
  value.trim().toUpperCase().replace(/[\s-]+/g, "_")
);

const kinds = toArray(filters.institutionKind).map((value) =>
  value.trim().toUpperCase()
);

const feeRanges = toArray(filters.fee);
const courses = toArray(filters.course);
const streams = toArray(filters.stream);
const categories = toArray(filters.category);

const normalizedEnum = (value: string) =>
  value.trim().toUpperCase().replace(/[\s-]+/g, "_");

const programTypes = toArray(filters.programType).map(normalizedEnum);

const levelMap: Record<string, string> = {
  UG: "UG",
  PG: "PG",
  DIPLOMA: "DIPLOMA",
  PHD: "PHD",
  CERTIFICATE: "CERTIFICATE",
  INTEGRATED: "INTEGRATED",
};

const levels = programTypes.filter(
  (value) => Object.prototype.hasOwnProperty.call(levelMap, value)
);

const degrees = toArray(filters.degree);
const durations = toArray(filters.duration)
  .map((value) => Number(value))
  .filter((value) => Number.isFinite(value) && value > 0);

const minFee = filters.minFee;
const maxFee = filters.maxFee;

const feeConditions = feeRanges
  .map((range) => {
    switch (range) {
      case "Below ₹50,000":
        return { lt: 50000 };
      case "₹50,000–₹1 Lakh":
        return { gte: 50000, lte: 100000 };
      case "₹1–3 Lakh":
        return { gt: 100000, lte: 300000 };
      case "₹3–5 Lakh":
        return { gt: 300000, lte: 500000 };
      case "Above ₹5 Lakh":
        return { gt: 500000 };
      default:
        return null;
    }
  })
  .filter((range): range is NonNullable<typeof range> => range !== null);


const hasCourseFilters =
  courses.length > 0 ||
  streams.length > 0 ||
  categories.length > 0 ||
  programTypes.length > 0 ||
  degrees.length > 0 ||
  durations.length > 0 ||
  minFee !== undefined ||
  maxFee !== undefined;

const where = {
  status: "ACTIVE" as const,

  ...(kinds.length
    ? {
        institutionKind: {
          in: kinds as ("UNIVERSITY" | "COLLEGE" | "OTHER")[],
        },
      }
    : {}),

  ...(filters.search
    ? {
        OR: [
          {
            name: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            shortName: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {}),

  ...(states.length
    ? {
        state: {
          OR: [
            { slug: { in: states.map(toSlug) } },
            {
              name: {
                in: states,
                mode: "insensitive" as const,
              },
            },
          ],
        },
      }
    : {}),

  ...(cities.length
    ? {
        city: {
          OR: [
            { slug: { in: cities.map(toSlug) } },
            {
              name: {
                in: cities,
                mode: "insensitive" as const,
              },
            },
          ],
        },
      }
    : {}),

  ...(types.length
    ? {
        collegeType: {
          in: types as (
            | "GOVERNMENT"
            | "PRIVATE"
            | "PUBLIC"
            | "DEEMED"
            | "AUTONOMOUS"
            | "OTHER"
          )[],
        },
      }
    : {}),

  ...(filters.verified ? { verified: true } : {}),

...(hasCourseFilters
  ? {
      courses: {
        some: {
          AND: [
            // Match the selected course names or slugs.
           ...(durations.length
  ? [
      {
        OR: [
          { duration: { in: durations } },
          {
            course: {
              durationYears: { in: durations },
            },
          },
        ],
      },
    ]
  : []),
            // Match the selected stream/category.
            ...(streams.length || categories.length
              ? [
                  {
                    course: {
                      category: {
                        OR: [
                          ...(streams.length
                            ? [
                                { slug: { in: streams.map(toSlug) } },
                                {
                                  name: {
                                    in: streams,
                                    mode: "insensitive" as const,
                                  },
                                },
                              ]
                            : []),
                          ...(categories.length
                            ? [
                                {
                                  slug: {
                                    in: categories.map(toSlug),
                                  },
                                },
                                {
                                  name: {
                                    in: categories,
                                    mode: "insensitive" as const,
                                  },
                                },
                              ]
                            : []),
                        ],
                      },
                    },
                  },
                ]
              : []),

            // Only use valid course levels.
            ...(levels.length
              ? [
                  {
                    course: {
                      level: {
                        in: levels as (
                          | "UG"
                          | "PG"
                          | "DIPLOMA"
                          | "PHD"
                          | "CERTIFICATE"
                          | "INTEGRATED"
                        )[],
                      },
                    },
                  },
                ]
              : []),

            ...(degrees.length
              ? [
                  {
                    course: {
                      degree: {
                        in: degrees,
                        mode: "insensitive" as const,
                      },
                    },
                  },
                ]
              : []),

            // Duration can be stored on the college-course record
            // or on the related course.
            ...(durations.length
              ? [
                  {
                    OR: [
                      { duration: { in: durations } },
                      {
                        course: {
                          durationYears: { in: durations },
                        },
                      },
                    ],
                  },
                ]
              : []),

            // A selected fee range must match the college-course fee.
            ...(feeConditions.length
              ? [
                  {
                    OR: feeConditions.map((condition) => ({
                      fees: condition,
                    })),
                  },
                ]
              : []),

            // Preserve support for explicit numeric fee bounds.
            ...(minFee !== undefined || maxFee !== undefined
              ? [
                  {
                    fees: {
                      ...(minFee !== undefined ? { gte: minFee } : {}),
                      ...(maxFee !== undefined ? { lte: maxFee } : {}),
                    },
                  },
                ]
              : []),
          ],
        },
      },
    }
  : {}),

};
  

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      skip,
      take: limit,

      orderBy: [
        {
          verified: "desc",
        },
        {
          name: "asc",
        },
      ],

      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        logo: true,
        coverImage: true,
        description: true,
        establishedYear: true,
        institutionKind: true,
        collegeType: true,
        website: true,
        verified: true,

        state: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        city: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        courses: {
          select: {
            id: true,
            fees: true,
            seats: true,
            duration: true,

            course: {
              select: {
                id: true,
                name: true,
                slug: true,
                shortName: true,
                degree: true,
                level: true,

                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
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
    }),

    prisma.college.count({
      where,
    }),
  ]);

  const data = colleges.map((college) => {
    const ratings = college.reviews.map((review) => review.rating);

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) /
          ratings.length
        : null;

    const fees = college.courses
      .map((item) => (item.fees !== null ? Number(item.fees) : null))
      .filter((fee): fee is number => fee !== null);

    return {
      id: college.id,
      name: college.name,
      slug: college.slug,
      shortName: college.shortName,
      logo: college.logo,
      coverImage: college.coverImage,
      description: college.description,
      establishedYear: college.establishedYear,
      institutionKind: college.institutionKind,
      collegeType: college.collegeType,
      website: college.website,
      verified: college.verified,

      state: college.state,
      city: college.city,

      courses: college.courses.map((item) => ({
        id: item.id,
        fees: item.fees !== null ? Number(item.fees) : null,
        seats: item.seats,
        duration: item.duration !== null ? Number(item.duration) : null,
        course: item.course,
      })),

      averageRating,
      reviewCount: ratings.length,

      minimumFee: fees.length > 0 ? Math.min(...fees) : null,
      maximumFee: fees.length > 0 ? Math.max(...fees) : null,
    };
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
}
export async function getPopularColleges(limit = 4) {
  const colleges = await prisma.college.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [
      {
        verified: "desc",
      },
      {
        reviews: {
          _count: "desc",
        },
      },
      {
        name: "asc",
      },
    ],
    take: limit,
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
  });

  return colleges.map((college) => {
    const ratings = college.reviews.map((review) => review.rating);

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : null;

    const fees = college.courses
      .map((item) => (item.fees ? Number(item.fees) : null))
      .filter((fee): fee is number => fee !== null);

    return {
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
        fees: item.fees ? Number(item.fees) : null,
        course: item.course,
      })),

      averageRating,
      reviewCount: ratings.length,
      minimumFee: fees.length ? Math.min(...fees) : null,
      maximumFee: fees.length ? Math.max(...fees) : null,
    };
  });
}

export async function getCollegeBySlug(slug: string) {
  const college = await prisma.college.findUnique({
    where: {
      slug,
    },

    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      logo: true,
      coverImage: true,
      description: true,
      establishedYear: true,
      institutionKind: true,
      collegeType: true,
      website: true,
      email: true,
      phone: true,
      address: true,
      verified: true,
      status: true,
      lastUpdated: true,
      seoTitle: true,
seoDescription: true,
seoKeywords: true,
canonicalUrl: true,
ogTitle: true,
ogDescription: true,
ogImage: true,

      state: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      navigationItems: {
  where: {
    isActive: true,
  },
  select: {
    id: true,
    label: true,
    slug: true,
    sectionId: true,
    sortOrder: true,
    isActive: true,
  },
  orderBy: {
    sortOrder: "asc",
  },
},

      city: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      courses: {
        select: {
          id: true,
          fees: true,
          seats: true,
          duration: true,

          course: {
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
          id: true,
          rating: true,
          title: true,
          content: true,
          isVerifiedStudent: true,
              isPublished: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      cutoffs: {
        select: {
          id: true,
          year: true,
          category: true,
          gender: true,
          course: true,
          openingRank: true,
          closingRank: true,

          exam: {
            select: {
              id: true,
              name: true,
              slug: true,
              shortName: true,
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

      rankings: {
        where: {
          status: "PUBLISHED",
        },
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
        },
        orderBy: [
          {
            year: "desc",
          },
          {
            rank: "asc",
          },
        ],
      },

      departments: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          hodName: true,
          establishedYear: true,

  faculty: {
  select: {
    id: true,
    name: true,
    slug: true,
    designation: true,
    qualification: true,
    specialization: true,
    profileImage: true,
    profileUrl: true,
    email: true,
    experienceYears: true,
    isPublished: true,
  },
},
        },
        orderBy: {
          name: "asc",
        },
      },

      placements: {
        where: {
          status: "PUBLISHED",
        },
        select: {
          id: true,
          year: true,
          course: true,
          placementType: true,
          totalStudents: true,
          studentsPlaced: true,
          averagePackage: true,
          medianPackage: true,
          highestPackage: true,
          totalOffers: true,
          participatingCompanies: true,
          placementReportUrl: true,
          sourceUrl: true,

          recruiters: {
            select: {
              id: true,

              recruiter: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  website: true,
                },
              },
            },

            orderBy: {
              recruiter: {
                name: "asc",
              },
            },
          },
        },

        orderBy: [
          {
            year: "desc",
          },
          {
            placementType: "asc",
          },
        ],
      },
      infrastructure: {
  include: {
    facilities: {
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    },
  },
},
photos: {
  where: {
    isActive: true,
  },
  orderBy: {
    sortOrder: "asc",
  },
},

questions: {
  where: {
    status: "PUBLISHED",
  },
  orderBy: {
    createdAt: "desc",
  },
  select: {
    id: true,
    question: true,
    slug: true,
    askerName: true,
    status: true,
    createdAt: true,
    answers: {
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        answer: true,
        answererName: true,
        answererRole: true,
        isVerified: true,
        status: true,
        createdAt: true,
      },
    },
  },
},
    },
  });

  if (!college) {
    return null;
  }

  

  return {
    ...college,

    courses: college.courses.map((item) => ({
      ...item,
      fees: item.fees ? Number(item.fees) : null,
      duration: item.duration ? Number(item.duration) : null,

      course: {
        ...item.course,
        durationYears: item.course.durationYears
          ? Number(item.course.durationYears)
          : null,
        averageFees: item.course.averageFees
          ? Number(item.course.averageFees)
          : null,
      },
    })),

    rankings: college.rankings.map((ranking) => ({
      ...ranking,
      score: ranking.score ? Number(ranking.score) : null,
    })),

    placements: college.placements.map((placement) => ({
      ...placement,
      averagePackage: placement.averagePackage
        ? Number(placement.averagePackage)
        : null,
      medianPackage: placement.medianPackage
        ? Number(placement.medianPackage)
        : null,
      highestPackage: placement.highestPackage
        ? Number(placement.highestPackage)
        : null,
    })),
  };
}

export type CollegeDetail = NonNullable<
  Awaited<ReturnType<typeof getCollegeBySlug>>
  
>;

export async function getCollegesForComparison(ids: string[]) {
  const colleges = await prisma.college.findMany({
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
      logo: true,
      coverImage: true,
      description: true,
      establishedYear: true,
      collegeType: true,
      website: true,
      email: true,
      phone: true,
      address: true,
      verified: true,
      lastUpdated: true,

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
        select: {
          id: true,
          fees: true,
          seats: true,
          duration: true,

          course: {
            select: {
              id: true,
              name: true,
              slug: true,
              shortName: true,
              degree: true,
              level: true,
              durationYears: true,
              averageFees: true,

              category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
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

      rankings: {
        where: {
          status: "PUBLISHED",
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
          year: true,
          rank: true,
          category: true,
          rankingBody: true,
          score: true,
        },
      },

      cutoffs: {
        orderBy: [
          {
            year: "desc",
          },
          {
            closingRank: "asc",
          },
        ],
        select: {
          year: true,
          category: true,
          gender: true,
          course: true,
          openingRank: true,
          closingRank: true,

          exam: {
            select: {
              name: true,
              shortName: true,
            },
          },
        },
      },

      departments: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      placements: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          year: "desc",
        },
        select: {
          year: true,
          course: true,
          placementType: true,
          totalStudents: true,
          studentsPlaced: true,
          averagePackage: true,
          medianPackage: true,
          highestPackage: true,
          totalOffers: true,
          participatingCompanies: true,

          recruiters: {
            select: {
              recruiter: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return colleges.map((college) => {
    const ratings = college.reviews.map((review) => review.rating);

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) /
          ratings.length
        : null;

    const fees = college.courses
      .map((item) => (item.fees !== null ? Number(item.fees) : null))
      .filter((fee): fee is number => fee !== null);

    return {
      ...college,

      averageRating,
      reviewCount: ratings.length,

      minimumFee: fees.length > 0 ? Math.min(...fees) : null,
      maximumFee: fees.length > 0 ? Math.max(...fees) : null,

      courses: college.courses.map((item) => ({
        ...item,
        fees: item.fees !== null ? Number(item.fees) : null,
        duration:
          item.duration !== null ? Number(item.duration) : null,

        course: {
          ...item.course,
          durationYears:
            item.course.durationYears !== null
              ? Number(item.course.durationYears)
              : null,
          averageFees:
            item.course.averageFees !== null
              ? Number(item.course.averageFees)
              : null,
        },
      })),

      rankings: college.rankings.map((ranking) => ({
        ...ranking,
        score:
          ranking.score !== null ? Number(ranking.score) : null,
      })),

      cutoffs: college.cutoffs.map((cutoff) => ({
  ...cutoff,
  openingRank:
    cutoff.openingRank !== null
      ? Number(cutoff.openingRank)
      : null,
  closingRank:
    cutoff.closingRank !== null
      ? Number(cutoff.closingRank)
      : null,
})),

      placements: college.placements.map((placement) => ({
        ...placement,
        averagePackage:
          placement.averagePackage !== null
            ? Number(placement.averagePackage)
            : null,
        medianPackage:
          placement.medianPackage !== null
            ? Number(placement.medianPackage)
            : null,
        highestPackage:
          placement.highestPackage !== null
            ? Number(placement.highestPackage)
            : null,
      })),
    };
  });
}


export async function getPopularUniversities(limit = 4) {
  const universities = await prisma.college.findMany({
    where: {
      status: "ACTIVE",
      institutionKind: "UNIVERSITY",
    },
    orderBy: [
      {
        verified: "desc",
      },
      {
        reviews: {
          _count: "desc",
        },
      },
      {
        name: "asc",
      },
    ],
    take: Math.max(1, Math.min(limit, 20)),
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
  });

  return universities.map((university) => {
    const ratings = university.reviews.map(
      (review) => review.rating
    );

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) /
          ratings.length
        : null;

    const fees = university.courses
      .map((item) =>
        item.fees !== null ? Number(item.fees) : null
      )
      .filter((fee): fee is number => fee !== null);

    return {
      id: university.id,
      name: university.name,
      slug: university.slug,
      shortName: university.shortName,
      logo: university.logo,
      coverImage: university.coverImage,
      collegeType: university.collegeType,
      verified: university.verified,
      establishedYear: university.establishedYear,

      state: university.state,
      city: university.city,

      courses: university.courses.map((item) => ({
        fees: item.fees !== null ? Number(item.fees) : null,
        course: item.course,
      })),

      averageRating,
      reviewCount: ratings.length,
      minimumFee:
        fees.length > 0 ? Math.min(...fees) : null,
      maximumFee:
        fees.length > 0 ? Math.max(...fees) : null,
    };
  });
}
