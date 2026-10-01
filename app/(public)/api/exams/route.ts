import { NextRequest, NextResponse } from "next/server";

import { getExams } from "@/services/exam.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const conductingBody =
      searchParams.get("conductingBody") || undefined;

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "12");

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const limit =
      Number.isInteger(limitParam) && limitParam > 0
        ? Math.min(limitParam, 50)
        : 12;

    const result = await getExams({
      search,
      conductingBody,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET /api/exams error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch exams",
      },
      {
        status: 500,
      }
    );
  }
}