import { NextRequest, NextResponse } from "next/server";

import { predictColleges } from "@/services/predictor.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const examId = String(body.examId || "");
    const rank = Number(body.rank);
    const category = String(body.category || "");
    const gender = body.gender
      ? String(body.gender)
      : undefined;
    const course = body.course
      ? String(body.course)
      : undefined;

    if (!examId || !category || !Number.isInteger(rank) || rank <= 0) {
      return NextResponse.json(
        {
          message:
            "Please provide a valid exam, rank and category.",
        },
        { status: 400 }
      );
    }

    const results = await predictColleges({
      examId,
      rank,
      category,
      gender: gender as
        | "MALE"
        | "FEMALE"
        | "OTHER"
        | undefined,
      course,
    });

    return NextResponse.json({
      results,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to generate predictions.",
      },
      { status: 500 }
    );
  }
}