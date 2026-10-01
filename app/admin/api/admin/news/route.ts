import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const NEWS_TYPES = [
  "EXAM_ALERT",
  "COLLEGE_ALERT",
  "ADMISSION_ALERT",
  "EDUCATION_NEWS",
  "RESULT",
  "CAREER",
] as const;

const CONTENT_STATUSES = [
  "DRAFT",
  "PUBLISHED",
] as const;

type NewsType = (typeof NEWS_TYPES)[number];
type ContentStatus = (typeof CONTENT_STATUSES)[number];

function isNewsType(value: string): value is NewsType {
  return NEWS_TYPES.includes(value as NewsType);
}

function isContentStatus(
  value: string,
): value is ContentStatus {
  return CONTENT_STATUSES.includes(
    value as ContentStatus,
  );
}

export async function GET(request: NextRequest) {
  try {
    /*
     * Add the same admin authentication/RBAC check
     * used by your existing admin API routes here.
     */

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";

    const statusValue =
      searchParams.get("status")?.trim().toUpperCase() || "";

    const typeValue =
      searchParams.get("type")?.trim().toUpperCase() || "";

    const pageValue = Number(
      searchParams.get("page") || "1",
    );

    const limitValue = Number(
      searchParams.get("limit") || "10",
    );

    const page = Number.isFinite(pageValue)
      ? Math.max(1, pageValue)
      : 1;

    const limit = Number.isFinite(limitValue)
      ? Math.min(Math.max(1, limitValue), 50)
      : 10;

    const status = isContentStatus(statusValue)
      ? statusValue
      : undefined;

    const type = isNewsType(typeValue)
      ? typeValue
      : undefined;

    const where = {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
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
                slug: {
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
          status: true,
          publishedAt: true,
          isFeatured: true,
          isTrending: true,
          views: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.newsArticle.count({
        where,
      }),
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
    console.error("Admin news GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news articles.",
      },
      {
        status: 500,
      },
    );
  }
}
type CreateNewsBody = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  type: NewsType;
  sourceName?: string | null;
  sourceUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  isFeatured?: boolean;
  isTrending?: boolean;
  status: ContentStatus;
  publishedAt?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    /*
     * Use the same admin authentication/RBAC check
     * as your other admin API routes.
     */

    const body = (await request.json()) as CreateNewsBody;

    const title = body.title?.trim();
    const slug = body.slug?.trim();
    const content = body.content?.trim();

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug is required.",
        },
        { status: 400 },
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message: "Content is required.",
        },
        { status: 400 },
      );
    }

    if (!isNewsType(body.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid news type.",
        },
        { status: 400 },
      );
    }

    if (!isContentStatus(body.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content status.",
        },
        { status: 400 },
      );
    }

    const existingArticle =
      await prisma.newsArticle.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      });

    if (existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "An article with this slug already exists.",
        },
        { status: 409 },
      );
    }

    const article =
      await prisma.newsArticle.create({
        data: {
          title,
          slug,
          excerpt: body.excerpt?.trim() || null,
          content,
          coverImage: body.coverImage?.trim() || null,

          type: body.type,

          sourceName:
            body.sourceName?.trim() || null,

          sourceUrl:
            body.sourceUrl?.trim() || null,

          seoTitle:
            body.seoTitle?.trim() || null,

          seoDescription:
            body.seoDescription?.trim() || null,

          seoKeywords:
            body.seoKeywords?.trim() || null,

          isFeatured: body.isFeatured ?? false,
          isTrending: body.isTrending ?? false,

          status: body.status,

          publishedAt:
            body.status === "PUBLISHED"
              ? body.publishedAt
                ? new Date(body.publishedAt)
                : new Date()
              : null,
        },

        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Article created successfully.",
        data: article,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin news POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create article.",
      },
      { status: 500 },
    );
  }
}