import { NextResponse } from "next/server";

import {
  getSessionToken,
} from "@/lib/auth";
import {
  getUserBySessionToken,
} from "@/services/auth.service";

export async function GET() {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null,
      });
    }

    const user = await getUserBySessionToken(token);

    if (!user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve session.",
      },
      { status: 500 },
    );
  }
}