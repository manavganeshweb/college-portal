"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  MessageSquare,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

type QuestionStatus = "PENDING" | "PUBLISHED" | "REJECTED";
type AnswerStatus = "PENDING" | "PUBLISHED" | "REJECTED";

type Answer = {
  id: string;
  questionId: string;
  answer: string;
  answererName: string | null;
  answererRole: string | null;
  isVerified: boolean;
  status: AnswerStatus;
  createdAt: string;
};

type Question = {
  id: string;
  collegeId: string;
  question: string;
  slug: string;
  askerName: string | null;
  status: QuestionStatus;
  createdAt: string;
  answers: Answer[];
};

type Props = {
  collegeId: string;
  collegeName: string;
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10";

const labelClass =
  "text-xs font-semibold uppercase tracking-wide text-gray-500";

export default function CollegeQuestionsManager({
  collegeId,
  collegeName,
}: Props) {
  const endpoint = `/admin/api/admin/colleges/${collegeId}/questions`;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [mode, setMode] = useState<"question" | "answer">("question");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(
    null,
  );

  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [askerName, setAskerName] = useState("");
  const [answererName, setAnswererName] = useState("College Aadhar Team");
  const [answererRole, setAnswererRole] = useState("Education Expert");
  const [isVerified, setIsVerified] = useState(false);
  const [questionStatus, setQuestionStatus] =
    useState<QuestionStatus>("PENDING");
  const [answerStatus, setAnswerStatus] =
    useState<AnswerStatus>("PENDING");

  const [filter, setFilter] = useState("ALL");

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load Q&A.");
      }

      setQuestions(data.questions ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load Q&A.",
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  function resetForm() {
    setMode("question");
    setEditingQuestionId(null);
    setEditingAnswerId(null);
    setQuestionText("");
    setAnswerText("");
    setAskerName("");
    setAnswererName("College Aadhar Team");
    setAnswererRole("Education Expert");
    setIsVerified(false);
    setQuestionStatus("PENDING");
    setAnswerStatus("PENDING");
  }

  async function performAction(
    action: string,
    payload: Record<string, unknown>,
  ) {
    setError("");
    setNotice("");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, ...payload }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The operation failed.");
    }

    setNotice(data.message || "Changes saved successfully.");

    return data;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (mode === "question" && editingQuestionId) {
        await performAction("updateQuestion", {
          questionId: editingQuestionId,
          question: questionText,
          askerName,
        });

        if (answerText.trim()) {
          if (editingAnswerId) {
            await performAction("updateAnswer", {
              answerId: editingAnswerId,
              answer: answerText,
              answererName,
              answererRole,
              isVerified,
            });
          } else {
            await performAction("addAnswer", {
              questionId: editingQuestionId,
              answer: answerText,
              answererName,
              answererRole,
              isVerified,
              answerStatus,
            });
          }
        }
      } else if (mode === "answer" && editingQuestionId) {
        if (editingAnswerId) {
          await performAction("updateAnswer", {
            answerId: editingAnswerId,
            answer: answerText,
            answererName,
            answererRole,
            isVerified,
          });
        } else {
          await performAction("addAnswer", {
            questionId: editingQuestionId,
            answer: answerText,
            answererName,
            answererRole,
            isVerified,
            answerStatus,
          });
        }
      } else {
        await performAction("createQuestion", {
          question: questionText,
          answer: answerText,
          askerName,
          answererName,
          answererRole,
          isVerified,
          questionStatus,
          answerStatus,
        });
      }

      resetForm();
      await loadQuestions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save changes.",
      );
    } finally {
      setSaving(false);
    }
  }

  function editQuestion(question: Question) {
    const firstAnswer = question.answers[0];

    setMode("question");
    setEditingQuestionId(question.id);
    setEditingAnswerId(firstAnswer?.id ?? null);

    setQuestionText(question.question);
    setAnswerText(firstAnswer?.answer ?? "");
    setAskerName(question.askerName ?? "");

    setAnswererName(
      firstAnswer?.answererName ?? "College Aadhar Team",
    );
    setAnswererRole(firstAnswer?.answererRole ?? "Education Expert");
    setIsVerified(firstAnswer?.isVerified ?? false);
    setQuestionStatus(question.status);
    setAnswerStatus(firstAnswer?.status ?? "PENDING");

    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addAnswer(question: Question) {
    setMode("answer");
    setEditingQuestionId(question.id);
    setEditingAnswerId(null);

    setQuestionText("");
    setAnswerText("");
    setAskerName(question.askerName ?? "");
    setAnswererName("College Aadhar Team");
    setAnswererRole("Education Expert");
    setIsVerified(false);
    setAnswerStatus("PENDING");

    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editAnswer(question: Question, answer: Answer) {
    setMode("answer");
    setEditingQuestionId(question.id);
    setEditingAnswerId(answer.id);

    setQuestionText("");
    setAnswerText(answer.answer);
    setAskerName(question.askerName ?? "");
    setAnswererName(answer.answererName ?? "");
    setAnswererRole(answer.answererRole ?? "");
    setIsVerified(answer.isVerified);
    setAnswerStatus(answer.status);

    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function changeStatus(
    action: string,
    payload: Record<string, unknown>,
  ) {
    try {
      await performAction(action, payload);
      await loadQuestions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update status.",
      );
    }
  }

  async function deleteQuestion(question: Question) {
    if (
      !window.confirm(
        `Delete this question and all ${question.answers.length} associated answer(s)?`,
      )
    ) {
      return;
    }

    try {
      await performAction("deleteQuestion", {
        questionId: question.id,
      });

      if (editingQuestionId === question.id) {
        resetForm();
      }

      await loadQuestions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete question.",
      );
    }
  }

  async function deleteAnswer(answer: Answer) {
    if (!window.confirm("Delete this answer permanently?")) {
      return;
    }

    try {
      await performAction("deleteAnswer", {
        answerId: answer.id,
      });

      if (editingAnswerId === answer.id) {
        resetForm();
      }

      await loadQuestions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete answer.",
      );
    }
  }

  const visibleQuestions =
    filter === "ALL"
      ? questions
      : questions.filter((question) => question.status === filter);

  const publishedCount = questions.filter(
    (question) => question.status === "PUBLISHED",
  ).length;

  const pendingCount = questions.filter(
    (question) => question.status === "PENDING",
  ).length;

  const totalAnswers = questions.reduce(
    (total, question) => total + question.answers.length,
    0,
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href={`/admin/colleges/${collegeId}`}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-[#15945c] hover:text-[#15945c]"
            aria-label="Back to college"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#15945c]">
              College management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Questions & Answers
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage Q&A for {collegeName}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-4 text-sm font-semibold text-white transition hover:bg-[#117a4b]"
        >
          <Plus size={17} />
          New question
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total questions"
          value={questions.length}
          icon={MessageSquare}
        />
        <StatCard
          label="Published questions"
          value={publishedCount}
          icon={Eye}
        />
        <StatCard
          label="Pending questions"
          value={pendingCount}
          icon={CircleAlert}
        />
        <StatCard
          label="Total answers"
          value={totalAnswers}
          icon={CheckCircle2}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          {notice}
        </div>
      )}

      {/* Editor */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#15945c]/10 text-[#15945c]">
              {mode === "question" ? (
                <MessageSquare size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                {mode === "answer"
                  ? editingAnswerId
                    ? "Edit answer"
                    : "Add answer"
                  : editingQuestionId
                    ? "Edit question"
                    : "Create question and answer"}
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {mode === "answer"
                  ? "Add or update an answer for the selected question."
                  : "Create a question and its first answer in one step."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {mode === "answer" && editingQuestionId && (
            <div className="rounded-xl border border-[#15945c]/20 bg-[#15945c]/5 p-4">
              <p className={labelClass}>Answering this question</p>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-800">
                {questions.find((q) => q.id === editingQuestionId)?.question}
              </p>
            </div>
          )}

          {mode === "question" && (
            <>
              <div>
                <label htmlFor="question" className={labelClass}>
                  Question *
                </label>
                <textarea
                  id="question"
                  required
                  minLength={5}
                  rows={3}
                  value={questionText}
                  onChange={(event) => setQuestionText(event.target.value)}
                  placeholder="e.g. What is the admission process for B.Tech?"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="askerName" className={labelClass}>
                  Asked by (optional)
                </label>
                <input
                  id="askerName"
                  value={askerName}
                  onChange={(event) => setAskerName(event.target.value)}
                  placeholder="e.g. Student"
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="answer" className={labelClass}>
              Answer *
            </label>
            <textarea
              id="answer"
              required
              minLength={2}
              rows={5}
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              placeholder="Write a helpful, accurate answer..."
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="answererName" className={labelClass}>
                Answerer name
              </label>
              <input
                id="answererName"
                value={answererName}
                onChange={(event) => setAnswererName(event.target.value)}
                placeholder="College Aadhar Team"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="answererRole" className={labelClass}>
                Answerer role
              </label>
              <input
                id="answererRole"
                value={answererRole}
                onChange={(event) => setAnswererRole(event.target.value)}
                placeholder="Education Expert"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {mode === "question" && (
              <div>
                <label htmlFor="questionStatus" className={labelClass}>
                  Question status
                </label>
                <select
                  id="questionStatus"
                  value={questionStatus}
                  onChange={(event) =>
                    setQuestionStatus(event.target.value as QuestionStatus)
                  }
                  className={inputClass}
                >
                  <option value="PENDING">Pending review</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="answerStatus" className={labelClass}>
                Answer status
              </label>
              <select
                id="answerStatus"
                value={answerStatus}
                onChange={(event) =>
                  setAnswerStatus(event.target.value as AnswerStatus)
                }
                className={inputClass}
              >
                <option value="PENDING">Pending review</option>
                <option value="PUBLISHED">Published</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(event) => setIsVerified(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#15945c]"
            />

            <span>
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <ShieldCheck size={16} className="text-[#15945c]" />
                Mark answer as verified
              </span>
              <span className="mt-1 block text-xs leading-5 text-gray-500">
                Use this for answers that have been checked against reliable
                sources.
              </span>
            </span>
          </label>

          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-5 text-sm font-semibold text-white transition hover:bg-[#117a4b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}

              {saving
                ? "Saving..."
                : editingQuestionId || editingAnswerId
                  ? "Save changes"
                  : "Create Q&A"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </form>
      </section>

      {/* Question list */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Manage questions
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Review questions, answers, and publication status.
            </p>
          </div>

          <select
            aria-label="Filter questions by status"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#15945c]"
          >
            <option value="ALL">All questions</option>
            <option value="PENDING">Pending</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm text-gray-500">
            <LoaderCircle size={20} className="animate-spin text-[#15945c]" />
            Loading questions...
          </div>
        ) : visibleQuestions.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <MessageSquare size={23} />
            </div>
            <p className="mt-4 font-semibold text-gray-800">
              No questions found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Create a question and answer using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {visibleQuestions.map((question) => (
              <article key={question.id} className="p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={question.status} />
                      <span className="text-xs text-gray-400">
                        {question.answers.length}{" "}
                        {question.answers.length === 1 ? "answer" : "answers"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-semibold leading-6 text-gray-900">
                      {question.question}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Asked by {question.askerName || "Anonymous"}
                    </p>

                    <div className="mt-4 space-y-3">
                      {question.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={answer.status} />

                            {answer.isVerified && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                                <ShieldCheck size={12} />
                                Verified
                              </span>
                            )}
                          </div>

                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                            {answer.answer}
                          </p>

                          <p className="mt-2 text-xs text-gray-400">
                            {answer.answererName || "Unnamed answerer"}
                            {answer.answererRole
                              ? ` · ${answer.answererRole}`
                              : ""}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <SmallAction
                              onClick={() => editAnswer(question, answer)}
                              icon={Pencil}
                              label="Edit"
                            />

                            <SmallAction
                              onClick={() =>
                                void changeStatus("setAnswerStatus", {
                                  answerId: answer.id,
                                  status:
                                    answer.status === "PUBLISHED"
                                      ? "PENDING"
                                      : "PUBLISHED",
                                })
                              }
                              icon={
                                answer.status === "PUBLISHED" ? EyeOff : Eye
                              }
                              label={
                                answer.status === "PUBLISHED"
                                  ? "Unpublish"
                                  : "Publish"
                              }
                            />

                            <SmallAction
                              onClick={() =>
                                void changeStatus("verifyAnswer", {
                                  answerId: answer.id,
                                  isVerified: !answer.isVerified,
                                })
                              }
                              icon={ShieldCheck}
                              label={
                                answer.isVerified
                                  ? "Remove verification"
                                  : "Verify"
                              }
                            />

                            <SmallAction
                              onClick={() => void deleteAnswer(answer)}
                              icon={Trash2}
                              label="Delete"
                              danger
                            />
                          </div>
                        </div>
                      ))}

                      {question.answers.length === 0 && (
                        <p className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-400">
                          No answers yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:max-w-[250px] xl:justify-end">
                    <SmallAction
                      onClick={() => editQuestion(question)}
                      icon={Pencil}
                      label="Edit"
                    />

                    <SmallAction
                      onClick={() => addAnswer(question)}
                      icon={Plus}
                      label="Add answer"
                    />

                    <SmallAction
                      onClick={() =>
                        void changeStatus("setQuestionStatus", {
                          questionId: question.id,
                          status:
                            question.status === "PUBLISHED"
                              ? "PENDING"
                              : "PUBLISHED",
                        })
                      }
                      icon={
                        question.status === "PUBLISHED" ? EyeOff : Eye
                      }
                      label={
                        question.status === "PUBLISHED"
                          ? "Unpublish"
                          : "Publish"
                      }
                    />

                    <SmallAction
                      onClick={() => void deleteQuestion(question)}
                      icon={Trash2}
                      label="Delete"
                      danger
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof MessageSquare;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#15945c]/10 text-[#15945c]">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-gray-900">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function SmallAction({
  onClick,
  icon: Icon,
  label,
  danger = false,
}: {
  onClick: () => void;
  icon: typeof Check;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
        danger
          ? "border-red-100 text-red-600 hover:bg-red-50"
          : "border-gray-200 text-gray-600 hover:border-[#15945c]/30 hover:bg-[#15945c]/5 hover:text-[#15945c]"
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}