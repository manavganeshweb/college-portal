import CutoffForm from "./CutoffForm";

export default function NewCutoffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Cutoff</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add college cutoff data for an examination.
        </p>
      </div>

      <CutoffForm />
    </div>
  );
}