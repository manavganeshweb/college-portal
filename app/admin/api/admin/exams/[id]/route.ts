import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/src/generated/prisma/browser";

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

    const exam = await prisma.exam.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        description: true,
        conductingBody: true,
        examType: true,
        eligibility: true,
        applicationFee: true,
        website: true,
        createdAt: true,
        updatedAt: true,
        colleges: {
          select: {
            id: true,
            year: true,
            category: true,
            gender: true,
            course: true,
            openingRank: true,
            closingRank: true,
            college: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: {
            year: "desc",
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...exam,
        applicationFee:
          exam.applicationFee !== null
            ? Number(exam.applicationFee)
            : null,
      },
    });
  } catch (error) {
    console.error("GET admin exam error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch exam",
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

    const existingExam = await prisma.exam.findUnique({
      where: { id },
    });

    if (!existingExam) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam not found",
        },
        { status: 404 }
      );
    }

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const slug =
      typeof body.slug === "string" ? body.slug.trim() : "";

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and slug are required",
        },
        { status: 400 }
      );
    }

    const duplicateSlug = await prisma.exam.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          success: false,
          error: "Another exam already uses this slug",
        },
        { status: 409 }
      );
    }

    let applicationFee = null;

    if (
      body.applicationFee !== null &&
      body.applicationFee !== undefined &&
      body.applicationFee !== ""
    ) {
      const parsedFee = Number(body.applicationFee);

      if (Number.isNaN(parsedFee) || parsedFee < 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Application fee must be a valid non-negative number",
          },
          { status: 400 }
        );
      }

      applicationFee = new Prisma.Decimal(parsedFee);
    }

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        name,
        slug,
        shortName:
          typeof body.shortName === "string"
            ? body.shortName.trim() || null
            : null,
        description:
          typeof body.description === "string"
            ? body.description.trim() || null
            : null,
        conductingBody:
          typeof body.conductingBody === "string"
            ? body.conductingBody.trim() || null
            : null,
        examType:
          typeof body.examType === "string"
            ? body.examType.trim() || null
            : null,
        eligibility:
          typeof body.eligibility === "string"
            ? body.eligibility.trim() || null
            : null,
        applicationFee,
        website:
          typeof body.website === "string"
            ? body.website.trim() || null
            : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...exam,
        applicationFee:
          exam.applicationFee !== null
            ? Number(exam.applicationFee)
            : null,
      },
    });
  } catch (error) {
    console.error("PUT admin exam error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update exam",
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

    const exam = await prisma.exam.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam not found",
        },
        { status: 404 }
      );
    }

    await prisma.exam.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("DELETE admin exam error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete exam",
      },
      { status: 500 }
    );
  }
}