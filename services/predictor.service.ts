import { prisma } from "@/lib/prisma";

type PredictorInput = {
  examId: string;
  rank: number;
  category: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  course?: string;
};

export async function predictColleges({
  examId,
  rank,
  category,
  gender,
  course,
}: PredictorInput) {
  const cutoffs = await prisma.collegeCutoff.findMany({
    where: {
      examId,
      category,
      ...(gender ? { gender } : {}),
      ...(course ? { course } : {}),
      openingRank: {
        not: null,
      },
      closingRank: {
        not: null,
      },
    },
    orderBy: [
      {
        closingRank: "asc",
      },
      {
        year: "desc",
      },
    ],
    select: {
      id: true,
      year: true,
      category: true,
      gender: true,
      course: true,
      openingRank: true,
      closingRank: true,
      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
          logo: true,
          coverImage: true,
          verified: true,
          collegeType: true,
          city: {
            select: {
              name: true,
            },
          },
          state: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const latestByCollege = new Map<
    string,
    (typeof cutoffs)[number]
  >();

  for (const cutoff of cutoffs) {
    const existing = latestByCollege.get(cutoff.college.id);

    if (!existing || cutoff.year > existing.year) {
      latestByCollege.set(cutoff.college.id, cutoff);
    }
  }

  return Array.from(latestByCollege.values())
    .filter((cutoff) => {
      if (
        cutoff.openingRank === null ||
        cutoff.closingRank === null
      ) {
        return false;
      }

      return (
        rank >= cutoff.openingRank &&
        rank <= cutoff.closingRank
      );
    })
    .slice(0, 20)
    .map((cutoff) => ({
      college: cutoff.college,
      year: cutoff.year,
      course: cutoff.course,
      openingRank: cutoff.openingRank,
      closingRank: cutoff.closingRank,
    }));
}

export async function getPredictorExams() {
  return prisma.exam.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}