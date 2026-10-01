import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type NewsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function NewsArticlePage({
  params,
}: NewsPageProps) {
  const { slug } = await params;

  console.log("NEWS SLUG:", slug);

  const article = await prisma.newsArticle.findFirst({
    where: {
      slug,
    },
  });

  console.log("PUBLIC NEWS ARTICLE:", article);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-medium text-green-600">
          {article.type}
        </p>

        <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-5 text-lg leading-8 text-gray-600">
            {article.excerpt}
          </p>
        )}

        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="mt-8 w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-gray-700">
          {article.content}
        </div>
      </div>
    </main>
  );
}