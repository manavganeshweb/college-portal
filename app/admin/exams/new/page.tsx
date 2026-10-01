import ExamForm from "./ExamForm";

export default function NewExamPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add Exam</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new entrance or competitive exam to the platform.
          </p>
        </div>

        <ExamForm />
      </div>
    </div>
  );
}