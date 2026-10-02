import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // TODO:
    // Replace this with your existing admin session/RBAC check.

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required.",
        },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: {
        id,
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
        status: true,
        lastUpdated: true,
        seoTitle: true,
        seoDescription: true,
        createdAt: true,
        updatedAt: true,

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

          orderBy: {
            course: {
              name: "asc",
            },
          },
        },

        departments: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            hodName: true,
            establishedYear: true,

            _count: {
              select: {
                faculty: true,
              },
            },
          },

          orderBy: {
            name: "asc",
          },
        },

        rankings: {
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
            status: true,
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

        placements: {
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
            status: true,

            recruiters: {
              select: {
                recruiter: {
                  select: {
                    id: true,
                    name: true,
                    logo: true,
                    website: true,
                  },
                },
              },
            },
          },

          orderBy: {
            year: "desc",
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

        reviews: {
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

          take: 20,
        },

        questions: {
          select: {
            id: true,
            question: true,
            slug: true,
            askerName: true,
            status: true,
            createdAt: true,

            _count: {
              select: {
                answers: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 20,
        },

        _count: {
          select: {
            courses: true,
            departments: true,
            rankings: true,
            placements: true,
            cutoffs: true,
            reviews: true,
            questions: true,
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found.",
        },
        { status: 404 }
      );
    }

    const mappedCollege = {
      ...college,

      courses: college.courses.map((item) => ({
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

      rankings: college.rankings.map((item) => ({
        ...item,
        score:
          item.score !== null
            ? Number(item.score)
            : null,
      })),

      placements: college.placements.map((item) => ({
        ...item,
        averagePackage:
          item.averagePackage !== null
            ? Number(item.averagePackage)
            : null,
        medianPackage:
          item.medianPackage !== null
            ? Number(item.medianPackage)
            : null,
        highestPackage:
          item.highestPackage !== null
            ? Number(item.highestPackage)
            : null,
      })),
    };

    return NextResponse.json({
      success: true,
      data: mappedCollege,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/colleges/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch college.",
      },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      shortName,
      slug,
      description,
      establishedYear,
      collegeType,
      website,
      email,
      phone,
      address,
      stateId,
      cityId,
      logo,
      coverImage,
      verified,
      status,
      seoTitle,
      seoDescription,
  seoKeywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
    } = body;

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!name?.trim()) {
      return Response.json(
        {
          success: false,
          message: "College name is required.",
        },
        { status: 400 }
      );
    }

    if (!slug?.trim()) {
      return Response.json(
        {
          success: false,
          message: "Slug is required.",
        },
        { status: 400 }
      );
    }

    if (!stateId) {
      return Response.json(
        {
          success: false,
          message: "State is required.",
        },
        { status: 400 }
      );
    }

    if (!cityId) {
      return Response.json(
        {
          success: false,
          message: "City is required.",
        },
        { status: 400 }
      );
    }

const validCollegeTypes = [
  "GOVERNMENT",
  "PRIVATE",
  "PUBLIC",
  "DEEMED",
  "AUTONOMOUS",
  "OTHER",
];

    if (!validCollegeTypes.includes(collegeType)) {
      return Response.json(
        {
          success: false,
          message: "Invalid college type.",
        },
        { status: 400 }
      );
    }

    const validStatuses = ["ACTIVE", "INACTIVE"];

    if (!validStatuses.includes(status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid college status.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate slug
    // -----------------------------

    const normalizedSlug = slug.trim().toLowerCase();

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!slugRegex.test(normalizedSlug)) {
      return Response.json(
        {
          success: false,
          message:
            "Slug can only contain lowercase letters, numbers, and hyphens.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Check college exists
    // -----------------------------

    const existingCollege = await prisma.college.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!existingCollege) {
      return Response.json(
        {
          success: false,
          message: "College not found.",
        },
        { status: 404 }
      );
    }

    // -----------------------------
    // Check duplicate slug
    // -----------------------------

    const duplicateSlug = await prisma.college.findFirst({
      where: {
        slug: normalizedSlug,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateSlug) {
      return Response.json(
        {
          success: false,
          message: "Another college already uses this slug.",
        },
        { status: 409 }
      );
    }

    // -----------------------------
    // Validate established year
    // -----------------------------

    let normalizedEstablishedYear: number | null = null;

    if (
      establishedYear !== null &&
      establishedYear !== undefined &&
      establishedYear !== ""
    ) {
      normalizedEstablishedYear = Number(establishedYear);

      const currentYear = new Date().getFullYear();

      if (
        !Number.isInteger(normalizedEstablishedYear) ||
        normalizedEstablishedYear < 1000 ||
        normalizedEstablishedYear > currentYear
      ) {
        return Response.json(
          {
            success: false,
            message: `Established year must be between 1000 and ${currentYear}.`,
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------
    // Verify state + city relation
    // -----------------------------

    const city = await prisma.city.findFirst({
      where: {
        id: cityId,
        stateId,
      },
      select: {
        id: true,
      },
    });

    if (!city) {
      return Response.json(
        {
          success: false,
          message: "Selected city does not belong to the selected state.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Update college
    // -----------------------------

    const updatedCollege = await prisma.college.update({
      where: {
        id,
      },
      data: {
        name: name.trim(),
        shortName: shortName?.trim() || null,
        slug: normalizedSlug,
        description: description?.trim() || null,

        establishedYear: normalizedEstablishedYear,

        collegeType,

        website: website?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,

        stateId,
        cityId,

        logo: logo?.trim() || null,
        coverImage: coverImage?.trim() || null,

        verified: Boolean(verified),

        status,

        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,

seoKeywords: seoKeywords?.trim() || null,
canonicalUrl: canonicalUrl?.trim() || null,
ogTitle: ogTitle?.trim() || null,
ogDescription: ogDescription?.trim() || null,
ogImage: ogImage?.trim() || null,

        lastUpdated: new Date(),
      },

      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        collegeType: true,
        verified: true,
        status: true,
        lastUpdated: true,
      },
    });

    return Response.json({
      success: true,
      message: "College updated successfully.",
      data: updatedCollege,
    });
  } catch (error) {
    console.error("UPDATE COLLEGE ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update college.",
      },
      { status: 500 }
    );
  }
}