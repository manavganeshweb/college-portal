import { prisma } from "@/lib/prisma";
import {
  generateSessionToken,
  getSessionExpiry,
  hashPassword,
  hashSessionToken,
  verifyPassword,
} from "@/lib/auth";
type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};
type LoginInput = {
  email: string;
  password: string;
};
export async function registerUser(input: RegisterInput) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  if (name.length < 2) {
    throw new Error("Name must contain at least 2 characters.");
  }

  if (!phone) {
    throw new Error("Phone number is required.");
  }

  if (input.password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters.",
    );
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      createdAt: true,
    },
  });

  const token = generateSessionToken();

  await prisma.userSession.create({
    data: {
      userId: user.id,
      tokenHash: hashSessionToken(token),
      expiresAt: getSessionExpiry(),
    },
  });

  return {
    user,
    token,
  };
}

export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      passwordHash: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const passwordValid = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = generateSessionToken();

  await prisma.userSession.create({
    data: {
      userId: user.id,
      tokenHash: hashSessionToken(token),
      expiresAt: getSessionExpiry(),
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function loginAdmin(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      passwordHash: true,
      createdAt: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Invalid admin credentials.");
  }

  const passwordValid = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordValid) {
    throw new Error("Invalid admin credentials.");
  }

  const token = generateSessionToken();

  await prisma.userSession.create({
    data: {
      userId: user.id,
      tokenHash: hashSessionToken(token),
      expiresAt: getSessionExpiry(),
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}


export async function getUserBySessionToken(token: string) {
  const tokenHash = hashSessionToken(token);

  const session = await prisma.userSession.findUnique({
    where: {
      tokenHash,
    },
    select: {
      id: true,
      expiresAt: true,
   user: {
  select: {
    id: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    avatar: true,
    createdAt: true,
  },
},
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.userSession.delete({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return session.user;
}

export async function deleteSession(token: string) {
  const tokenHash = hashSessionToken(token);

  await prisma.userSession.deleteMany({
    where: {
      tokenHash,
    },
  });
}