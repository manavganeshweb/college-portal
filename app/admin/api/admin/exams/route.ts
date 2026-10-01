import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeExam(exam: {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  description: string | null;
  conductingBody: string | null;
  examType: string | null;
  eligibility: string | null;
  applicationFee: unknown;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...exam,
    applicationFee:
      exam.applicationFee !== null
        ? Number(exam.applicationFee)
        : null,
    createdAt: exam.createdAt.toISOString(),
    updatedAt: exam.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const conductingBody =
      searchParams.get("conductingBody")?.trim() || "";

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "12");

    const page = Number.isFinite(pageParam)
      ? Math.max(1, Math.floor(pageParam))
      : 1;

    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(1, Math.floor(limitParam)), 50)
      : 12;

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
            ],
          }
        : {}),

      ...(conductingBody
        ? {
            conductingBody: {
              contains: conductingBody,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
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
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      }),

      prisma.exam.count({
        where,
      }),
    ]);

    const data = exams.map(serializeExam);

    return NextResponse.json({
      success: true,
      data,
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
    console.error("GET admin exams error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch exams",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const slug =
      typeof body.slug === "string" ? body.slug.trim() : "";

    const shortName =
      typeof body.shortName === "string"
        ? body.shortName.trim()
        : null;

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const conductingBody =
      typeof body.conductingBody === "string"
        ? body.conductingBody.trim()
        : null;

    const examType =
      typeof body.examType === "string"
        ? body.examType.trim()
        : null;

    const eligibility =
      typeof body.eligibility === "string"
        ? body.eligibility.trim()
        : null;

    const website =
      typeof body.website === "string"
        ? body.website.trim()
        : null;

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and slug are required",
        },
        { status: 400 }
      );
    }

    const existingExam = await prisma.exam.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingExam) {
      return NextResponse.json(
        {
          success: false,
          message: "An exam with this slug already exists",
        },
        { status: 409 }
      );
    }

    let applicationFee: number | null = null;

    if (
      body.applicationFee !== null &&
      body.applicationFee !== undefined &&
      body.applicationFee !== ""
    ) {
      const parsedFee = Number(body.applicationFee);

      if (!Number.isFinite(parsedFee) || parsedFee < 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Application fee must be a valid non-negative number",
          },
          { status: 400 }
        );
      }

      applicationFee = parsedFee;
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        slug,
        shortName,
        description,
        conductingBody,
        examType,
        eligibility,
        applicationFee,
        website,
      },
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Exam created successfully",
        data: serializeExam(exam),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST admin exam error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create exam",
      },
      { status: 500 }
    );
  }
}