import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type NavigationItemInput = {
  label: string;
  slug: string;
  sectionId: string;
  sortOrder: number;
  isActive: boolean;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const navigationItems =
      await prisma.navigationItem.findMany({
        where: {
          collegeId: id,
        },
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          label: true,
          slug: true,
          sectionId: true,
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
      "GET /api/admin/colleges/[id]/navigation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch college navigation.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const navigationItems: NavigationItemInput[] =
      Array.isArray(body.navigationItems)
        ? body.navigationItems
        : [];

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

    // Validate navigation items before touching the database.
    for (const [index, item] of navigationItems.entries()) {
      if (!item.label?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `Navigation item ${index + 1} label is required.`,
          },
          { status: 400 }
        );
      }

      if (!item.slug?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `Navigation item ${index + 1} slug is required.`,
          },
          { status: 400 }
        );
      }

      if (!item.sectionId?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `Navigation item ${index + 1} section ID is required.`,
          },
          { status: 400 }
        );
      }
    }

    const savedNavigationItems =
      await prisma.$transaction(async (tx) => {
        // Remove the old navigation configuration.
        await tx.navigationItem.deleteMany({
          where: {
            collegeId: id,
          },
        });

        // Create the current configuration.
        if (navigationItems.length > 0) {
          await tx.navigationItem.createMany({
            data: navigationItems.map((item, index) => ({
              collegeId: id,
              label: item.label.trim(),
              slug: item.slug.trim().toLowerCase(),
              sectionId: item.sectionId.trim(),
              sortOrder: index + 1,
              isActive: Boolean(item.isActive),
            })),
        });
        }

        return tx.navigationItem.findMany({
          where: {
            collegeId: id,
          },
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
            label: true,
            slug: true,
            sectionId: true,
            sortOrder: true,
            isActive: true,
          },
        });
      });

    return NextResponse.json({
      success: true,
      message: "College navigation updated successfully.",
      data: savedNavigationItems,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/colleges/[id]/navigation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update college navigation.",
      },
      { status: 500 }
    );
  }
}