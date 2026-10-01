import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export async function getUserProfile(userId: string) {
  
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  }
);
}

export async function updateUserProfile(
  userId: string,
  input: {
    name?: string;
    phone?: string;
    avatar?: string | null;
  },
) {
  const name = input.name?.trim();
  const phone = input.phone?.trim();


  if (name !== undefined && name.length < 2) {
    throw new Error(
      "Name must contain at least 2 characters.",
    );
  }

  if (phone !== undefined && !phone) {
    throw new Error("Phone number cannot be empty.");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(input.avatar !== undefined && {
        avatar: input.avatar,
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (newPassword.length < 8) {
    throw new Error("New password must contain at least 8 characters.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      passwordHash: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const valid = await verifyPassword(
    currentPassword,
    user.passwordHash,
  );

  if (!valid) {
    throw new Error("Current password is incorrect.");
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}