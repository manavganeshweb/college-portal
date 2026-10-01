import {
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  MessageCircleQuestion,
  UserRound,
} from "lucide-react";

import type { CollegeDetail } from "@/services/college.service";

type CollegeQnAProps = {
  collegeName: string;
  questions: CollegeDetail["questions"];
};

type CollegeQuestion = CollegeDetail["questions"][number];

export default function CollegeQnA({
  collegeName,
  questions,
}: CollegeQnAProps) {
  const sortedQuestions = [...questions].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  const answeredQuestions = sortedQuestions.filter(
    (question) => question.answers.length > 0
  );

  return (
    <article
      id="qna"
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10">
            <HelpCircle className="h-5 w-5 text-[#15945c]" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {collegeName} Q&A
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Find answers to questions about {collegeName},
              including admissions, courses, fees, placements and
              student life.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        {sortedQuestions.length === 0 ? (
<EmptyQnA questionCount={questions.length} />
        ) : (
          <>
            {/* Overview */}
            <section>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <OverviewCard
                  icon={<MessageCircleQuestion className="h-4 w-4" />}
                  label="Questions"
                  value={sortedQuestions.length.toString()}
                />

                <OverviewCard
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Answered"
                  value={answeredQuestions.length.toString()}
                />

                <OverviewCard
                  icon={<HelpCircle className="h-4 w-4" />}
                  label="Pending Answers"
                  value={Math.max(
                    sortedQuestions.length -
                      answeredQuestions.length,
                    0
                  ).toString()}
                />
              </div>
            </section>

            {/* Questions */}
            <section>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Questions & Answers
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Browse questions and available answers about{" "}
                  {collegeName}.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {sortedQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                  />
                ))}
              </div>
            </section>

            {/* Ask Question */}
            <section className="rounded-xl border border-[#15945c]/20 bg-[#15945c]/5 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                  <MessageCircleQuestion className="h-5 w-5 text-[#15945c]" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Have a question about this college?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Ask a question and get useful information from
                    the College Aadhar community.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </article>
  );
}

function QuestionCard({
  question,
}: {
  question: CollegeQuestion;
}) {
  const answers = question.answers;

  return (
    <details className="group overflow-hidden rounded-xl border border-slate-200">
      <summary className="flex cursor-pointer list-none items-start gap-3 p-5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#15945c]/10">
          <HelpCircle className="h-4 w-4 text-[#15945c]" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold leading-6 text-slate-900">
            {question.question}
          </h4>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            {question.askerName && (
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-3.5 w-3.5" />
                {question.askerName}
              </span>
            )}

            <span>
              {formatDate(question.createdAt)}
            </span>

            <span>
              {answers.length}{" "}
              {answers.length === 1 ? "Answer" : "Answers"}
            </span>
          </div>
        </div>

        <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
        {answers.length === 0 ? (
          <p className="text-sm text-slate-500">
            No answer has been added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
              />
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

function AnswerCard({
  answer,
}: {
  answer: CollegeQuestion["answers"][number];
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
          <UserRound className="h-4 w-4 text-slate-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              {answer.answererName || "College Aadhar Community"}
            </span>

            {answer.answererRole && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {answer.answererRole}
              </span>
            )}

            {answer.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#15945c]/10 px-2 py-0.5 text-[11px] font-semibold text-[#15945c]">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            {answer.answer}
          </p>

          <p className="mt-3 text-xs text-slate-400">
            {formatDate(answer.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2">
        <span className="text-[#15945c]">{icon}</span>

        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EmptyQnA({
  questionCount,
}: {
  questionCount: number;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />

      <h3 className="mt-3 font-semibold text-slate-900">
        No questions available
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Questions received from database: {questionCount}
      </p>
    </div>
  );
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}