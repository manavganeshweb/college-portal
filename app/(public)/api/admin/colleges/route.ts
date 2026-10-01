import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // TODO:
    // Replace this with your existing admin session/RBAC check.
    // Every admin API must independently verify ADMIN access.

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const stateId = searchParams.get("stateId") || "";
    const cityId = searchParams.get("cityId") || "";
    const collegeType = searchParams.get("collegeType") || "";
    const status = searchParams.get("status") || "";
    const verified = searchParams.get("verified") || "";

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "20");

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const limit =
      Number.isInteger(limitParam) && limitParam > 0
        ? Math.min(limitParam, 50)
        : 20;

    const skip = (page - 1) * limit;

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
              {
                slug: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(stateId ? { stateId } : {}),
      ...(cityId ? { cityId } : {}),

      ...(collegeType
        ? {
            collegeType:
              collegeType as
                | "GOVERNMENT"
                | "PRIVATE"
                | "PUBLIC"
                | "DEEMED"
                | "AUTONOMOUS",
          }
        : {}),

      ...(status
        ? {
            status:
              status as "ACTIVE" | "INACTIVE",
          }
        : {}),

      ...(verified === "true"
        ? { verified: true }
        : verified === "false"
          ? { verified: false }
          : {}),
    };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          logo: true,
          coverImage: true,
          collegeType: true,
          establishedYear: true,
          verified: true,
          status: true,
          lastUpdated: true,
          createdAt: true,

          state: {
            select: {
              id: true,
              name: true,
            },
          },

          city: {
            select: {
              id: true,
              name: true,
            },
          },

          _count: {
            select: {
              courses: true,
              reviews: true,
              rankings: true,
              departments: true,
              placements: true,
              questions: true,
            },
          },
        },

        orderBy: {
          updatedAt: "desc",
        },

        skip,
        take: limit,
      }),

      prisma.college.count({
        where,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/colleges error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch colleges",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO:
    // Replace this with your existing admin session/RBAC check.
    // This endpoint must only be accessible to ADMIN users.

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
      seoTitle,
      seoDescription,
    } = body;

    // --------------------------------------------------
    // Basic validation
    // --------------------------------------------------

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "College name is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "College slug is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof stateId !== "string" ||
      !stateId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "State is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof cityId !== "string" ||
      !cityId
    ) {
      return NextResponse.json(
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
    ] as const;

    if (
      !validCollegeTypes.includes(collegeType)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid college type.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate slug format
    // --------------------------------------------------

    const cleanSlug = slug
      .trim()
      .toLowerCase();

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        cleanSlug
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Slug can only contain lowercase letters, numbers and hyphens.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate year
    // --------------------------------------------------

    let cleanEstablishedYear:
      | number
      | null = null;

    if (
      establishedYear !== null &&
      establishedYear !== undefined &&
      establishedYear !== ""
    ) {
      const year = Number(establishedYear);

      const currentYear =
        new Date().getFullYear();

      if (
        !Number.isInteger(year) ||
        year < 1000 ||
        year > currentYear
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid established year.",
          },
          { status: 400 }
        );
      }

      cleanEstablishedYear = year;
    }

    // --------------------------------------------------
    // Verify state + city relationship
    // --------------------------------------------------

    const city = await prisma.city.findUnique({
      where: {
        id: cityId,
      },
      select: {
        id: true,
        stateId: true,
      },
    });

    if (!city) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected city does not exist.",
        },
        { status: 400 }
      );
    }

    if (city.stateId !== stateId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected city does not belong to the selected state.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Duplicate slug protection
    // --------------------------------------------------

    const existingCollege =
      await prisma.college.findUnique({
        where: {
          slug: cleanSlug,
        },
        select: {
          id: true,
          name: true,
        },
      });

    if (existingCollege) {
      return NextResponse.json(
        {
          success: false,
          message: `A college with this slug already exists: ${existingCollege.name}`,
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // Create college
    // --------------------------------------------------

    const college = await prisma.college.create({
      data: {
        name: name.trim(),

        shortName:
          typeof shortName === "string" &&
          shortName.trim()
            ? shortName.trim()
            : null,

        slug: cleanSlug,

        description:
          typeof description === "string" &&
          description.trim()
            ? description.trim()
            : null,

        establishedYear:
          cleanEstablishedYear,

        collegeType,

        website:
          typeof website === "string" &&
          website.trim()
            ? website.trim()
            : null,

        email:
          typeof email === "string" &&
          email.trim()
            ? email.trim()
            : null,

        phone:
          typeof phone === "string" &&
          phone.trim()
            ? phone.trim()
            : null,

        address:
          typeof address === "string" &&
          address.trim()
            ? address.trim()
            : null,

        stateId,

        cityId,

        logo:
          typeof logo === "string" &&
          logo.trim()
            ? logo.trim()
            : null,

        coverImage:
          typeof coverImage === "string" &&
          coverImage.trim()
            ? coverImage.trim()
            : null,

        verified:
          typeof verified === "boolean"
            ? verified
            : false,

        seoTitle:
          typeof seoTitle === "string" &&
          seoTitle.trim()
            ? seoTitle.trim()
            : null,

        seoDescription:
          typeof seoDescription ===
            "string" &&
          seoDescription.trim()
            ? seoDescription.trim()
            : null,

        status: "ACTIVE",

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
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "College created successfully.",
        data: college,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/colleges error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create college.",
      },
      { status: 500 }
    );
  }
}