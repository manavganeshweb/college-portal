import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const type = searchParams.get("type") || "";
    const page = Math.max(
      Number.parseInt(searchParams.get("page") || "1", 10),
      1,
    );

    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || String(DEFAULT_LIMIT),
      10,
    );

    const limit = Math.min(
      Math.max(requestedLimit || DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const featured = searchParams.get("featured") === "true";
    const trending = searchParams.get("trending") === "true";

    const where = {
      status: "PUBLISHED" as const,

      ...(type ? { type: type as never } : {}),

      ...(featured ? { isFeatured: true } : {}),

      ...(trending ? { isTrending: true } : {}),

      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                excerpt: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                content: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          type: true,
          publishedAt: true,
          views: true,
          isFeatured: true,
          isTrending: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.newsArticle.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch news articles:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news articles",
      },
      { status: 500 },
    );
  }
}