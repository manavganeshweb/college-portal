import { NextRequest, NextResponse } from "next/server";
import {
  deleteAdminCollegeReview,
  updateAdminCollegeReview,
} from "@/services/review.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/* -------------------------------------------------- */
/* UPDATE REVIEW                                      */
/* -------------------------------------------------- */

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id: collegeId } = await context.params;

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          error: "College ID is required.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const reviewId =
      typeof body.reviewId === "string"
        ? body.reviewId.trim()
        : "";

    const isPublished = body.isPublished;

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          error: "Review ID is required.",
        },
        { status: 400 },
      );
    }

    if (typeof isPublished !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "isPublished must be a boolean.",
        },
        { status: 400 },
      );
    }

    const review = await updateAdminCollegeReview({
      collegeId,
      reviewId,
      isPublished,
    });

    return NextResponse.json({
      success: true,
      message: isPublished
        ? "Review approved successfully."
        : "Review unpublished successfully.",
      data: review,
    });
  } catch (error) {
    console.error("PATCH ADMIN COLLEGE REVIEW ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update review.",
      },
      { status: 500 },
    );
  }
}

/* -------------------------------------------------- */
/* DELETE REVIEW                                      */
/* -------------------------------------------------- */

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id: collegeId } = await context.params;

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          error: "College ID is required.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const reviewId =
      typeof body.reviewId === "string"
        ? body.reviewId.trim()
        : "";

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          error: "Review ID is required.",
        },
        { status: 400 },
      );
    }

    await deleteAdminCollegeReview({
      collegeId,
      reviewId,
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ADMIN COLLEGE REVIEW ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete review.",
      },
      { status: 500 },
    );
  }
}