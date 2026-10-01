"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

type Exam = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
};

type PredictorResult = {
  college: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    verified: boolean;
    city: {
      name: string;
    };
    state: {
      name: string;
    };
  };
  year: number;
  course: string | null;
  openingRank: number | null;
  closingRank: number | null;
};

type CollegePredictorFormProps = {
  exams: Exam[];
};

const categories = [
  "OPEN",
  "OBC",
  "SC",
  "ST",
  "EWS",
];

const genders = [
  {
    value: "",
    label: "Any",
  },
  {
    value: "MALE",
    label: "Male",
  },
  {
    value: "FEMALE",
    label: "Female",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

export default function CollegePredictorForm({
  exams,
}: CollegePredictorFormProps) {
  const [examId, setExamId] = useState("");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("OPEN");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const [results, setResults] = useState<PredictorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setResults([]);

    if (!examId || !rank || !category) {
      setError("Please complete the required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/college-predictor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examId,
            rank: Number(rank),
            category,
            gender: gender || undefined,
            course: course || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to generate predictions."
        );
      }

      setResults(data.results || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="predictor"
      className="bg-slate-50 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Form */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Enter your details
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We'll compare your rank with available cutoff data.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="exam"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Entrance Exam
                </label>

                <select
                  id="exam"
                  value={examId}
                  onChange={(event) =>
                    setExamId(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                >
                  <option value="">Select exam</option>

                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.shortName || exam.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="rank"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Your Rank
                </label>

                <input
                  id="rank"
                  type="number"
                  min="1"
                  value={rank}
                  onChange={(event) =>
                    setRank(event.target.value)
                  }
                  placeholder="e.g. 12500"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {genders.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="course"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Preferred Course
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <input
                  id="course"
                  type="text"
                  value={course}
                  onChange={(event) =>
                    setCourse(event.target.value)
                  }
                  placeholder="e.g. B.Tech CSE"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    Predict Colleges
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Your Results
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                Colleges matching your rank
              </h2>
            </div>

            {results.length === 0 && !loading && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-emerald-500" />

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Your predicted colleges will appear here
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Enter your exam, rank and category to compare
                  against available cutoff records.
                </p>
              </div>
            )}

            {loading && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-44 animate-pulse rounded-2xl bg-white"
                  />
                ))}
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((result) => (
                  <div
                    key={`${result.college.id}-${result.year}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {result.college.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {result.college.city.name},{" "}
                          {result.college.state.name}
                        </p>
                      </div>

                      {result.college.verified && (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-medium uppercase text-slate-400">
                          Opening
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {result.openingRank?.toLocaleString() ??
                            "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-50 p-3">
                        <p className="text-[10px] font-medium uppercase text-emerald-600">
                          Closing
                        </p>

                        <p className="mt-1 text-sm font-bold text-emerald-800">
                          {result.closingRank?.toLocaleString() ??
                            "—"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-slate-400">
                      Cutoff year: {result.year}
                      {result.course
                        ? ` • ${result.course}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!loading &&
              results.length === 0 &&
              examId &&
              rank && (
                <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
                  <p className="text-sm font-medium text-amber-800">
                    No matching cutoff records were found for
                    your selected criteria.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    This means the current database does not have
                    matching cutoff data yet. It does not mean that
                    admission is impossible.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}