import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { slug } = await context.params;

    const article = await prisma.newsArticle.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
        },
        { status: 404 },
      );
    }

    await prisma.newsArticle.update({
      where: {
        id: article.id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Failed to fetch article:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch article",
      },
      { status: 500 },
    );
  }
}