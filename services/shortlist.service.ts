import { prisma } from "@/lib/prisma";

export async function addCollegeToShortlist(
  userId: string,
  collegeId: string,
) {
  const college = await prisma.college.findUnique({
    where: {
      id: collegeId,
    },
    select: {
      id: true,
    },
  });

  if (!college) {
    throw new Error("College not found.");
  }

  return prisma.userShortlist.upsert({
    where: {
      userId_collegeId: {
        userId,
        collegeId,
      },
    },
    update: {},
    create: {
      userId,
      collegeId,
    },
    select: {
      id: true,
      collegeId: true,
      createdAt: true,
    },
  });
}

export async function removeCollegeFromShortlist(
  userId: string,
  collegeId: string,
) {
  await prisma.userShortlist.deleteMany({
    where: {
      userId,
      collegeId,
    },
  });
}

export async function getUserShortlistedColleges(userId: string) {
  return prisma.userShortlist.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      collegeId: true,
      createdAt: true,
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

export async function isCollegeShortlisted(
  userId: string,
  collegeId: string,
) {
  const shortlist = await prisma.userShortlist.findUnique({
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

  return Boolean(shortlist);
}