import { NextResponse } from "next/server";

import {
  getCollegeRankings,
  getHomepageBoardExams,
  getHomepageCourses,
  getLatestNews,
  getStudyAbroadDestinations,
  getTopStudyPlaces,
  getTopTenColleges,
} from "@/services/home.service";

export async function GET() {
  try {
    const [
      topColleges,
      rankings,
      studyPlaces,
      courses,
      boardExams,
      news,
      studyAbroad,
    ] = await Promise.all([
      getTopTenColleges(),
      getCollegeRankings(),
      getTopStudyPlaces(),
      getHomepageCourses(),
      getHomepageBoardExams(),
      getLatestNews(),
      getStudyAbroadDestinations(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        topColleges,
        rankings,
        studyPlaces,
        courses,
        boardExams,
        news,
        studyAbroad,
      },
    });
  } catch (error) {
    console.error("❌ Homepage API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch homepage data.",
      },
      {
        status: 500,
      },
    );
  }
}