import { NextRequest, NextResponse } from "next/server";

import { getExamBySlug } from "@/services/exam.service";

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
          message: "Exam slug is required",
        },
        {
          status: 400,
        }
      );
    }

    const exam = await getExamBySlug(slug);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error("GET /api/exams/[slug] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch exam",
      },
      {
        status: 500,
      }
    );
  }
}