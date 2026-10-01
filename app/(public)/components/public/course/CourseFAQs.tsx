import {
  ChevronDown,
  HelpCircle,
} from "lucide-react";

type CourseFAQ = {
  id: string;
  question: string;
  answer: string;
};

type CourseFAQsProps = {
  courseName: string;
  faqs?: CourseFAQ[] | null;
};

export default function CourseFAQs({
  courseName,
  faqs,
}: CourseFAQsProps) {
  const validFaqs = faqs?.filter(
    (faq): faq is CourseFAQ =>
      Boolean(faq?.id) &&
      Boolean(faq?.question?.trim()) &&
      Boolean(faq?.answer?.trim())
  );

  if (!validFaqs || validFaqs.length === 0) {
    return null;
  }

  return (
    <section
      id="faqs"
      aria-labelledby="course-faqs-heading"
      className="scroll-mt-24"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <HelpCircle size={17} />
            <span>FAQs</span>
          </div>

          <h2
            id="course-faqs-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Frequently asked questions about {courseName}.
          </p>
        </div>

        <div className="space-y-3">
          {validFaqs.map((faq) => (
            <details
              key={faq.id}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden">
                <span className="text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                  {faq.question}
                </span>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200 transition-all duration-200 group-open:bg-emerald-50 group-open:text-emerald-600 group-open:ring-emerald-100">
                  <ChevronDown
                    size={17}
                    className="transition-transform duration-200 group-open:rotate-180"
                  />
                </span>
              </summary>

              <div className="border-t border-slate-200 bg-white px-5 py-4">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}