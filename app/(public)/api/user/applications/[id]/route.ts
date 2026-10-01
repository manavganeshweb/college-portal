import { NextRequest, NextResponse } from "next/server";
import {
  getSessionToken,
} from "@/lib/auth";
import {
  getUserBySessionToken,
} from "@/services/auth.service";
import {
  deleteUserApplication,
  getUserApplication,
  updateUserApplication,
} from "@/services/application.service";
import { UserApplicationStatus } from "@/src/generated/prisma/client";
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
const validStatuses = Object.values(UserApplicationStatus);

async function getAuthenticatedUser() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return getUserBySessionToken(token);
}

/* -------------------------------------------------- */
/* GET APPLICATION                                    */
/* -------------------------------------------------- */

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    const application =
      await getUserApplication(user.id, id);

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "GET USER APPLICATION ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve application.",
      },
      { status: 500 },
    );
  }
}

/* -------------------------------------------------- */
/* UPDATE APPLICATION                                 */
/* -------------------------------------------------- */

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
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const data: {
      status?: UserApplicationStatus;
      courseName?: string | null;
      notes?: string | null;
      appliedAt?: Date | null;
    } = {};

    if (body.status !== undefined) {
      if (
        typeof body.status !== "string" ||
        !validStatuses.includes(
          body.status as UserApplicationStatus,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid application status.",
          },
          { status: 400 },
        );
      }

      data.status =
        body.status as UserApplicationStatus;
    }

    if (body.courseName !== undefined) {
      data.courseName =
        typeof body.courseName === "string"
          ? body.courseName.trim() || null
          : null;
    }

    if (body.notes !== undefined) {
      data.notes =
        typeof body.notes === "string"
          ? body.notes.trim() || null
          : null;
    }

    if (body.appliedAt !== undefined) {
      if (
        body.appliedAt !== null &&
        typeof body.appliedAt !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid appliedAt value.",
          },
          { status: 400 },
        );
      }

      if (body.appliedAt === null) {
        data.appliedAt = null;
      } else {
        const parsedDate = new Date(
          body.appliedAt,
        );

        if (Number.isNaN(parsedDate.getTime())) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid appliedAt date.",
            },
            { status: 400 },
          );
        }

        data.appliedAt = parsedDate;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields provided for update.",
        },
        { status: 400 },
      );
    }

    const application =
      await updateUserApplication(
        user.id,
        id,
        data,
      );

    return NextResponse.json({
      success: true,
      message: "Application updated successfully.",
      application,
    });
  } catch (error) {
    console.error(
      "PATCH USER APPLICATION ERROR:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update application.";

    const status =
      message === "Application not found."
        ? 404
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

/* -------------------------------------------------- */
/* DELETE APPLICATION                                 */
/* -------------------------------------------------- */

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    await deleteUserApplication(user.id, id);

    return NextResponse.json({
      success: true,
      message: "Application removed successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE USER APPLICATION ERROR:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete application.";

    const status =
      message === "Application not found."
        ? 404
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