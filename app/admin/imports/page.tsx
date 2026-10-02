"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Database,
  FileSpreadsheet,
  Loader2,
  Upload,
  XCircle,
} from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

type ImportType = "institutions" | "courses" | "fees";

type PreviewResponse = {
  success: boolean;
  type?: ImportType;
  fileName?: string;
  message?: string;

  totalRows?: number;
  validRows?: number;
  invalidRows?: number;
  errorCount?: number;
  importedRows?: number;
createdRows?: number;
updatedRows?: number;

  skippedRows?: number;
  skippedDetails?: {
    rowNumber: number;
    reason: string;
  }[];

  errors?: string[];
  missingHeaders?: string[];
  unexpectedHeaders?: string[];

  preview?: Record<string, unknown>[];
};

const datasets: Array<{
  type: ImportType;
  title: string;
  description: string;
  count: string;
  available: boolean;
}> = [
  {
    type: "institutions",
    title: "Institutions",
    description:
      "Import colleges and institutions with their AISHE codes, locations, contact details, websites and metadata.",
    count: "70,563 records",
    available: true,
  },
 {
  type: "courses",
  title: "Courses",
  description:
    "Import programmes and courses and connect them to their parent institutions.",
  count: "6,704 records",
  available: true,
},
  {
  type: "fees",
  title: "Fees",
  description:
    "Import institution-level and course-specific fee records.",
  count: "803 records",
  available: true,
},
];

export default function AdminImportsPage() {
  const [selectedType, setSelectedType] =
    useState<ImportType>("institutions");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<PreviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedDataset = datasets.find(
    (dataset) => dataset.type === selectedType,
  );

  function resetPreview() {
    setSelectedFile(null);
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDatasetChange(type: ImportType) {
    if (type === selectedType) {
      return;
    }

    setSelectedType(type);
    resetPreview();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setResult(null);
  }
async function handlePreview() {
  if (!selectedFile) {
    return;
  }

  setLoading(true);
  setResult(null);

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("type", selectedType);

    const response = await fetch("/admin/api/admin/imports", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as PreviewResponse;

    setResult(data);
  } catch {
    setResult({
      success: false,
      type: selectedType,
      message: "Unable to connect to the import service.",
    });
  } finally {
    setLoading(false);
  }
}
async function handleImport() {
  if (!selectedFile || !result?.success) {
    return;
  }

  setImporting(true);

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("type", selectedType);
    formData.append("action", "import");

    const response = await fetch(
      "/admin/api/admin/imports",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = (await response.json()) as PreviewResponse;

    setResult(data);
  } catch {
    setResult({
      success: false,
      type: selectedType,
      message: "Unable to connect to the import service.",
    });
  } finally {
    setImporting(false);
  }
}
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-400">
          <span>Admin</span>
          <ChevronRight size={13} />
          <span className="text-gray-600">Data Import</span>
        </div>

        <div className="mt-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Data Import
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500">
            Import structured education data from CSV files into the College
            Aadhar database. Files are validated before any database changes
            are made.
          </p>
        </div>
      </div>

      {/* Dataset selector */}
      <div className="grid gap-4 lg:grid-cols-3">
        {datasets.map((dataset) => {
          const active = dataset.type === selectedType;

          return (
            <button
              key={dataset.type}
              type="button"
              disabled={!dataset.available}
              onClick={() => handleDatasetChange(dataset.type)}
              className={`group relative rounded-2xl border p-5 text-left transition ${
                !dataset.available
                  ? "cursor-not-allowed border-gray-200 bg-gray-50/70 opacity-65"
                  : active
                    ? "border-[#15945c] bg-[#f2fbf6] shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#9bd8b9] hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    active
                      ? "bg-[#15945c] text-white"
                      : "bg-[#eaf8f1] text-[#15945c]"
                  }`}
                >
                  <FileSpreadsheet size={21} />
                </div>

                {!dataset.available ? (
                  <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Coming next
                  </span>
                ) : active ? (
                  <CheckCircle2
                    size={20}
                    className="text-[#15945c]"
                  />
                ) : null}
              </div>

              <h2 className="mt-4 text-base font-bold text-gray-900">
                {dataset.title}
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-gray-500">
                {dataset.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-400">
                <Database size={14} />
                {dataset.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Upload */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf8f1] text-[#15945c]">
              <Upload size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Upload {selectedDataset?.title} CSV
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Select the prepared CSV dataset to validate its structure.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-file"
          />

          <label
            htmlFor="csv-file"
            className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition ${
              selectedFile
                ? "border-[#15945c] bg-[#f5fcf8]"
                : "border-gray-200 bg-gray-50/60 hover:border-[#9bd8b9] hover:bg-[#f8fcfa]"
            }`}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                selectedFile
                  ? "bg-[#dff5e9] text-[#15945c]"
                  : "bg-white text-gray-400 shadow-sm"
              }`}
            >
              <FileSpreadsheet size={26} />
            </div>

            {selectedFile ? (
              <>
                <p className="mt-4 max-w-full truncate px-4 text-sm font-bold text-gray-900">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm font-semibold text-gray-800">
                  Choose a CSV file
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  CSV files only
                </p>
              </>
            )}

            <span className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
              Browse Files
            </span>
          </label>

          {selectedFile && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="shrink-0 text-[#15945c]"
                />

                <span className="truncate text-xs font-medium text-gray-700">
                  Ready to validate: {selectedFile.name}
                </span>
              </div>

              <button
                type="button"
                onClick={resetPreview}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-500 transition hover:bg-white hover:text-gray-800"
              >
                <XCircle size={14} />
                Remove
              </button>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              disabled={!selectedFile || loading}
              onClick={handlePreview}
              className="inline-flex items-center gap-2 rounded-xl bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#117c4d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  Validate & Preview
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Result */}
      {result && (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Validation Result
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  {result.fileName ?? selectedFile?.name}
                </p>
              </div>

            {result.success ? (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf8f1] px-3 py-1.5 text-xs font-bold text-[#13804f]">
    <CheckCircle2 size={14} />
    {result.skippedRows && result.skippedRows > 0
      ? "Validated with skipped rows"
      : "Ready to import"}
  </span>
) : (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
    <AlertCircle size={14} />
    Validation issues
  </span>
)}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {result.message && (
  <div
    className={`rounded-xl border px-4 py-3 text-sm ${
      result.success
        ? result.skippedRows && result.skippedRows > 0
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-red-100 bg-red-50 text-red-700"
    }`}
  >
    {result.message}
  </div>
)}

            {result.missingHeaders &&
              result.missingHeaders.length > 0 && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                    Missing columns
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.missingHeaders.map((header) => (
                      <span
                        key={header}
                        className="rounded-md bg-white px-2 py-1 text-xs font-medium text-red-700"
                      >
                        {header}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {result.unexpectedHeaders &&
              result.unexpectedHeaders.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Additional columns
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.unexpectedHeaders.map((header) => (
                      <span
                        key={header}
                        className="rounded-md bg-white px-2 py-1 text-xs font-medium text-amber-700"
                      >
                        {header}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {typeof result.totalRows === "number" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
  <div className="rounded-2xl border border-gray-200 bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
      Total rows
    </p>
    <p className="mt-2 text-2xl font-bold text-gray-900">
      {(result.totalRows ?? 0).toLocaleString()}
    </p>
  </div>

  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
    <p className="text-sm font-bold text-gray-900">
  Ready to import{" "}
  {(result.validRows ?? 0).toLocaleString()}{" "}
  {selectedType === "institutions"
    ? "institutions"
    : selectedType === "courses"
      ? "courses"
      : "fees"}
</p>
  </div>

  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
      Skipped
    </p>
    <p className="mt-2 text-2xl font-bold text-amber-700">
      {(result.skippedRows ?? 0).toLocaleString()}
    </p>
  </div>

  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
      Invalid
    </p>
    <p className="mt-2 text-2xl font-bold text-red-700">
      {(result.invalidRows ?? 0).toLocaleString()}
    </p>
  </div>
</div>
            )}

            {result.errors && result.errors.length > 0 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    Validation errors
                  </h3>

                  <span className="text-xs text-gray-400">
                    Showing up to 200 errors
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto rounded-xl border border-red-100 bg-red-50/50 p-3">
                  <div className="space-y-2">
                    {result.errors.map((error, index) => (
                      <div
                        key={`${error}-${index}`}
                        className="flex gap-2 text-xs leading-5 text-red-700"
                      >
                        <AlertCircle
                          size={14}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(result.skippedRows ?? 0) > 0 && (
  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          !
        </div>
      </div>

      <div>
       <p className="font-semibold text-amber-900">
  {(result.skippedRows ?? 0).toLocaleString()} rows will be skipped
</p>

        <p className="mt-1 text-sm leading-6 text-amber-800">
  {selectedType === "institutions"
    ? "These institutions do not contain a state in the source dataset, so they cannot currently be linked to a college state. No location data will be fabricated."
    : selectedType === "courses"
      ? "These course records could not be linked to an existing college using their AISHE code. No college relationship will be fabricated."
      : "These fee records could not be linked to the required college or course records."}
</p>

        {result.skippedDetails &&
          result.skippedDetails.length > 0 && (
            <p className="mt-2 text-xs text-amber-700">
              Example skipped rows:{" "}
              {result.skippedDetails
                .slice(0, 5)
                .map((item) => item.rowNumber)
                .join(", ")}
             {(result.skippedRows ?? 0) > 5 ? "…" : ""}
            </p>
          )}
      </div>
    </div>
  </div>
)}

          {result.preview && result.preview.length > 0 && (
  <div className="mt-6">
    <div className="mb-3">
      <h3 className="text-sm font-bold text-gray-900">
        Data preview
      </h3>

      <p className="mt-0.5 text-xs text-gray-500">
        First {result.preview.length} rows from the uploaded dataset.
      </p>
    </div>

    <div className="overflow-x-auto rounded-xl border border-gray-200">
      {selectedType === "institutions" ? (
        <table className="min-w-[900px] w-full text-left text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Row
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                AISHE Code
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Institution
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Type
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Ownership
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                State
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                City
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Website Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {result.preview.map((row, index) => (
              <tr
                key={`${String(row.aishe_code)}-${index}`}
                className="bg-white hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                  {index + 2}
                </td>

                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#13804f]">
                  {String(row.aishe_code ?? "—")}
                </td>

                <td className="max-w-[260px] px-4 py-3 font-medium text-gray-800">
                  <div className="truncate">
                    {String(row.name ?? "—")}
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {String(row.institution_type ?? "—")}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {String(row.ownership ?? "—")}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {String(row.state ?? "—")}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {String(row.city ?? "—")}
                </td>

                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                      row.website_status === "verified"
                        ? "bg-[#eaf8f1] text-[#13804f]"
                        : row.website_status === "needs_check"
                          ? "bg-amber-50 text-amber-700"
                          : row.website_status === "rejected"
                            ? "bg-red-50 text-red-600"
                            : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {String(row.website_status ?? "none")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedType === "courses" ? (
      <table className="min-w-[1150px] w-full text-left text-xs">
  <thead className="bg-gray-50">
    <tr>
      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Row
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Status
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Course ID
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        AISHE Code
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Course
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Degree
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Level
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Duration
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Seats
      </th>

      <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
        Fee
      </th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-100">
    {result.preview.map((row, index) => {
      const courseName = String(row.course_name ?? "");
      const normalizedCourseName = courseName.toLowerCase();

      const isNoise =
        normalizedCourseName.includes("bed room") ||
        normalizedCourseName.includes("master bed room") ||
        normalizedCourseName.includes("copy of") ||
        normalizedCourseName.includes("no objection certificate") ||
        normalizedCourseName.includes("fire safety certificate") ||
        normalizedCourseName.includes("building safety certificate") ||
        normalizedCourseName.includes("registration renewal certificate");

      return (
        <tr
          key={`${String(row.course_id)}-${index}`}
          className={
            isNoise
              ? "bg-amber-50/40"
              : "bg-white hover:bg-gray-50"
          }
        >
          <td className="whitespace-nowrap px-4 py-3 text-gray-400">
            {index + 2}
          </td>

          <td className="whitespace-nowrap px-4 py-3">
            {isNoise ? (
              <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                Skipped
              </span>
            ) : (
              <span className="rounded-full bg-[#eaf8f1] px-2 py-1 text-[10px] font-bold text-[#13804f]">
                Ready
              </span>
            )}
          </td>

          <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#13804f]">
            {String(row.course_id ?? "—")}
          </td>

          <td className="whitespace-nowrap px-4 py-3 text-gray-600">
            {String(row.aishe_code ?? "—")}
          </td>

          <td className="max-w-[300px] px-4 py-3 font-medium text-gray-800">
            <div className="truncate">
              {String(row.course_name ?? "—")}
            </div>
          </td>

          <td className="whitespace-nowrap px-4 py-3 text-gray-600">
            {String(row.degree ?? "—")}
          </td>

          <td className="whitespace-nowrap px-4 py-3">
            <span className="rounded-full bg-[#eaf8f1] px-2 py-1 text-[10px] font-bold text-[#13804f]">
              {String(row.level ?? "—")}
            </span>
          </td>

          <td className="whitespace-nowrap px-4 py-3 text-gray-600">
            {row.duration_years
              ? `${String(row.duration_years)} years`
              : row.duration_months
                ? `${String(row.duration_months)} months`
                : "—"}
          </td>

          <td className="whitespace-nowrap px-4 py-3 text-gray-600">
            {String(row.total_seats ?? "—")}
          </td>

          <td className="whitespace-nowrap px-4 py-3 text-gray-600">
            {row.fee_amount
              ? `${String(row.fee_amount)} ${
                  row.fee_currency ?? "INR"
                }`
              : "—"}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
      ) : (
        <table className="min-w-[900px] w-full text-left text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Row
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Fee ID
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                AISHE Code
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Course ID
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Program
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Type
              </th>
              <th className="whitespace-nowrap px-4 py-3 font-bold text-gray-500">
                Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {result.preview.map((row, index) => (
              <tr
                key={`${String(row.fee_id)}-${index}`}
                className="bg-white hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                  {index + 2}
                </td>

                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#13804f]">
                  {String(row.fee_id ?? "—")}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {String(row.aishe_code ?? "—")}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {String(row.course_id ?? "—")}
                </td>

                <td className="max-w-[260px] px-4 py-3 font-medium text-gray-800">
                  <div className="truncate">
                    {String(row.program_name ?? "—")}
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {String(row.fee_type ?? "—")}
                </td>

                <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-800">
                  {row.amount
                    ? `${String(row.amount)} ${
                        row.currency ?? "INR"
                      }`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)}
       {result.success &&
  typeof result.importedRows !== "number" &&
  (result.validRows ?? 0) > 0 && (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#bfe8d0] bg-[#f5fcf8] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-bold text-gray-900">
          Ready to import{" "}
          {(result.validRows ?? 0).toLocaleString()}{" "}
          {selectedType === "institutions"
            ? "institutions"
            : selectedType === "courses"
              ? "courses"
              : "fees"}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {(result.skippedRows ?? 0).toLocaleString()}{" "}
          rows will remain skipped based on the validation and
          relationship checks.
        </p>
      </div>

      <button
        type="button"
        disabled={importing}
        onClick={handleImport}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#117c4d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {importing ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />
            Importing...
          </>
        ) : (
          <>
            <Database size={17} />
            Import{" "}
            {(result.validRows ?? 0).toLocaleString()}{" "}
            {selectedType === "institutions"
              ? "Institutions"
              : selectedType === "courses"
                ? "Courses"
                : "Fees"}
          </>
        )}
      </button>
    </div>
  )}
  {typeof result.importedRows === "number" && (
  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
    <div className="flex gap-3">
      <CheckCircle2
        size={20}
        className="mt-0.5 shrink-0 text-emerald-600"
      />

      <div>
        <p className="font-semibold text-emerald-900">
          Database import completed
        </p>

        <p className="mt-1 text-sm leading-6 text-emerald-800">
  {result.importedRows.toLocaleString()}{" "}
  {selectedType === "institutions"
    ? "institutions"
    : selectedType === "courses"
      ? "courses"
      : "fees"}{" "}
  were imported successfully.
</p>

        <p className="mt-1 text-xs text-emerald-700">
          Created:{" "}
          {(result.createdRows ?? 0).toLocaleString()}
          {" · "}
          Updated:{" "}
          {(result.updatedRows ?? 0).toLocaleString()}
          {" · "}
          Skipped:{" "}
          {(result.skippedRows ?? 0).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
)}
          </div>
        </section>
      )}
    </div>
  );
}