import { NextRequest, NextResponse } from "next/server";
import {
  getSessionToken,
} from "@/lib/auth";
import {
  getUserBySessionToken,
} from "@/services/auth.service";
import {
  addCollegeToShortlist,
  getUserShortlistedColleges,
  removeCollegeFromShortlist,
  isCollegeShortlisted,
} from "@/services/shortlist.service";
async function getAuthenticatedUser() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return getUserBySessionToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId")?.trim();

    if (collegeId) {
      const shortlisted = await isCollegeShortlisted(
        user.id,
        collegeId,
      );

      return NextResponse.json({
        success: true,
        shortlisted,
      });
    }

    const shortlists = await getUserShortlistedColleges(
      user.id,
    );

    return NextResponse.json({
      success: true,
      shortlists,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve shortlist.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const collegeId =
      typeof body.collegeId === "string"
        ? body.collegeId.trim()
        : "";

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required.",
        },
        { status: 400 },
      );
    }

    const shortlist = await addCollegeToShortlist(
      user.id,
      collegeId,
    );

    return NextResponse.json({
      success: true,
      message: "College added to shortlist.",
      shortlist,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to add college to shortlist.";

    const status =
      message === "College not found." ? 404 : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const collegeId =
      typeof body.collegeId === "string"
        ? body.collegeId.trim()
        : "";

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required.",
        },
        { status: 400 },
      );
    }

    await removeCollegeFromShortlist(
      user.id,
      collegeId,
    );

    return NextResponse.json({
      success: true,
      message: "College removed from shortlist.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to remove college from shortlist.",
      },
      { status: 500 },
    );
  }
}