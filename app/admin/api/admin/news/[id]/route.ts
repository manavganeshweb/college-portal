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
type ContentStatus =
  (typeof CONTENT_STATUSES)[number];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateNewsBody = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  type?: NewsType;
  sourceName?: string | null;
  sourceUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  isFeatured?: boolean;
  isTrending?: boolean;
  status?: ContentStatus;
  publishedAt?: string | null;
};

function isNewsType(
  value: string,
): value is NewsType {
  return NEWS_TYPES.includes(
    value as NewsType,
  );
}

function isContentStatus(
  value: string,
): value is ContentStatus {
  return CONTENT_STATUSES.includes(
    value as ContentStatus,
  );
}

function isValidDate(value: string) {
  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

/*
 * GET /admin/api/admin/news/[id]
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const article =
      await prisma.newsArticle.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error(
      "Admin news GET [id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch article.",
      },
      { status: 500 },
    );
  }
}

/*
 * PATCH /admin/api/admin/news/[id]
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const body =
      (await request.json()) as UpdateNewsBody;

    const existingArticle =
      await prisma.newsArticle.findUnique({
        where: { id },
        select: {
          id: true,
          slug: true,
          status: true,
          publishedAt: true,
        },
      });

    if (!existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found.",
        },
        { status: 404 },
      );
    }

    if (
      body.title !== undefined &&
      !body.title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Title cannot be empty.",
        },
        { status: 400 },
      );
    }

    if (
      body.slug !== undefined &&
      !body.slug.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug cannot be empty.",
        },
        { status: 400 },
      );
    }

    if (
      body.content !== undefined &&
      !body.content.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Content cannot be empty.",
        },
        { status: 400 },
      );
    }

    if (
      body.type !== undefined &&
      !isNewsType(body.type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid news type.",
        },
        { status: 400 },
      );
    }

    if (
      body.status !== undefined &&
      !isContentStatus(body.status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content status.",
        },
        { status: 400 },
      );
    }

    if (
      body.publishedAt !== undefined &&
      body.publishedAt !== null &&
      !isValidDate(body.publishedAt)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid published date.",
        },
        { status: 400 },
      );
    }

    const nextSlug =
      body.slug?.trim() ?? existingArticle.slug;

    if (nextSlug !== existingArticle.slug) {
      const duplicate =
        await prisma.newsArticle.findFirst({
          where: {
            slug: nextSlug,
            NOT: {
              id,
            },
          },
          select: {
            id: true,
          },
        });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another article already uses this slug.",
          },
          { status: 409 },
        );
      }
    }

    const nextStatus =
      body.status ?? existingArticle.status;

    let nextPublishedAt =
      existingArticle.publishedAt;

    if (nextStatus === "DRAFT") {
      nextPublishedAt = null;
    } else if (body.publishedAt !== undefined) {
      nextPublishedAt = body.publishedAt
        ? new Date(body.publishedAt)
        : new Date();
    } else if (!nextPublishedAt) {
      nextPublishedAt = new Date();
    }

    const article =
      await prisma.newsArticle.update({
        where: {
          id,
        },
        data: {
          ...(body.title !== undefined && {
            title: body.title.trim(),
          }),

          ...(body.slug !== undefined && {
            slug: body.slug.trim(),
          }),

          ...(body.excerpt !== undefined && {
            excerpt:
              body.excerpt?.trim() || null,
          }),

          ...(body.content !== undefined && {
            content: body.content.trim(),
          }),

          ...(body.coverImage !== undefined && {
            coverImage:
              body.coverImage?.trim() || null,
          }),

          ...(body.type !== undefined && {
            type: body.type,
          }),

          ...(body.sourceName !== undefined && {
            sourceName:
              body.sourceName?.trim() || null,
          }),

          ...(body.sourceUrl !== undefined && {
            sourceUrl:
              body.sourceUrl?.trim() || null,
          }),

          ...(body.seoTitle !== undefined && {
            seoTitle:
              body.seoTitle?.trim() || null,
          }),

          ...(body.seoDescription !== undefined && {
            seoDescription:
              body.seoDescription?.trim() || null,
          }),

          ...(body.seoKeywords !== undefined && {
            seoKeywords:
              body.seoKeywords?.trim() || null,
          }),

          ...(body.isFeatured !== undefined && {
            isFeatured: body.isFeatured,
          }),

          ...(body.isTrending !== undefined && {
            isTrending: body.isTrending,
          }),

          status: nextStatus,
          publishedAt: nextPublishedAt,
        },

        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Article updated successfully.",
      data: article,
    });
  } catch (error) {
    console.error(
      "Admin news PATCH [id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update article.",
      },
      { status: 500 },
    );
  }
}

/*
 * DELETE /admin/api/admin/news/[id]
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const existingArticle =
      await prisma.newsArticle.findUnique({
        where: { id },
        select: {
          id: true,
        },
      });

    if (!existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found.",
        },
        { status: 404 },
      );
    }

    await prisma.newsArticle.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Admin news DELETE [id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete article.",
      },
      { status: 500 },
    );
  }
}