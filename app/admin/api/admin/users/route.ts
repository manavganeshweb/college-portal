import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        {
          status: 403,
        },
      );
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const role = searchParams.get("role") || "";

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
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                phone: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(role === "USER" || role === "ADMIN"
        ? {
            role: role as "USER" | "ADMIN",
          }
        : {}),
    };

    const [users, total, totalUsers, adminUsers, regularUsers] =
      await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            role: true,
            createdAt: true,
            updatedAt: true,

            _count: {
              select: {
                applications: true,
                shortlists: true,
                reviews: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: limit,
        }),

        prisma.user.count({
          where,
        }),

        prisma.user.count(),

        prisma.user.count({
          where: {
            role: "ADMIN",
          },
        }),

        prisma.user.count({
          where: {
            role: "USER",
          },
        }),
      ]);

    return NextResponse.json({
      success: true,

      data: users,

      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
      },

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
    console.error("GET /admin/api/admin/users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users.",
      },
      {
        status: 500,
      },
    );
  }
}