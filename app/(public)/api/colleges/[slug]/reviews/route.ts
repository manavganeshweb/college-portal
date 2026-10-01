import { NextRequest, NextResponse } from "next/server";
import {
  getSessionToken,
} from "@/lib/auth";
import {
  getUserBySessionToken,
} from "@/services/auth.service";
import {
  createCollegeReview,
  deleteCollegeReview,
  getCollegeIdBySlug,
  getCollegeReviews,
  getUserCollegeReview,
  updateCollegeReview,
} from "@/services/review.service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};
async function getAuthenticatedUser() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return getUserBySessionToken(token);
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  const { slug } = await context.params;

  const collegeId = await getCollegeIdBySlug(slug);

  if (!collegeId) {
    return NextResponse.json(
      {
        success: false,
        message: "College not found.",
      },
      { status: 404 },
    );
  }

  const reviews = await getCollegeReviews(collegeId);

  return NextResponse.json({
    success: true,
    reviews,
  });
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Login required.",
        },
        { status: 401 },
      );
    }

    const { slug } = await context.params;
    const body = await request.json();

    const collegeId = await getCollegeIdBySlug(slug);

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found.",
        },
        { status: 404 },
      );
    }

    const review = await createCollegeReview({
      userId: user.id,
      collegeId,
      rating: Number(body.rating),
      title:
        typeof body.title === "string"
          ? body.title
          : "",
      content:
        typeof body.content === "string"
          ? body.content
          : "",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Review submitted and is awaiting moderation.",
        review,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to submit review.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Login required.",
        },
        { status: 401 },
      );
    }

 const { slug } = await context.params;
const body = await request.json();

const collegeId = await getCollegeIdBySlug(slug);

if (!collegeId) {
  return NextResponse.json(
    {
      success: false,
      message: "College not found.",
    },
    { status: 404 },
  );
}
    const reviewId =
      typeof body.reviewId === "string"
        ? body.reviewId
        : "";

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          message: "Review ID is required.",
        },
        { status: 400 },
      );
    }

    const existingReview =
      await getUserCollegeReview(
        user.id,
        collegeId,
      );

    if (
      !existingReview ||
      existingReview.id !== reviewId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        { status: 404 },
      );
    }

    const review = await updateCollegeReview(
      user.id,
      reviewId,
      {
        rating:
          body.rating !== undefined
            ? Number(body.rating)
            : undefined,
        title:
          typeof body.title === "string"
            ? body.title
            : undefined,
        content:
          typeof body.content === "string"
            ? body.content
            : undefined,
      },
    );

    return NextResponse.json({
      success: true,
      message:
        "Review updated and sent for moderation.",
      review,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update review.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Login required.",
        },
        { status: 401 },
      );
    }

  const { slug } = await context.params;

const collegeId = await getCollegeIdBySlug(slug);

if (!collegeId) {
  return NextResponse.json(
    {
      success: false,
      message: "College not found.",
    },
    { status: 404 },
  );
}

const reviewId =
  new URL(request.url).searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          message: "Review ID is required.",
        },
        { status: 400 },
      );
    }

    const existingReview =
      await getUserCollegeReview(
        user.id,
        collegeId,
      );

    if (
      !existingReview ||
      existingReview.id !== reviewId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        { status: 404 },
      );
    }

    await deleteCollegeReview(
      user.id,
      reviewId,
    );

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete review.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}