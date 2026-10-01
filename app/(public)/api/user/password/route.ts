import { NextRequest, NextResponse } from "next/server";
import {
  getSessionToken,
} from "@/lib/auth";
import {
  getUserBySessionToken,
} from "@/services/auth.service";
import {
  changeUserPassword,
} from "@/services/user.service";

async function getAuthenticatedUser() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return getUserBySessionToken(token);
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current and new passwords are required.",
        },
        { status: 400 },
      );
    }

    await changeUserPassword(
      user.id,
      currentPassword,
      newPassword,
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to change password.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}