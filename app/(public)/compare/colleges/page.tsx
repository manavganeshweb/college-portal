import { Suspense } from "react";
import CompareCollegesClient from "./CompareCollegesClient";

export default function CompareCollegesPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Loading college comparison
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Preparing your selected colleges...
            </p>
          </div>
        </main>
      }
    >
      <CompareCollegesClient />
    </Suspense>
  );
}