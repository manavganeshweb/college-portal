import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const examId = searchParams.get("examId");
    const collegeId = searchParams.get("collegeId");

    if (!examId && !collegeId) {
      return NextResponse.json(
        {
          success: false,
          error: "examId or collegeId is required",
        },
        { status: 400 }
      );
    }

    const cutoffs = await prisma.collegeCutoff.findMany({
      where: {
        ...(examId ? { examId } : {}),
        ...(collegeId ? { collegeId } : {}),
      },
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
      orderBy: [
        {
          year: "desc",
        },
        {
          closingRank: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: cutoffs,
    });
  } catch (error) {
    console.error("GET exam cutoffs error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cutoff records",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const examId =
      typeof body.examId === "string" ? body.examId.trim() : "";

    const collegeId =
      typeof body.collegeId === "string"
        ? body.collegeId.trim()
        : "";

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

    if (!examId || !collegeId || !year) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam, college and year are required",
        },
        { status: 400 }
      );
    }

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
          error: "Opening rank must be a valid non-negative number",
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
          error: "Closing rank must be a valid non-negative number",
        },
        { status: 400 }
      );
    }

    const [exam, college] = await Promise.all([
      prisma.exam.findUnique({
        where: { id: examId },
        select: { id: true },
      }),
      prisma.college.findUnique({
        where: { id: collegeId },
        select: { id: true },
      }),
    ]);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          error: "Exam not found",
        },
        { status: 404 }
      );
    }

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          error: "College not found",
        },
        { status: 404 }
      );
    }

    const existing = await prisma.collegeCutoff.findFirst({
      where: {
        examId,
        collegeId,
        year,
        category: category || null,
        gender: gender || null,
        course: course || null,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "This cutoff record already exists",
        },
        { status: 409 }
      );
    }

    const cutoff = await prisma.collegeCutoff.create({
      data: {
        examId,
        collegeId,
        year,
        category: category || null,
        gender: gender || null,
        course: course || null,
        openingRank,
        closingRank,
      },
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: cutoff,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST exam cutoff error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create cutoff record",
      },
      { status: 500 }
    );
  }
}