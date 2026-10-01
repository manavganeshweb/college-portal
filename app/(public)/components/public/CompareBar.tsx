"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  GitCompareArrows,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "college-aadhar-compare";
const EVENT_NAME = "college-compare-updated";

type CompareCollege = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};

export default function CompareBar() {
  const [colleges, setColleges] = useState<CompareCollege[]>([]);
  const [visible, setVisible] = useState(false);

  const loadColleges = () => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      setColleges([]);
      setVisible(false);
      return;
    }

    try {
      const parsed: CompareCollege[] = JSON.parse(stored);

      setColleges(parsed);
      setVisible(parsed.length > 0);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setColleges([]);
      setVisible(false);
    }
  };

  useEffect(() => {
    loadColleges();

    window.addEventListener(EVENT_NAME, loadColleges);

    return () => {
      window.removeEventListener(EVENT_NAME, loadColleges);
    };
  }, []);

  const removeCollege = (id: string) => {
    const updated = colleges.filter((college) => college.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setColleges(updated);
    setVisible(updated.length > 0);

    window.dispatchEvent(new Event(EVENT_NAME));
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);

    setColleges([]);
    setVisible(false);

    window.dispatchEvent(new Event(EVENT_NAME));
  };

  if (!visible) {
    return null;
  }

  const remaining = 3 - colleges.length;
  const canCompare = colleges.length >= 3;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-10px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left side */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex">
              <GitCompareArrows className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                Compare Colleges
              </p>

              <p className="text-xs text-slate-500">
                {canCompare
                  ? "You can compare your selected colleges."
                  : `Select ${remaining} more ${
                      remaining === 1 ? "college" : "colleges"
                    } to compare.`}
              </p>
            </div>
          </div>

          {/* Selected colleges */}
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 lg:justify-center">
            {colleges.map((college) => {
              const initials = college.name
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={college.id}
                  className="relative flex min-w-[190px] max-w-[220px] shrink-0 items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-emerald-100 bg-white">
                    {college.logo ? (
                      <img
                        src={college.logo}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-xs font-bold text-emerald-700">
                        {initials}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {college.name}
                    </p>

                    <p className="text-xs text-emerald-600">
                      Selected
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCollege(college.id)}
                    aria-label={`Remove ${college.name}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            {/* Empty slots */}
            {Array.from({
              length: Math.max(0, 3 - colleges.length),
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="hidden h-[58px] min-w-[150px] shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs font-medium text-slate-400 md:flex"
              >
                Select College
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              Clear
            </button>

            {canCompare ? (
              <Link
                href="/compare"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" />
                Compare Colleges
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-400"
              >
                <GitCompareArrows className="h-4 w-4" />
                Compare Colleges
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}