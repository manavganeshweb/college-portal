import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const cutoff = await prisma.collegeCutoff.findUnique({
      where: { id },
      select: {
        id: true,
        examId: true,
        collegeId: true,
        year: true,
        category: true,
        gender: true,
        course: true,
        openingRank: true,
        closingRank: true,
        exam: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!cutoff) {
      return NextResponse.json(
        {
          success: false,
          error: "Cutoff record not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cutoff,
    });
  } catch (error) {
    console.error("GET cutoff error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cutoff",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.collegeCutoff.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Cutoff record not found",
        },
        { status: 404 }
      );
    }

    const year = Number(body.year);

    const openingRank =
      body.openingRank === "" ||
      body.openingRank === null ||
      body.openingRank === undefined
        ? null
        : Number(body.openingRank);

    const closingRank =
      body.closingRank === "" ||
      body.closingRank === null ||
      body.closingRank === undefined
        ? null
        : Number(body.closingRank);

    if (Number.isNaN(year)) {
      return NextResponse.json(
        {
          success: false,
          error: "Year must be a valid number",
        },
        { status: 400 }
      );
    }

    if (
      openingRank !== null &&
      (Number.isNaN(openingRank) || openingRank < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Opening rank must be valid",
        },
        { status: 400 }
      );
    }

    if (
      closingRank !== null &&
      (Number.isNaN(closingRank) || closingRank < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Closing rank must be valid",
        },
        { status: 400 }
      );
    }

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const gender =
      typeof body.gender === "string"
        ? body.gender.trim()
        : "";

    const course =
      typeof body.course === "string"
        ? body.course.trim()
        : "";

    const duplicate = await prisma.collegeCutoff.findFirst({
      where: {
        examId: existing.id,
        year,
        category: category || null,
        gender: gender || null,
        course: course || null,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          error: "A cutoff with these details already exists",
        },
        { status: 409 }
      );
    }

    const cutoff = await prisma.collegeCutoff.update({
      where: { id },
      data: {
        year,
        category: category || null,
        gender: gender || null,
        course: course || null,
        openingRank,
        closingRank,
      },
    });

    return NextResponse.json({
      success: true,
      data: cutoff,
    });
  } catch (error) {
    console.error("PUT cutoff error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update cutoff",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const existing = await prisma.collegeCutoff.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Cutoff record not found",
        },
        { status: 404 }
      );
    }

    await prisma.collegeCutoff.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Cutoff deleted successfully",
    });
  } catch (error) {
    console.error("DELETE cutoff error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete cutoff",
      },
      { status: 500 }
    );
  }
}