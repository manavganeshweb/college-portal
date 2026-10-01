import { NextRequest, NextResponse } from "next/server";
import { getColleges } from "@/services/college.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const stateId = searchParams.get("stateId") || undefined;
    const cityId = searchParams.get("cityId") || undefined;
    const collegeType =
      searchParams.get("collegeType") || undefined;

    const verifiedParam = searchParams.get("verified");

    const verified =
      verifiedParam === "true"
        ? true
        : verifiedParam === "false"
          ? false
          : undefined;

    const pageParam = Number(
      searchParams.get("page") || "1"
    );

    const limitParam = Number(
      searchParams.get("limit") || "12"
    );

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const limit =
      Number.isInteger(limitParam) && limitParam > 0
        ? Math.min(limitParam, 50)
        : 12;

    const result = await getColleges({
      search,
      state: stateId,
      city: cityId,
      collegeType,
      verified,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET /api/colleges error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch colleges",
      },
      { status: 500 }
    );
  }
}