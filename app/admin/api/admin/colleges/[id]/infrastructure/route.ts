import { NextRequest, NextResponse } from "next/server";

import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type FacilityInput = {
  id?: string;
  name: string;
  description?: string | null;
  available?: boolean;
  sortOrder?: number;
  isActive?: boolean;
};

type InfrastructurePhotoInput = {
  imageUrl: string;
  title?: string | null;
  description?: string | null;
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
  infrastructurePhotos?: InfrastructurePhotoInput[];
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim() || null;
}

function normalizeBoolean(
  value: unknown,
  fallback = false
): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/**
 * Validate that an image URL uses HTTP or HTTPS.
 */
function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

// ============================================================
// GET INFRASTRUCTURE
// ============================================================

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return errorResponse("Admin access required.", 403);
    }

    const { id: collegeId } = await params;

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true },
    });

    if (!college) {
      return errorResponse("College not found.", 404);
    }

    const [infrastructure, infrastructurePhotos] =
      await Promise.all([
        prisma.infrastructure.findUnique({
          where: { collegeId },
          include: {
            facilities: {
              orderBy: { sortOrder: "asc" },
            },
          },
        }),

        prisma.collegePhoto.findMany({
          where: {
            collegeId,
            category: "infrastructure",
          },
          orderBy: {
            sortOrder: "asc",
          },
        }),
      ]);

    return NextResponse.json({
      success: true,
      infrastructure,
      infrastructurePhotos,
    });
  } catch (error) {
    console.error("GET infrastructure error:", error);

    return errorResponse(
      "Failed to fetch infrastructure.",
      500
    );
  }
}

// ============================================================
// PUT / UPDATE INFRASTRUCTURE, FACILITIES AND PHOTOS
// ============================================================

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // --------------------------------------------------------
    // 1. Authorization
    // --------------------------------------------------------

    const admin = await getAdminUser();

    if (!admin) {
      return errorResponse("Admin access required.", 403);
    }

    const { id: collegeId } = await params;

    // --------------------------------------------------------
    // 2. Parse request body
    // --------------------------------------------------------

    let body: InfrastructureInput;

    try {
      body = (await request.json()) as InfrastructureInput;
    } catch {
      return errorResponse(
        "Invalid JSON request body.",
        400
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return errorResponse(
        "Invalid infrastructure data.",
        400
      );
    }

    // --------------------------------------------------------
    // 3. Validate college
    // --------------------------------------------------------

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true },
    });

    if (!college) {
      return errorResponse("College not found.", 404);
    }

    // --------------------------------------------------------
    // 4. Validate custom facilities
    // --------------------------------------------------------

    if (
      body.facilities !== undefined &&
      !Array.isArray(body.facilities)
    ) {
      return errorResponse(
        "Facilities must be provided as an array.",
        400
      );
    }

    const facilityInputs = body.facilities ?? [];

    if (facilityInputs.length > 200) {
      return errorResponse(
        "A maximum of 200 custom facilities is allowed.",
        400
      );
    }

    for (const facility of facilityInputs) {
      if (
        !facility ||
        typeof facility !== "object" ||
        typeof facility.name !== "string"
      ) {
        return errorResponse(
          "Each facility must have a valid name.",
          400
        );
      }

      if (
        facility.description !== undefined &&
        facility.description !== null &&
        typeof facility.description !== "string"
      ) {
        return errorResponse(
          "Facility descriptions must be text.",
          400
        );
      }
    }

    const facilities = facilityInputs
      .map((facility, index) => ({
        name: facility.name.trim(),
        description: normalizeText(facility.description),
        available: normalizeBoolean(
          facility.available,
          true
        ),
        sortOrder: index + 1,
        isActive: normalizeBoolean(
          facility.isActive,
          true
        ),
      }))
      .filter((facility) => facility.name.length > 0);

    // --------------------------------------------------------
    // 5. Validate infrastructure photos, if supplied
    // --------------------------------------------------------

    if (
      body.infrastructurePhotos !== undefined &&
      !Array.isArray(body.infrastructurePhotos)
    ) {
      return errorResponse(
        "Infrastructure photos must be provided as an array.",
        400
      );
    }

    const photoInputs = body.infrastructurePhotos;

    if (photoInputs && photoInputs.length > 100) {
      return errorResponse(
        "A maximum of 100 infrastructure photos is allowed.",
        400
      );
    }

    if (photoInputs !== undefined) {
      for (const photo of photoInputs) {
        if (
          !photo ||
          typeof photo !== "object" ||
          !isValidImageUrl(photo.imageUrl)
        ) {
          return errorResponse(
            "Every infrastructure photo must have a valid HTTP or HTTPS image URL.",
            400
          );
        }

        if (
          photo.title !== undefined &&
          photo.title !== null &&
          typeof photo.title !== "string"
        ) {
          return errorResponse(
            "Photo titles must be text.",
            400
          );
        }

        if (
          photo.description !== undefined &&
          photo.description !== null &&
          typeof photo.description !== "string"
        ) {
          return errorResponse(
            "Photo descriptions must be text.",
            400
          );
        }

        if (
          typeof photo.title === "string" &&
          photo.title.length > 200
        ) {
          return errorResponse(
            "Photo titles cannot exceed 200 characters.",
            400
          );
        }

        if (
          typeof photo.description === "string" &&
          photo.description.length > 1000
        ) {
          return errorResponse(
            "Photo descriptions cannot exceed 1000 characters.",
            400
          );
        }

        if (
          photo.isActive !== undefined &&
          typeof photo.isActive !== "boolean"
        ) {
          return errorResponse(
            "Photo active status must be a boolean.",
            400
          );
        }
      }
    }

    // --------------------------------------------------------
    // 6. Save everything in one transaction
    // --------------------------------------------------------

    const result = await prisma.$transaction(async (tx) => {
      // ------------------------------------------------------
      // Save campus information
      // ------------------------------------------------------

      const savedInfrastructure =
        await tx.infrastructure.upsert({
          where: {
            collegeId,
          },

          create: {
            collegeId,

            campusArea: normalizeText(body.campusArea),
            campusType: normalizeText(body.campusType),
            description: normalizeText(body.description),

            hostel: normalizeBoolean(body.hostel),
            library: normalizeBoolean(body.library),
            laboratories: normalizeBoolean(
              body.laboratories
            ),
            sports: normalizeBoolean(body.sports),
            cafeteria: normalizeBoolean(body.cafeteria),
            auditorium: normalizeBoolean(body.auditorium),
            medical: normalizeBoolean(body.medical),
            wifi: normalizeBoolean(body.wifi),
            itInfrastructure: normalizeBoolean(
              body.itInfrastructure
            ),
            transportation: normalizeBoolean(
              body.transportation
            ),
            gym: normalizeBoolean(body.gym),

            otherFacilities: normalizeText(
              body.otherFacilities
            ),
          },

          update: {
            campusArea: normalizeText(body.campusArea),
            campusType: normalizeText(body.campusType),
            description: normalizeText(body.description),

            hostel: normalizeBoolean(body.hostel),
            library: normalizeBoolean(body.library),
            laboratories: normalizeBoolean(
              body.laboratories
            ),
            sports: normalizeBoolean(body.sports),
            cafeteria: normalizeBoolean(body.cafeteria),
            auditorium: normalizeBoolean(body.auditorium),
            medical: normalizeBoolean(body.medical),
            wifi: normalizeBoolean(body.wifi),
            itInfrastructure: normalizeBoolean(
              body.itInfrastructure
            ),
            transportation: normalizeBoolean(
              body.transportation
            ),
            gym: normalizeBoolean(body.gym),

            otherFacilities: normalizeText(
              body.otherFacilities
            ),
          },
        });

      // ------------------------------------------------------
      // Save custom facilities only when provided
      // ------------------------------------------------------

      if (body.facilities !== undefined) {
        await tx.infrastructureFacility.deleteMany({
          where: {
            infrastructureId: savedInfrastructure.id,
          },
        });

        if (facilities.length > 0) {
          await tx.infrastructureFacility.createMany({
            data: facilities.map((facility) => ({
              infrastructureId: savedInfrastructure.id,
              ...facility,
            })),
          });
        }
      }

      // ------------------------------------------------------
      // Save infrastructure photos only when provided
      //
      // This is intentionally separate from the regular
      // college gallery, which uses other categories.
      // ------------------------------------------------------

      if (photoInputs !== undefined) {
        await tx.collegePhoto.deleteMany({
          where: {
            collegeId,
            category: "infrastructure",
          },
        });

        if (photoInputs.length > 0) {
          await tx.collegePhoto.createMany({
            data: photoInputs.map((photo, index) => ({
              collegeId,

              imageUrl: photo.imageUrl.trim(),

              title: normalizeText(photo.title),

              description: normalizeText(
                photo.description
              ),

              category: "infrastructure",

              sortOrder: index + 1,

              isActive: normalizeBoolean(
                photo.isActive,
                true
              ),
            })),
          });
        }
      }

      // ------------------------------------------------------
      // Return the saved records
      // ------------------------------------------------------

      const [
        updatedInfrastructure,
        updatedInfrastructurePhotos,
      ] = await Promise.all([
        tx.infrastructure.findUnique({
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
        }),

        tx.collegePhoto.findMany({
          where: {
            collegeId,
            category: "infrastructure",
          },
          orderBy: {
            sortOrder: "asc",
          },
        }),
      ]);

      return {
        infrastructure: updatedInfrastructure,
        infrastructurePhotos: updatedInfrastructurePhotos,
      };
    });

    // --------------------------------------------------------
    // 7. Success response
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Infrastructure and photos saved successfully.",
      infrastructure: result.infrastructure,
      infrastructurePhotos: result.infrastructurePhotos,
    });
  } catch (error) {
    console.error("PUT infrastructure error:", error);

    return errorResponse(
      "Failed to save infrastructure.",
      500
    );
  }
}