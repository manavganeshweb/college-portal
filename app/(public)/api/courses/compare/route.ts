import { NextRequest, NextResponse } from "next/server";

import { getCoursesForComparison } from "@/services/course.service";

export async function GET(request: NextRequest) {
  try {
    const idsParam = request.nextUrl.searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        {
          success: false,
          message: "Course IDs are required.",
        },
        { status: 400 }
      );
    }

    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least 3 courses are required for comparison.",
        },
        { status: 400 }
      );
    }

    if (ids.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can compare a maximum of 4 courses.",
        },
        { status: 400 }
      );
    }

    const uniqueIds = [...new Set(ids)];

    if (uniqueIds.length !== ids.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate courses are not allowed.",
        },
        { status: 400 }
      );
    }

    const courses = await getCoursesForComparison(
      uniqueIds
    );

    if (courses.length !== uniqueIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more selected courses could not be found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error(
      "Course comparison API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load courses for comparison.",
      },
      { status: 500 }
    );
  }
}