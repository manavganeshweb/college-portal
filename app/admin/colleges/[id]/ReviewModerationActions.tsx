"use client";

import { useState } from "react";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

type ReviewModerationActionsProps = {
  collegeId: string;
  reviewId: string;
  isPublished: boolean;
};

export default function ReviewModerationActions({
  collegeId,
  reviewId,
  isPublished,
}: ReviewModerationActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function updateReview(published: boolean) {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/colleges/${collegeId}/reviews`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId,
            isPublished: published,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update review.",
        );
      }

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update review.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/colleges/${collegeId}/reviews`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete review.",
        );
      }

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete review.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {isPublished ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateReview(false)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <X size={13} />
          )}
          Unpublish
        </button>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateReview(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#15945c] px-3 text-xs font-semibold text-white transition hover:bg-[#117a4b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Check size={13} />
          )}
          Approve
        </button>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={deleteReview}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 size={13} />
        Delete
      </button>
    </div>
  );
}