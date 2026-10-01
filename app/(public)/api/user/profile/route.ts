import { NextRequest, NextResponse } from "next/server";

import { getSessionToken } from "@/lib/auth";
import {
  getUserBySessionToken,
} from "@/services/auth.service";
import {
  getUserProfile,
  updateUserProfile,
} from "@/services/user.service";

export async function GET() {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const user = await getUserBySessionToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const profile = await getUserProfile(user.id);

    if (!profile) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: profile,
    });
  } catch (error) {
    console.error("GET /api/user/profile error:", error);

    return NextResponse.json(
      { error: "Failed to fetch profile." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const user = await getUserBySessionToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = await request.json();

    console.log("PROFILE PATCH BODY:", body);

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : undefined;

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : undefined;

    const avatar =
      body.avatar === null
        ? null
        : typeof body.avatar === "string"
          ? body.avatar.trim()
          : undefined;

    console.log("PROFILE PATCH PARSED:", {
      userId: user.id,
      name,
      phone,
      avatar,
    });

    const updatedUser = await updateUserProfile(
      user.id,
      {
        name,
        phone,
        avatar,
      },
    );

    console.log("PROFILE UPDATED:", updatedUser);

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/user/profile error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update profile.";

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}