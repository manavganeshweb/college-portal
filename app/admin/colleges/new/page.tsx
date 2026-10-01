import { prisma } from "@/lib/prisma";
import CollegeForm from "./CollegeForm";

export const dynamic = "force-dynamic";

async function getFormData() {
  const [states, categories] = await Promise.all([
    prisma.state.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        cities: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return {
    states,
    categories,
  };
}

export default async function NewCollegePage() {
  const { states, categories } = await getFormData();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-medium text-[#15945c]">
          College Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Add College
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add a new college to the College Aadhar database.
        </p>
      </div>

      <CollegeForm
        states={states}
        categories={categories}
      />
    </div>
  );
}