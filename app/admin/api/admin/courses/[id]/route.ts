import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const validLevels = [
  "UG",
  "PG",
  "DIPLOMA",
  "PHD",
  "CERTIFICATE",
] as const;

const validStatuses = [
  "ACTIVE",
  "INACTIVE",
] as const;

function serializeCourse(course: {
  durationYears: unknown;
  averageFees: unknown;
  [key: string]: unknown;
}) {
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
  };
}

/* -------------------------------------------------- */
/* GET COURSE                                         */
/* -------------------------------------------------- */

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Course ID is required",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        colleges: {
          include: {
            college: {
              select: {
                id: true,
                name: true,
                slug: true,
                shortName: true,
                logo: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            colleges: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeCourse(course),
    });
  } catch (error) {
    console.error(
      "GET ADMIN COURSE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch course",
      },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------- */
/* UPDATE COURSE                                      */
/* -------------------------------------------------- */

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Course ID is required",
        },
        { status: 400 }
      );
    }

    const existingCourse =
      await prisma.course.findUnique({
        where: {
          id,
        },
      });

    if (!existingCourse) {
      return NextResponse.json(
        {
          success: false,
          error: "Course not found",
        },
        { status: 404 }
      );
    }

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
    const cleanCategoryId = String(categoryId);

    if (!cleanName || !cleanSlug) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and slug cannot be empty",
        },
        { status: 400 }
      );
    }

    /* Validate level */

    if (
      !validLevels.includes(
        level as (typeof validLevels)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid course level",
        },
        { status: 400 }
      );
    }

    /* Validate status */

    if (
      status &&
      !validStatuses.includes(
        status as (typeof validStatuses)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid course status",
        },
        { status: 400 }
      );
    }

    /* Check category */

    const category =
      await prisma.category.findUnique({
        where: {
          id: cleanCategoryId,
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

    /* Check duplicate slug */

    const slugOwner =
      await prisma.course.findFirst({
        where: {
          slug: cleanSlug,
          NOT: {
            id,
          },
        },
        select: {
          id: true,
        },
      });

    if (slugOwner) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A different course already uses this slug",
        },
        { status: 409 }
      );
    }

    /* Parse numeric values */

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
      (!Number.isFinite(parsedFees) ||
        parsedFees < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid average fees",
        },
        { status: 400 }
      );
    }

    /* Update */

    const course = await prisma.course.update({
      where: {
        id,
      },

      data: {
        name: cleanName,
        slug: cleanSlug,

        shortName:
          typeof shortName === "string" &&
          shortName.trim()
            ? shortName.trim()
            : null,

        degree:
          typeof degree === "string" &&
          degree.trim()
            ? degree.trim()
            : null,

        level,

        description:
          typeof description === "string" &&
          description.trim()
            ? description.trim()
            : null,

        durationYears: parsedDuration,

        eligibility:
          typeof eligibility === "string" &&
          eligibility.trim()
            ? eligibility.trim()
            : null,

        averageFees: parsedFees,

        careerOptions:
          typeof careerOptions === "string" &&
          careerOptions.trim()
            ? careerOptions.trim()
            : null,

        categoryId: cleanCategoryId,

        status: status || "ACTIVE",
      },

      include: {
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
    });

    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      data: serializeCourse(course),
    });
  } catch (error) {
    console.error(
      "PUT ADMIN COURSE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update course",
      },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------- */
/* DELETE COURSE                                      */
/* -------------------------------------------------- */

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Course ID is required",
        },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            colleges: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: "Course not found",
        },
        { status: 404 }
      );
    }

    /*
     * A course can have CollegeCourse records.
     * Because the relation uses onDelete: Cascade,
     * deleting the course will also remove those mappings.
     */

    await prisma.course.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
      data: {
        id: course.id,
        name: course.name,
      },
    });
  } catch (error) {
    console.error(
      "DELETE ADMIN COURSE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete course",
      },
      { status: 500 }
    );
  }
}