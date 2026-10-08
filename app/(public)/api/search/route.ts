import { NextRequest, NextResponse } from "next/server";
import { getColleges } from "@/services/college.service";
import { getCourses } from "@/services/course.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim() ?? "";

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          colleges: [],
          courses: [],
        },
      });
    }

    const [collegeResult, courseResult] = await Promise.all([
      getColleges({
        search: query,
        page: 1,
        limit: 5,
      }),

      getCourses({
        search: query,
        page: 1,
        limit: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        colleges: collegeResult.data,
        courses: courseResult.courses,
      },
    });
  } catch (error) {
    console.error("GET /api/search error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to perform search",
      },
      { status: 500 },
    );
  }
}