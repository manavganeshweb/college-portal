import { prisma } from "@/lib/prisma";

export async function getAdminApplications() {
  return prisma.userApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      status: true,
      phoneNumber: true,
      courseName: true,
      notes: true,
      appliedAt: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
        },
      },

      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          logo: true,

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