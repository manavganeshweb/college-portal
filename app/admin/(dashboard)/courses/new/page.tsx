import { prisma } from "@/lib/prisma";
import CourseForm from "./CourseForm";

async function getCategories() {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export default async function NewCoursePage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-slate-50">
      <CourseForm categories={categories} />
    </main>
  );
}