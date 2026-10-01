import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PhotoInput = {
  imageUrl: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collegeId } = await params;

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: {
        id: true,
      },
    });

    if (!college) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      );
    }

    const photos = await prisma.collegePhoto.findMany({
      where: {
        collegeId,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      photos,
    });
  } catch (error) {
    console.error("GET college photos error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch college photos",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collegeId } = await params;

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: {
        id: true,
      },
    });

    if (!college) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as {
      photos?: PhotoInput[];
    };

    if (!Array.isArray(body.photos)) {
      return NextResponse.json(
        {
          success: false,
          message: "photos must be an array",
        },
        { status: 400 }
      );
    }

    const photos = body.photos
      .filter((photo) => photo.imageUrl?.trim())
      .map((photo, index) => ({
        imageUrl: photo.imageUrl.trim(),
        title: photo.title?.trim() || null,
        description: photo.description?.trim() || null,
        category: photo.category?.trim() || null,
        sortOrder: index + 1,
        isActive: photo.isActive ?? true,
      }));

    const savedPhotos = await prisma.$transaction(async (tx) => {
      await tx.collegePhoto.deleteMany({
        where: {
          collegeId,
        },
      });

      if (photos.length > 0) {
        await tx.collegePhoto.createMany({
          data: photos.map((photo) => ({
            collegeId,
            ...photo,
          })),
        });
      }

      return tx.collegePhoto.findMany({
        where: {
          collegeId,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "College photos saved successfully",
      photos: savedPhotos,
    });
  } catch (error) {
    console.error("PUT college photos error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save college photos",
      },
      { status: 500 }
    );
  }
}