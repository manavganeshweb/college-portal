import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const courseSelect = {
  id: true,
  fees: true,
  seats: true,
  duration: true,
  createdAt: true,
  updatedAt: true,
  course: {
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      degree: true,
      level: true,
      status: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
} as const;

// GET /api/admin/colleges/[id]/courses
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id: collegeId } = await params;

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!college) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      );
    }

    const collegeCourses = await prisma.collegeCourse.findMany({
      where: {
        collegeId,
      },
      select: courseSelect,
      orderBy: {
        course: {
          name: "asc",
        },
      },
    });

    const courses = collegeCourses.map((item) => ({
      id: item.id,
      fees: item.fees !== null ? Number(item.fees) : null,
      seats: item.seats,
      duration: item.duration !== null ? Number(item.duration) : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      course: item.course,
    }));

    return NextResponse.json({
      success: true,
      college,
      courses,
      total: courses.length,
    });
  } catch (error) {
    console.error("GET college courses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch college courses",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/colleges/[id]/courses
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id: collegeId } = await params;

    const body = await request.json();

    const {
      courseId,
      fees = null,
      seats = null,
      duration = null,
    } = body;

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "courseId is required",
        },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: {
        id: true,
        name: true,
      },
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

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    if (course.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Only active courses can be added to a college",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.collegeCourse.findUnique({
      where: {
        collegeId_courseId: {
          collegeId,
          courseId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "This course is already associated with the college",
        },
        { status: 409 }
      );
    }

    let normalizedFees: number | null = null;
    let normalizedSeats: number | null = null;
    let normalizedDuration: number | null = null;

    if (fees !== null && fees !== "") {
      normalizedFees = Number(fees);

      if (!Number.isFinite(normalizedFees) || normalizedFees < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Fees must be a valid non-negative number",
          },
          { status: 400 }
        );
      }
    }

    if (seats !== null && seats !== "") {
      normalizedSeats = Number(seats);

      if (
        !Number.isInteger(normalizedSeats) ||
        normalizedSeats < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Seats must be a valid non-negative integer",
          },
          { status: 400 }
        );
      }
    }

    if (duration !== null && duration !== "") {
      normalizedDuration = Number(duration);

      if (!Number.isFinite(normalizedDuration) || normalizedDuration <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Duration must be greater than 0",
          },
          { status: 400 }
        );
      }
    }

    const collegeCourse = await prisma.collegeCourse.create({
      data: {
        collegeId,
        courseId,
        fees: normalizedFees,
        seats: normalizedSeats,
        duration: normalizedDuration,
      },
      select: courseSelect,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course added to college successfully",
        course: {
          ...collegeCourse,
          fees:
            collegeCourse.fees !== null
              ? Number(collegeCourse.fees)
              : null,
          duration:
            collegeCourse.duration !== null
              ? Number(collegeCourse.duration)
              : null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST college course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add course to college",
      },
      { status: 500 }
    );
  }
}