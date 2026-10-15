import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionToken } from "@/lib/auth";
import { getUserBySessionToken } from "@/services/auth.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type QuestionStatus = "PENDING" | "PUBLISHED" | "REJECTED";
type AnswerStatus = "PENDING" | "PUBLISHED" | "REJECTED";

const isQuestionStatus = (value: unknown): value is QuestionStatus =>
  value === "PENDING" ||
  value === "PUBLISHED" ||
  value === "REJECTED";

const isAnswerStatus = (value: unknown): value is AnswerStatus =>
  value === "PENDING" ||
  value === "PUBLISHED" ||
  value === "REJECTED";

async function requireAdmin() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const user = await getUserBySessionToken(token);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

async function questionBelongsToCollege(
  questionId: string,
  collegeId: string,
) {
  return prisma.collegeQuestion.findFirst({
    where: {
      id: questionId,
      collegeId,
    },
    select: {
      id: true,
    },
  });
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return errorResponse("Admin access required.", 401);
    }

    const { id: collegeId } = await context.params;

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true, name: true },
    });

    if (!college) {
      return errorResponse("College not found.", 404);
    }

    const questions = await prisma.collegeQuestion.findMany({
      where: { collegeId },
      orderBy: { createdAt: "desc" },
      include: {
        answers: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({
      college,
      questions,
    });
  } catch (error) {
    console.error("Admin Q&A GET error:", error);

    return errorResponse("Unable to load questions.", 500);
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return errorResponse("Admin access required.", 401);
    }

    const { id: collegeId } = await context.params;

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true },
    });

    if (!college) {
      return errorResponse("College not found.", 404);
    }

    const body = await request.json();
    const action = body.action;

    /*
     * Create a question and its first answer together.
     */
    if (action === "createQuestion") {
      const question = String(body.question ?? "").trim();
      const answer = String(body.answer ?? "").trim();

      const askerName =
        String(body.askerName ?? "").trim() || null;

      const answererName =
        String(body.answererName ?? "").trim() || null;

      const answererRole =
        String(body.answererRole ?? "").trim() || null;

      const questionStatus = isQuestionStatus(body.questionStatus)
        ? body.questionStatus
        : "PENDING";

      const answerStatus = isAnswerStatus(body.answerStatus)
        ? body.answerStatus
        : "PENDING";

      if (question.length < 5) {
        return errorResponse(
          "Question must contain at least 5 characters.",
        );
      }

      if (answer.length < 2) {
        return errorResponse(
          "Please provide an answer.",
        );
      }

      const slug =
        `${slugify(question) || "question"}-${crypto
          .randomUUID()
          .slice(0, 8)}`;

      const created = await prisma.collegeQuestion.create({
        data: {
          collegeId,
          question,
          slug,
          askerName,
          status: questionStatus,
          answers: {
            create: {
              answer,
              answererName,
              answererRole,
              isVerified: Boolean(body.isVerified),
              status: answerStatus,
            },
          },
        },
        include: {
          answers: true,
        },
      });

      return NextResponse.json(
        {
          message: "Question and answer created successfully.",
          question: created,
        },
        { status: 201 },
      );
    }

    /*
     * Add another answer to an existing question.
     */
    if (action === "addAnswer") {
      const questionId = String(body.questionId ?? "");
      const answer = String(body.answer ?? "").trim();

      if (!questionId) {
        return errorResponse("Question ID is required.");
      }

      if (answer.length < 2) {
        return errorResponse("Please provide an answer.");
      }

      const question = await questionBelongsToCollege(
        questionId,
        collegeId,
      );

      if (!question) {
        return errorResponse("Question not found.", 404);
      }

      const answerStatus = isAnswerStatus(body.answerStatus)
        ? body.answerStatus
        : "PENDING";

      const created = await prisma.collegeAnswer.create({
        data: {
          questionId,
          answer,
          answererName:
            String(body.answererName ?? "").trim() || null,
          answererRole:
            String(body.answererRole ?? "").trim() || null,
          isVerified: Boolean(body.isVerified),
          status: answerStatus,
        },
      });

      return NextResponse.json(
        {
          message: "Answer added successfully.",
          answer: created,
        },
        { status: 201 },
      );
    }

    /*
     * Update question text and asker name.
     */
    if (action === "updateQuestion") {
      const questionId = String(body.questionId ?? "");
      const questionText = String(body.question ?? "").trim();

      if (questionText.length < 5) {
        return errorResponse(
          "Question must contain at least 5 characters.",
        );
      }

      const existing = await questionBelongsToCollege(
        questionId,
        collegeId,
      );

      if (!existing) {
        return errorResponse("Question not found.", 404);
      }

      const updated = await prisma.collegeQuestion.update({
        where: { id: questionId },
        data: {
          question: questionText,
          askerName:
            String(body.askerName ?? "").trim() || null,
        },
      });

      return NextResponse.json({
        message: "Question updated successfully.",
        question: updated,
      });
    }

    /*
     * Change question publication status.
     */
    if (action === "setQuestionStatus") {
      const questionId = String(body.questionId ?? "");

      if (!isQuestionStatus(body.status)) {
        return errorResponse("Invalid question status.");
      }

      const existing = await questionBelongsToCollege(
        questionId,
        collegeId,
      );

      if (!existing) {
        return errorResponse("Question not found.", 404);
      }

      const updated = await prisma.collegeQuestion.update({
        where: { id: questionId },
        data: { status: body.status },
      });

      return NextResponse.json({
        message: "Question status updated.",
        question: updated,
      });
    }

    /*
     * Update an existing answer.
     */
    if (action === "updateAnswer") {
      const answerId = String(body.answerId ?? "");
      const answerText = String(body.answer ?? "").trim();

      if (answerText.length < 2) {
        return errorResponse("Please provide an answer.");
      }

      const existing = await prisma.collegeAnswer.findFirst({
        where: {
          id: answerId,
          question: { collegeId },
        },
      });

      if (!existing) {
        return errorResponse("Answer not found.", 404);
      }

      const updated = await prisma.collegeAnswer.update({
        where: { id: answerId },
        data: {
          answer: answerText,
          answererName:
            String(body.answererName ?? "").trim() || null,
          answererRole:
            String(body.answererRole ?? "").trim() || null,
          isVerified: Boolean(body.isVerified),
        },
      });

      return NextResponse.json({
        message: "Answer updated successfully.",
        answer: updated,
      });
    }

    /*
     * Change answer publication status.
     */
    if (action === "setAnswerStatus") {
      const answerId = String(body.answerId ?? "");

      if (!isAnswerStatus(body.status)) {
        return errorResponse("Invalid answer status.");
      }

      const existing = await prisma.collegeAnswer.findFirst({
        where: {
          id: answerId,
          question: { collegeId },
        },
      });

      if (!existing) {
        return errorResponse("Answer not found.", 404);
      }

      const updated = await prisma.collegeAnswer.update({
        where: { id: answerId },
        data: { status: body.status },
      });

      return NextResponse.json({
        message: "Answer status updated.",
        answer: updated,
      });
    }

    /*
     * Verify or unverify an answer.
     */
    if (action === "verifyAnswer") {
      const answerId = String(body.answerId ?? "");

      const existing = await prisma.collegeAnswer.findFirst({
        where: {
          id: answerId,
          question: { collegeId },
        },
      });

      if (!existing) {
        return errorResponse("Answer not found.", 404);
      }

      const updated = await prisma.collegeAnswer.update({
        where: { id: answerId },
        data: { isVerified: Boolean(body.isVerified) },
      });

      return NextResponse.json({
        message: "Answer verification updated.",
        answer: updated,
      });
    }

    /*
     * Delete a question and its related answers.
     */
    if (action === "deleteQuestion") {
      const questionId = String(body.questionId ?? "");

      const existing = await questionBelongsToCollege(
        questionId,
        collegeId,
      );

      if (!existing) {
        return errorResponse("Question not found.", 404);
      }

      await prisma.collegeQuestion.delete({
        where: { id: questionId },
      });

      return NextResponse.json({
        message: "Question deleted successfully.",
      });
    }

    /*
     * Delete an individual answer.
     */
    if (action === "deleteAnswer") {
      const answerId = String(body.answerId ?? "");

      const existing = await prisma.collegeAnswer.findFirst({
        where: {
          id: answerId,
          question: { collegeId },
        },
      });

      if (!existing) {
        return errorResponse("Answer not found.", 404);
      }

      await prisma.collegeAnswer.delete({
        where: { id: answerId },
      });

      return NextResponse.json({
        message: "Answer deleted successfully.",
      });
    }

    return errorResponse("Unknown Q&A action.");
  } catch (error) {
    console.error("Admin Q&A POST error:", error);

    return errorResponse(
      "Something went wrong while managing Q&A.",
      500,
    );
  }
}