import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type FacilityInput = {
  name: string;
  description?: string | null;
  available?: boolean;
  sortOrder?: number;
  isActive?: boolean;
};

type InfrastructureInput = {
  campusArea?: string | null;
  campusType?: string | null;
  description?: string | null;

  hostel?: boolean;
  library?: boolean;
  laboratories?: boolean;
  sports?: boolean;
  cafeteria?: boolean;
  auditorium?: boolean;
  medical?: boolean;
  wifi?: boolean;
  itInfrastructure?: boolean;
  transportation?: boolean;
  gym?: boolean;

  otherFacilities?: string | null;

  facilities?: FacilityInput[];
};

// ============================================================
// GET INFRASTRUCTURE
// ============================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collegeId } = await params;

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      );
    }

    const infrastructure = await prisma.infrastructure.findUnique({
      where: {
        collegeId,
      },
      include: {
        facilities: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      infrastructure,
    });
  } catch (error) {
    console.error("GET infrastructure error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch infrastructure",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT / UPDATE INFRASTRUCTURE
// ============================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collegeId } = await params;

    const body = (await request.json()) as InfrastructureInput;

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: "College not found",
        },
        { status: 404 }
      );
    }

    const facilities = Array.isArray(body.facilities)
      ? body.facilities
          .map((facility, index) => ({
            name: facility.name?.trim() ?? "",
            description: facility.description?.trim() || null,
            available: facility.available ?? true,
            sortOrder: facility.sortOrder ?? index + 1,
            isActive: facility.isActive ?? true,
          }))
          .filter((facility) => facility.name.length > 0)
      : [];

    const infrastructure = await prisma.$transaction(async (tx) => {
      const savedInfrastructure = await tx.infrastructure.upsert({
        where: {
          collegeId,
        },
        create: {
          collegeId,

          campusArea: body.campusArea?.trim() || null,
          campusType: body.campusType?.trim() || null,
          description: body.description?.trim() || null,

          hostel: body.hostel ?? false,
          library: body.library ?? false,
          laboratories: body.laboratories ?? false,
          sports: body.sports ?? false,
          cafeteria: body.cafeteria ?? false,
          auditorium: body.auditorium ?? false,
          medical: body.medical ?? false,
          wifi: body.wifi ?? false,
          itInfrastructure: body.itInfrastructure ?? false,
          transportation: body.transportation ?? false,
          gym: body.gym ?? false,

          otherFacilities: body.otherFacilities?.trim() || null,
        },
        update: {
          campusArea: body.campusArea?.trim() || null,
          campusType: body.campusType?.trim() || null,
          description: body.description?.trim() || null,

          hostel: body.hostel ?? false,
          library: body.library ?? false,
          laboratories: body.laboratories ?? false,
          sports: body.sports ?? false,
          cafeteria: body.cafeteria ?? false,
          auditorium: body.auditorium ?? false,
          medical: body.medical ?? false,
          wifi: body.wifi ?? false,
          itInfrastructure: body.itInfrastructure ?? false,
          transportation: body.transportation ?? false,
          gym: body.gym ?? false,

          otherFacilities: body.otherFacilities?.trim() || null,
        },
      });

      await tx.infrastructureFacility.deleteMany({
        where: {
          infrastructureId: savedInfrastructure.id,
        },
      });

      if (facilities.length > 0) {
        await tx.infrastructureFacility.createMany({
          data: facilities.map((facility, index) => ({
            infrastructureId: savedInfrastructure.id,
            name: facility.name,
            description: facility.description,
            available: facility.available,
            sortOrder: index + 1,
            isActive: facility.isActive,
          })),
        });
      }

      return tx.infrastructure.findUnique({
        where: {
          id: savedInfrastructure.id,
        },
        include: {
          facilities: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Infrastructure saved successfully",
      infrastructure,
    });
  } catch (error) {
    console.error("PUT infrastructure error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save infrastructure",
      },
      { status: 500 }
    );
  }
}