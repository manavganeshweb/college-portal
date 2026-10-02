import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
type NavigationInput = {
  title?: unknown;
  slug?: unknown;
  sortOrder?: unknown;
  isActive?: unknown;
};

type NavigationRequestBody = {
  navigationItems: NavigationInput[];
};
/* -------------------------------------------------- */
/* GET COURSE NAVIGATION                              */
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
      select: {
        id: true,
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

    const navigationItems =
      await prisma.courseNavigationItem.findMany({
        where: {
          courseId: id,
        },
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          sortOrder: true,
          isActive: true,
        },
      });

    return NextResponse.json({
      success: true,
      data: navigationItems,
    });
  } catch (error) {
    console.error(
      "GET COURSE NAVIGATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch course navigation",
      },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------- */
/* UPDATE COURSE NAVIGATION                           */
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

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
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

const body =
  (await request.json()) as Partial<NavigationRequestBody>;
    if (!Array.isArray(body.navigationItems)) {
      return NextResponse.json(
        {
          success: false,
          error: "navigationItems must be an array",
        },
        { status: 400 }
      );
    }
const navigationItems = body.navigationItems.map(
  (item, index) => {
    const title =
      typeof item.title === "string"
        ? item.title.trim()
        : "";

    const slug =
      typeof item.slug === "string"
        ? item.slug.trim().toLowerCase()
        : "";

    if (!title || !slug) {
      throw new Error(
        `Navigation item ${index + 1} requires a title and slug`
      );
    }

    return {
      title,
      slug,
      sortOrder: index + 1,
      isActive: item.isActive !== false,
    };
  }
);
    const slugs = navigationItems.map(
      (item) => item.slug
    );

    if (new Set(slugs).size !== slugs.length) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Navigation item slugs must be unique",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.courseNavigationItem.deleteMany({
        where: {
          courseId: id,
        },
      });

      if (navigationItems.length > 0) {
        await tx.courseNavigationItem.createMany({
          data: navigationItems.map((item) => ({
            courseId: id,
            title: item.title,
            slug: item.slug,
            sortOrder: item.sortOrder,
            isActive: item.isActive,
          })),
        });
      }
    });

    const updatedItems =
      await prisma.courseNavigationItem.findMany({
        where: {
          courseId: id,
        },
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          sortOrder: true,
          isActive: true,
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Course navigation updated successfully",
      data: updatedItems,
    });
  } catch (error) {
    console.error(
      "PUT COURSE NAVIGATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update course navigation",
      },
      { status: 500 }
    );
  }
}