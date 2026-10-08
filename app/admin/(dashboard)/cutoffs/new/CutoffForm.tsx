"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Exam = {
  id: string;
  name: string;
};

type College = {
  id: string;
  name: string;
};

type FormData = {
  collegeId: string;
  examId: string;
  year: string;
  category: string;
  gender: string;
  course: string;
  openingRank: string;
  closingRank: string;
};

const initialForm: FormData = {
  collegeId: "",
  examId: "",
  year: new Date().getFullYear().toString(),
  category: "",
  gender: "",
  course: "",
  openingRank: "",
  closingRank: "",
};

export default function CutoffForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>(initialForm);
  const [exams, setExams] = useState<Exam[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);

        const [examsResponse, collegesResponse] = await Promise.all([
          fetch("/admin/api/admin/exams?limit=100"),
          fetch("/admin/api/admin/colleges?limit=100"),
        ]);

        if (!examsResponse.ok) {
          throw new Error("Failed to load exams");
        }

        if (!collegesResponse.ok) {
          throw new Error("Failed to load colleges");
        }

        const examsResult = await examsResponse.json();
        const collegesResult = await collegesResponse.json();

        setExams(
          examsResult?.data?.exams ??
            examsResult?.data ??
            []
        );

        setColleges(
          collegesResult?.data?.colleges ??
            collegesResult?.data ??
            []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load form data"
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!form.collegeId) {
      setError("Please select a college.");
      return;
    }

    if (!form.examId) {
      setError("Please select an exam.");
      return;
    }

    if (!form.year) {
      setError("Please enter the cutoff year.");
      return;
    }

    if (!form.category.trim()) {
      setError("Please enter the category.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/admin/api/admin/exam-cutoffs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collegeId: form.collegeId,
            examId: form.examId,
            year: Number(form.year),
            category: form.category.trim(),
            gender: form.gender || null,
            course: form.course.trim() || null,
            openingRank: form.openingRank
              ? Number(form.openingRank)
              : null,
            closingRank: form.closingRank
              ? Number(form.closingRank)
              : null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create cutoff"
        );
      }

      router.push(`/admin/cutoffs/${result.data.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingOptions) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          Loading exams and colleges...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Cutoff Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Exam
            </label>

            <select
              value={form.examId}
              onChange={(event) =>
                updateField("examId", event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            >
              <option value="">Select exam</option>

              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              College
            </label>

            <select
              value={form.collegeId}
              onChange={(event) =>
                updateField(
                  "collegeId",
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            >
              <option value="">Select college</option>

              {colleges.map((college) => (
                <option
                  key={college.id}
                  value={college.id}
                >
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Year
            </label>

            <input
              type="number"
              value={form.year}
              onChange={(event) =>
                updateField("year", event.target.value)
              }
              min="2000"
              max="2100"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <input
              type="text"
              value={form.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value
                )
              }
              placeholder="e.g. General, OBC, SC"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Gender
            </label>

            <select
              value={form.gender}
              onChange={(event) =>
                updateField("gender", event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="">Not specified</option>

              {/* Add your exact Prisma Gender enum values here */}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Course
            </label>

            <input
              type="text"
              value={form.course}
              onChange={(event) =>
                updateField(
                  "course",
                  event.target.value
                )
              }
              placeholder="e.g. B.Tech CSE"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Opening Rank
            </label>

            <input
              type="number"
              value={form.openingRank}
              onChange={(event) =>
                updateField(
                  "openingRank",
                  event.target.value
                )
              }
              min="0"
              placeholder="e.g. 1200"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Closing Rank
            </label>

            <input
              type="number"
              value={form.closingRank}
              onChange={(event) =>
                updateField(
                  "closingRank",
                  event.target.value
                )
              }
              min="0"
              placeholder="e.g. 8500"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/cutoffs")}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Cutoff"}
        </button>
      </div>
    </form>
  );
}