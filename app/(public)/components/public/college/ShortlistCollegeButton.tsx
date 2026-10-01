"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

type ShortlistCollegeButtonProps = {
  collegeId: string;
};

export default function ShortlistCollegeButton({
  collegeId,
}: ShortlistCollegeButtonProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const sessionResponse = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        const sessionData = await sessionResponse.json();

        if (!sessionData.authenticated) {
          setAuthenticated(false);
          return;
        }

        setAuthenticated(true);

        const response = await fetch(
          `/api/user/shortlist?collegeId=${encodeURIComponent(collegeId)}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setShortlisted(Boolean(data.shortlisted));
        }
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, [collegeId]);

  async function handleClick() {
    if (!authenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(
        window.location.pathname,
      )}`;
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/user/shortlist", {
        method: shortlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          collegeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = `/login?redirect=${encodeURIComponent(
            window.location.pathname,
          )}`;
          return;
        }

        throw new Error(data.message);
      }

      setShortlisted(!shortlisted);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || saving}
      className={`inline-flex items-center m-0 justify-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
        shortlisted
          ? "border-[#15945c] bg-[#15945c]/10 text-[#15945c]"
          : "border-slate-200 bg-white text-slate-700 hover:border-[#15945c] hover:text-[#15945c]"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <Bookmark
        size={17}
        fill={shortlisted ? "currentColor" : "none"}
      />

      {saving
        ? "Saving..."
        : shortlisted
          ? "Shortlisted"
          : "Shortlist"}
    </button>
  );
}