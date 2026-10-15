import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSessionToken } from "@/lib/auth";
import { getUserBySessionToken } from "@/services/auth.service";

import CollegeQuestionsManager from "./CollegeQuestionsManager";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CollegeQuestionsPage({
  params,
}: Props) {
  const { id } = await params;

  const token = await getSessionToken();

  if (!token) {
    redirect("/admin/login");
  }

  const user = await getUserBySessionToken(token);

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const college = await prisma.college.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });

  if (!college) {
    notFound();
  }

  return (
    <CollegeQuestionsManager
      collegeId={college.id}
      collegeName={college.name}
    />
  );
}