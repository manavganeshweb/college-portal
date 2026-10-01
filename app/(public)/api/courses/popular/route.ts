import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        level: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 6,
    });

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Failed to load popular courses:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to load courses",
      },
      {
        status: 500,
      },
    );
  }
}