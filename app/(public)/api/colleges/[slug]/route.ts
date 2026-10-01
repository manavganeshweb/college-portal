import { NextRequest, NextResponse } from "next/server";
import { getCollegeBySlug } from "@/services/college.service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "College slug is required",
        },
        { status: 400 }
      );
    }

    const college = await getCollegeBySlug(slug);

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: college,
    });
  } catch (error) {
    console.error("GET /api/colleges/[slug] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch college",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}