import { NextRequest, NextResponse } from "next/server";

import { getSessionToken } from "@/lib/auth";
import { getUserBySessionToken } from "@/services/auth.service";
import {
  createUserApplication,
  getUserApplications,
} from "@/services/application.service";

async function getAuthenticatedUser() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return getUserBySessionToken(token);
}

/* -------------------------------------------------- */
/* GET USER APPLICATIONS                              */
/* -------------------------------------------------- */

export async function GET() {
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

    const applications = await getUserApplications(user.id);

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(
      "GET USER APPLICATIONS ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve applications.",
      },
      { status: 500 },
    );
  }
}

/* -------------------------------------------------- */
/* CREATE APPLICATION                                 */
/* -------------------------------------------------- */

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

    const phoneNumber =
      typeof body.phoneNumber === "string"
        ? body.phoneNumber.trim()
        : "";

    const courseName =
      typeof body.courseName === "string"
        ? body.courseName.trim()
        : undefined;

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : undefined;

    if (!collegeId) {
      return NextResponse.json(
        {
          success: false,
          message: "College ID is required.",
        },
        { status: 400 },
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required.",
        },
        { status: 400 },
      );
    }

    const application = await createUserApplication({
      userId: user.id,
      collegeId,
      phoneNumber,
      courseName,
      notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: "College added to your applications.",
        application,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "CREATE USER APPLICATION ERROR:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create application.";

    let status = 500;

    if (
      message === "College not found." ||
      message ===
        "You have already added this college to your applications."
    ) {
      status = 400;
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}