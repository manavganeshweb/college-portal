import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        applications: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            phoneNumber: true,
            status: true,
            courseName: true,
            notes: true,
            appliedAt: true,
            createdAt: true,
            updatedAt: true,

            college: {
              select: {
                id: true,
                name: true,
                slug: true,
                shortName: true,
                logo: true,
                verified: true,

                city: {
                  select: {
                    name: true,

                    state: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },

        shortlists: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            createdAt: true,

            college: {
              select: {
                id: true,
                name: true,
                slug: true,
                shortName: true,
                logo: true,
                verified: true,

                city: {
                  select: {
                    name: true,

                    state: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },

        _count: {
          select: {
            applications: true,
            shortlists: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "GET /admin/api/admin/users/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user.",
      },
      {
        status: 500,
      },
    );
  }
}