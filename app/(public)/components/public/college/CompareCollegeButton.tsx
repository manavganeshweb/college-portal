"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "college-aadhar-compare";
const EVENT_NAME = "college-compare-updated";
const MAX_COLLEGES = 4;

export type CompareCollege = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};

type CompareCollegeButtonProps = {
  college: CompareCollege;
};

export default function CompareCollegeButton({
  college,
}: CompareCollegeButtonProps) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return;

    try {
      const colleges: CompareCollege[] = JSON.parse(stored);

      setSelected(colleges.some((item) => item.id === college.id));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [college.id]);

  const toggleCompare = () => {
    const stored = localStorage.getItem(STORAGE_KEY);

    let colleges: CompareCollege[] = [];

    if (stored) {
      try {
        colleges = JSON.parse(stored);
      } catch {
        colleges = [];
      }
    }

    const alreadySelected = colleges.some(
      (item) => item.id === college.id
    );

    if (alreadySelected) {
      colleges = colleges.filter((item) => item.id !== college.id);
      setSelected(false);
    } else {
      if (colleges.length >= MAX_COLLEGES) {
        window.dispatchEvent(
          new CustomEvent("college-compare-limit", {
            detail: {
              message: "You can compare up to 4 colleges at a time.",
            },
          })
        );

        return;
      }

      colleges = [...colleges, college];
      setSelected(true);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(colleges));

    window.dispatchEvent(new Event(EVENT_NAME));
  };

  return (
    <button
      type="button"
      onClick={toggleCompare}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
        selected
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
      }`}
    >
      {selected ? (
        <>
          <Check className="h-4 w-4" />
          Added to Compare
        </>
      ) : (
        <>
          <GitCompareArrows className="h-4 w-4" />
          Compare
        </>
      )}
    </button>
  );
}