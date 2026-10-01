import { prisma } from "@/lib/prisma";
import type { UserApplicationStatus } from "@/src/generated/prisma/client";
type CreateApplicationInput = {
  userId: string;
  collegeId: string;
  phoneNumber: string;
  courseName?: string;
  notes?: string;
};

type UpdateApplicationInput = {
  status?: UserApplicationStatus;
  courseName?: string | null;
  notes?: string | null;
  appliedAt?: Date | null;
};
export async function createUserApplication(
  input: CreateApplicationInput
) {
  const college = await prisma.college.findUnique({
    where: {
      id: input.collegeId,
    },
    select: {
      id: true,
    },
  });

  if (!college) {
    throw new Error("College not found.");
  }

  const existingApplication = await prisma.userApplication.findUnique({
    where: {
      userId_collegeId: {
        userId: input.userId,
        collegeId: input.collegeId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingApplication) {
    throw new Error("You have already added this college to your applications.");
  }

  return prisma.userApplication.create({
data: {
  userId: input.userId,
  collegeId: input.collegeId,
  phoneNumber: input.phoneNumber.trim(),
  courseName: input.courseName?.trim() || null,
  notes: input.notes?.trim() || null,
},
    select: {
      id: true,
      collegeId: true,
      status: true,
      courseName: true,
      notes: true,
      appliedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserApplications(userId: string) {
  return prisma.userApplication.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      collegeId: true,
      status: true,
      courseName: true,
      notes: true,
      appliedAt: true,
      createdAt: true,
      updatedAt: true,

      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          logo: true,
          coverImage: true,
          collegeType: true,
          verified: true,
          status: true,

          city: {
            select: {
              name: true,
              state: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getUserApplication(
  userId: string,
  applicationId: string
) {
  return prisma.userApplication.findFirst({
    where: {
      id: applicationId,
      userId,
    },
    select: {
      id: true,
      collegeId: true,
      status: true,
      courseName: true,
      notes: true,
      appliedAt: true,
      createdAt: true,
      updatedAt: true,

      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          logo: true,
          coverImage: true,
          collegeType: true,
          verified: true,
          status: true,

          city: {
            select: {
              name: true,
              state: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function updateUserApplication(
  userId: string,
  applicationId: string,
  input: UpdateApplicationInput
) {
  const existingApplication = await prisma.userApplication.findFirst({
    where: {
      id: applicationId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingApplication) {
    throw new Error("Application not found.");
  }

  return prisma.userApplication.update({
    where: {
      id: applicationId,
    },
    data: {
      ...(input.status !== undefined && {
        status: input.status,
      }),

      ...(input.courseName !== undefined && {
        courseName: input.courseName?.trim() || null,
      }),

      ...(input.notes !== undefined && {
        notes: input.notes?.trim() || null,
      }),

      ...(input.appliedAt !== undefined && {
        appliedAt: input.appliedAt,
      }),
    },
    select: {
      id: true,
      collegeId: true,
      status: true,
      courseName: true,
      notes: true,
      appliedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
export async function deleteUserApplication(
  userId: string,
  applicationId: string
) {
  const result = await prisma.userApplication.deleteMany({
    where: {
      id: applicationId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new Error("Application not found.");
  }
}

export async function isCollegeApplied(
  userId: string,
  collegeId: string
) {
  const application = await prisma.userApplication.findUnique({
    where: {
      userId_collegeId: {
        userId,
        collegeId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(application);
}