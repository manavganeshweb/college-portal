import { NextResponse } from "next/server";

import {
  clearSessionCookie,
  getSessionToken,
} from "@/lib/auth";
import { deleteSession } from "@/services/auth.service";

export async function POST() {
  try {
    const token = await getSessionToken();

    if (token) {
      await deleteSession(token);
    }

    await clearSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to logout.",
      },
      { status: 500 },
    );
  }
}