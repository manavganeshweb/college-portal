import { NextRequest, NextResponse } from "next/server";

import { setSessionCookie } from "@/lib/auth";
import { loginAdmin } from "@/services/auth.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    const result = await loginAdmin({
      email,
      password,
    });

    await setSessionCookie(result.token);

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to login.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 401 },
    );
  }
}