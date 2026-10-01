import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";


export async function GET(request: NextRequest) {
  
  try {
    // TODO:
    // Replace this with your existing admin session/RBAC check.
    // Every admin API must independently verify ADMIN access.
 const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 },
      );
    }
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
            collegeType: collegeType as
              | "GOVERNMENT"
              | "PRIVATE"
              | "PUBLIC"
              | "DEEMED"
              | "AUTONOMOUS",
          }
        : {}),

      ...(status
        ? {
            status: status as "ACTIVE" | "INACTIVE",
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
          navigationItems: {
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
},

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



