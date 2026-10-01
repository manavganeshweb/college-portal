import { NextRequest, NextResponse } from "next/server";

import { registerUser } from "@/services/auth.service";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!name || !phone || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, phone, email and password are required.",
        },
        { status: 400 },
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name must contain at least 2 characters.",
        },
        { status: 400 },
      );
    }

    const phonePattern = /^[0-9+\-\s()]{7,20}$/;

    if (!phonePattern.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid phone number.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least 8 characters.",
        },
        { status: 400 },
      );
    }

    const { user, token } = await registerUser({
      name,
      phone,
      email,
      password,
    });

    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create account.";

    const status =
      message ===
      "An account with this email already exists."
        ? 409
        : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}