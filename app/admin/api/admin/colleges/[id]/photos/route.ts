import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PhotoInput = {
  id?: string;
  imageUrl?: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function normalizeOptionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value.trim() || null;
}

async function getAuthorizedCollege(collegeId: string) {
  const admin = await getAdminUser();

  if (!admin) {
    return { error: errorResponse("Admin access required.", 403) };
  }

  const college = await prisma.college.findUnique({
    where: { id: collegeId },
    select: { id: true },
  });

  if (!college) {
    return { error: errorResponse("College not found.", 404) };
  }

  return { college };
}

/**
 * GET /admin/api/admin/colleges/[id]/photos
 *
 * Returns gallery photos only.
 * Infrastructure photos are managed separately.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const authorization = await getAuthorizedCollege(id);

    if ("error" in authorization) {
      return authorization.error;
    }

    const photos = await prisma.collegePhoto.findMany({
      where: {
        collegeId: id,
        OR: [
          { category: null },
          { category: { not: "infrastructure" } },
        ],
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      photos,
    });
  } catch (error) {
    console.error("Failed to fetch college photos:", error);

    return errorResponse("Failed to fetch college photos.", 500);
  }
}

/**
 * PUT /admin/api/admin/colleges/[id]/photos
 *
 * Replaces gallery photos without touching infrastructure photos.
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const authorization = await getAuthorizedCollege(id);

    if ("error" in authorization) {
      return authorization.error;
    }

    const body: { photos?: PhotoInput[] } = await request.json();

    if (!Array.isArray(body.photos)) {
      return errorResponse("Photos must be provided as an array.", 400);
    }

    const photos = body.photos.map((photo, index) => ({
      collegeId: id,
      imageUrl:
        typeof photo.imageUrl === "string"
          ? photo.imageUrl.trim()
          : "",
      title: normalizeOptionalText(photo.title),
      description: normalizeOptionalText(photo.description),
      // Gallery photos use the "gallery" category.
   category:
  typeof photo.category === "string" &&
  photo.category.trim() &&
  photo.category.trim().toLowerCase() !== "infrastructure"
    ? photo.category.trim().toUpperCase()
    : "CAMPUS",
      sortOrder:
        typeof photo.sortOrder === "number" &&
        Number.isInteger(photo.sortOrder) &&
        photo.sortOrder >= 0
          ? photo.sortOrder
          : index,
      isActive:
        typeof photo.isActive === "boolean"
          ? photo.isActive
          : true,
    }));

    if (photos.some((photo) => !photo.imageUrl)) {
      return errorResponse(
        "Every gallery photo must have an image URL.",
        400,
      );
    }

    if (photos.length > 100) {
      return errorResponse(
        "You can save up to 100 gallery photos at a time.",
        400,
      );
    }

    await prisma.$transaction(async (tx) => {
      // Delete only gallery photos. Never delete infrastructure photos.
      await tx.collegePhoto.deleteMany({
        where: {
          collegeId: id,
          OR: [
            { category: null },
            { category: { not: "infrastructure" } },
          ],
        },
      });

      if (photos.length > 0) {
        await tx.collegePhoto.createMany({
          data: photos,
        });
      }
    });

    const savedPhotos = await prisma.collegePhoto.findMany({
      where: {
        collegeId: id,
        category: "gallery",
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Gallery photos saved successfully.",
      photos: savedPhotos,
    });
  } catch (error) {
    console.error("Failed to save college photos:", error);

    return errorResponse("Failed to save college photos.", 500);
  }
}