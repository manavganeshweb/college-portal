import { notFound } from "next/navigation";
import NewsEditForm from "./NewsEditForm";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata = {
  title: "Edit News Article | Admin",
};

export default async function EditNewsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const article = await prisma.newsArticle.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      type: true,
      sourceName: true,
      sourceUrl: true,
      publishedAt: true,
      status: true,
      isFeatured: true,
      isTrending: true,
      views: true,
      seoTitle: true,
      seoDescription: true,
      seoKeywords: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <NewsEditForm
      article={{
        ...article,
        publishedAt: article.publishedAt
          ? article.publishedAt.toISOString()
          : null,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      }}
    />
  );
}