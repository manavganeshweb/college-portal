import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [states, cities] = await Promise.all([
      prisma.state.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.city.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          stateId: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        states,
        cities,
      },
    });
  } catch (error) {
    console.error("GET /api/locations error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch locations",
      },
      { status: 500 }
    );
  }
}