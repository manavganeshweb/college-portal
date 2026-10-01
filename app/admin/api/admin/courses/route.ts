import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const categoryId = searchParams.get("categoryId") || "";
    const level = searchParams.get("level") || "";
    const status = searchParams.get("status") || "";

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 20, 1),
      50
    );

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

      ...(status
        ? {
            status: status as "ACTIVE" | "INACTIVE",
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              colleges: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.course.count({
        where,
      }),
    ]);

    const totalPages = Math.max(
      Math.ceil(total / limit),
      1
    );

    return NextResponse.json({
      success: true,
      data: {
        courses: courses.map((course) => ({
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

        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("GET ADMIN COURSES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      shortName,
      degree,
      level,
      description,
      durationYears,
      eligibility,
      averageFees,
      careerOptions,
      categoryId,
      status,
    } = body;

    // Required fields
    if (!name || !slug || !level || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, slug, level and category are required",
        },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim();
    const cleanSlug = String(slug).trim();

    // Check duplicate slug
    const existingCourse = await prisma.course.findUnique({
      where: {
        slug: cleanSlug,
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        {
          success: false,
          error: "A course with this slug already exists",
        },
        { status: 409 }
      );
    }

    // Validate category
    const category = await prisma.category.findUnique({
      where: {
        id: String(categoryId),
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected category does not exist",
        },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = [
      "UG",
      "PG",
      "DIPLOMA",
      "PHD",
      "CERTIFICATE",
    ];

    if (!validLevels.includes(String(level))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid course level",
        },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["ACTIVE", "INACTIVE"];

    if (
      status &&
      !validStatuses.includes(String(status))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid course status",
        },
        { status: 400 }
      );
    }

    const parsedDuration =
      durationYears !== null &&
      durationYears !== undefined &&
      durationYears !== ""
        ? Number(durationYears)
        : null;

    const parsedFees =
      averageFees !== null &&
      averageFees !== undefined &&
      averageFees !== ""
        ? Number(averageFees)
        : null;

    if (
      parsedDuration !== null &&
      (!Number.isFinite(parsedDuration) ||
        parsedDuration < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid duration",
        },
        { status: 400 }
      );
    }

    if (
      parsedFees !== null &&
      (!Number.isFinite(parsedFees) || parsedFees < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid average fees",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        name: cleanName,
        slug: cleanSlug,

        shortName:
          shortName?.trim() || null,

        degree:
          degree?.trim() || null,

        level,

        description:
          description?.trim() || null,

        durationYears: parsedDuration,

        eligibility:
          eligibility?.trim() || null,

        averageFees: parsedFees,

        careerOptions:
          careerOptions?.trim() || null,

        categoryId: String(categoryId),

        status: status || "ACTIVE",
      },

      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },

        _count: {
          select: {
            colleges: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",

        data: {
          ...course,
          durationYears:
            course.durationYears !== null
              ? Number(course.durationYears)
              : null,

          averageFees:
            course.averageFees !== null
              ? Number(course.averageFees)
              : null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ADMIN COURSES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create course",
      },
      { status: 500 }
    );
  }
}