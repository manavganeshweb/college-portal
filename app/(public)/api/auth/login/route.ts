import { NextRequest, NextResponse } from "next/server";

import { loginUser } from "@/services/auth.service";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    const { user, token } = await loginUser({
      email,
      password,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to login.";

    const status =
      message === "Invalid email or password." ? 401 : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}