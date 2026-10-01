import { NextRequest, NextResponse } from "next/server";

import { getCollegesForComparison } from "@/services/college.service";

export async function GET(request: NextRequest) {
  try {
    const idsParam = request.nextUrl.searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        {
          success: false,
          message: "College IDs are required.",
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
          message: "At least 3 colleges are required for comparison.",
        },
        { status: 400 }
      );
    }

    if (ids.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message: "You can compare a maximum of 4 colleges.",
        },
        { status: 400 }
      );
    }

    const uniqueIds = [...new Set(ids)];

    if (uniqueIds.length !== ids.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate colleges are not allowed.",
        },
        { status: 400 }
      );
    }

    const colleges = await getCollegesForComparison(uniqueIds);

    if (colleges.length !== uniqueIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more selected colleges could not be found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    console.error("College comparison API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load colleges for comparison.",
      },
      { status: 500 }
    );
  }
}