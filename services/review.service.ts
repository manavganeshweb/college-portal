import { prisma } from "@/lib/prisma";

type CreateReviewInput = {
  userId: string;
  collegeId: string;
  rating: number;
  title: string;
  content: string;
};

type UpdateReviewInput = {
  rating?: number;
  title?: string;
  content?: string;
};

function validateRating(rating: number) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }
}

function validateReviewText(title: string, content: string) {
  if (title.length < 3) {
    throw new Error("Review title must contain at least 3 characters.");
  }

  if (content.length < 10) {
    throw new Error(
      "Review content must contain at least 10 characters.",
    );
  }
}

export async function getCollegeReviews(collegeId: string) {
  return prisma.review.findMany({
    where: {
      collegeId,
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      isVerifiedStudent: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getUserCollegeReview(
  userId: string,
  collegeId: string,
) {
  return prisma.review.findFirst({
    where: {
      userId,
      collegeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      isVerifiedStudent: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createCollegeReview(
  input: CreateReviewInput,
) {
  const rating = Number(input.rating);
  const title = input.title.trim();
  const content = input.content.trim();

  validateRating(rating);
  validateReviewText(title, content);

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

  const existingReview = await prisma.review.findFirst({
    where: {
      userId: input.userId,
      collegeId: input.collegeId,
    },
    select: {
      id: true,
    },
  });

  if (existingReview) {
    throw new Error(
      "You have already submitted a review for this college.",
    );
  }

  return prisma.review.create({
    data: {
      userId: input.userId,
      collegeId: input.collegeId,
      rating,
      title,
      content,
      isPublished: false,
      isVerifiedStudent: false,
    },
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      isVerifiedStudent: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateCollegeReview(
  userId: string,
  reviewId: string,
  input: UpdateReviewInput,
) {
  const existingReview = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingReview) {
    throw new Error("Review not found.");
  }

  const data: {
    rating?: number;
    title?: string;
    content?: string;
    isPublished?: boolean;
  } = {};

  if (input.rating !== undefined) {
    const rating = Number(input.rating);
    validateRating(rating);
    data.rating = rating;
  }

  if (input.title !== undefined) {
    const title = input.title.trim();

    if (title.length < 3) {
      throw new Error(
        "Review title must contain at least 3 characters.",
      );
    }

    data.title = title;
  }

  if (input.content !== undefined) {
    const content = input.content.trim();

    if (content.length < 10) {
      throw new Error(
        "Review content must contain at least 10 characters.",
      );
    }

    data.content = content;
  }

  // Edited reviews should return to moderation.
  data.isPublished = false;

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data,
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      isVerifiedStudent: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteCollegeReview(
  userId: string,
  reviewId: string,
) {
  const result = await prisma.review.deleteMany({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new Error("Review not found.");
  }
}
export async function getCollegeIdBySlug(slug: string) {
  const college = await prisma.college.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  return college?.id ?? null;
}
export async function updateAdminCollegeReview(input: {
  collegeId: string;
  reviewId: string;
  isPublished: boolean;
}) {
  const review = await prisma.review.findFirst({
    where: {
      id: input.reviewId,
      collegeId: input.collegeId,
    },
    select: {
      id: true,
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  return prisma.review.update({
    where: {
      id: input.reviewId,
    },
    data: {
      isPublished: input.isPublished,
    },
    select: {
      id: true,
      isPublished: true,
    },
  });
}

export async function deleteAdminCollegeReview(input: {
  collegeId: string;
  reviewId: string;
}) {
  const review = await prisma.review.findFirst({
    where: {
      id: input.reviewId,
      collegeId: input.collegeId,
    },
    select: {
      id: true,
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  await prisma.review.delete({
    where: {
      id: input.reviewId,
    },
  });
}