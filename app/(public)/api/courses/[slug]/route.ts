import { NextRequest, NextResponse } from "next/server";
import { getCourseBySlug } from "@/services/course.service";

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
          message: "Course slug is required",
        },
        { status: 400 }
      );
    }

    const course = await getCourseBySlug(slug);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("GET /api/courses/[slug] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch course",
      },
      { status: 500 }
    );
  }
}