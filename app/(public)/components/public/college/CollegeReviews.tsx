"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pencil,
  Send,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type { CollegeDetail } from "@/services/college.service";

type CollegeReviewsProps = {
  college: CollegeDetail;
};

type InitialReview = CollegeDetail["reviews"][number];

type ApiReview = {
  id: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedStudent: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
};

type MyReview = ApiReview | null;

export default function CollegeReviews({
  college,
}: CollegeReviewsProps) {
  const initialReviews = college.reviews ?? [];

  const [reviews, setReviews] =
    useState<ApiReview[]>([]);

  const [myReview, setMyReview] =
    useState<MyReview>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [rating, setRating] =
    useState(5);

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
   * Your existing college route uses the college slug.
   * This is also what the review API now expects.
   */
  const reviewApiUrl = `/api/colleges/${college.slug}/reviews`;

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const response = await fetch(
          reviewApiUrl,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load reviews.",
          );
        }

        if (cancelled) return;

        setReviews(data.reviews ?? []);
        setMyReview(data.myReview ?? null);

        if (data.myReview) {
          setRating(data.myReview.rating);
          setTitle(data.myReview.title);
          setContent(data.myReview.content);
        }
      } catch (err) {
        if (cancelled) return;

        /*
         * Keep the existing server-rendered reviews
         * available if the API request fails.
         */
        setReviews([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load reviews.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [reviewApiUrl]);

  const displayReviews = useMemo(() => {
    if (loading) {
      return [];
    }

    if (reviews.length > 0) {
      return reviews;
    }

    /*
     * Convert existing CollegeDetail reviews into the
     * shape needed by this component.
     */
    return initialReviews.map((review) => ({
      id: review.id,
      rating:
        "rating" in review &&
        typeof review.rating === "number"
          ? review.rating
          : 0,
      title:
        "title" in review &&
        typeof review.title === "string"
          ? review.title
          : "",
      content:
        "content" in review &&
        typeof review.content === "string"
          ? review.content
          : "",
      isVerifiedStudent:
        "isVerifiedStudent" in review &&
        typeof review.isVerifiedStudent === "boolean"
          ? review.isVerifiedStudent
          : false,
      isPublished: true,
      createdAt:
        "createdAt" in review &&
        review.createdAt
          ? new Date(review.createdAt).toISOString()
          : new Date().toISOString(),
      user:
        "user" in review &&
        review.user &&
        typeof review.user === "object" &&
        "name" in review.user
          ? {
              id:
                "id" in review.user &&
                typeof review.user.id === "string"
                  ? review.user.id
                  : "",
              name:
                typeof review.user.name === "string"
                  ? review.user.name
                  : "Student",
              avatar:
                "avatar" in review.user &&
                typeof review.user.avatar === "string"
                  ? review.user.avatar
                  : null,
            }
          : null,
    }));
  }, [reviews, initialReviews, loading]);

  async function handleSubmitReview(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (title.trim().length < 3) {
      setError(
        "Review title must contain at least 3 characters.",
      );
      return;
    }

    if (content.trim().length < 10) {
      setError(
        "Review content must contain at least 10 characters.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        reviewApiUrl,
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(
            editing
              ? {
                  reviewId: myReview?.id,
                  rating,
                  title,
                  content,
                }
              : {
                  rating,
                  title,
                  content,
                },
          ),
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        const redirect =
          window.location.pathname;

        window.location.href =
          `/login?redirect=${encodeURIComponent(
            redirect,
          )}`;

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit review.",
        );
      }

      setMyReview(data.review);

      if (editing) {
        setMessage(
          "Review updated successfully and sent for moderation.",
        );
      } else {
        setMessage(
          "Review submitted successfully and sent for moderation.",
        );
      }

      setEditing(false);
      setShowForm(false);

      /*
       * A new review is not published immediately,
       * so don't add it to the public review list.
       */
      if (!editing) {
        setTitle("");
        setContent("");
        setRating(5);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit review.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function startEditing() {
    if (!myReview) return;

    setRating(myReview.rating);
    setTitle(myReview.title);
    setContent(myReview.content);

    setMessage("");
    setError("");
    setEditing(true);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditing(false);

    setMessage("");
    setError("");

    if (myReview) {
      setRating(myReview.rating);
      setTitle(myReview.title);
      setContent(myReview.content);
    } else {
      setRating(5);
      setTitle("");
      setContent("");
    }
  }

  async function handleDeleteReview() {
    if (!myReview) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your review?",
    );

    if (!confirmed) return;

    setDeleting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${reviewApiUrl}?reviewId=${encodeURIComponent(
          myReview.id,
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href =
          `/login?redirect=${encodeURIComponent(
            window.location.pathname,
          )}`;

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete review.",
        );
      }

      setMyReview(null);
      setMessage("Your review was deleted.");

      setTitle("");
      setContent("");
      setRating(5);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete review.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function openReviewForm() {
    setMessage("");
    setError("");

    if (myReview) {
      setRating(myReview.rating);
      setTitle(myReview.title);
      setContent(myReview.content);
      setEditing(true);
    } else {
      setRating(5);
      setTitle("");
      setContent("");
      setEditing(false);
    }

    setShowForm(true);
  }

  return (
    <article className="space-y-6">
      <section className="rounded-2xl bg-white p-5 shadow-sm md:p-7">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-[#15945c]">
            Student Reviews
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
            {college.name} Reviews
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
            Read reviews and experiences available for{" "}
            {college.name} on College Aadhar.
          </p>
        </div>

        {/* Review count + write button */}
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Available Reviews
            </p>

            <p className="mt-1 text-3xl font-bold text-gray-900">
              {loading
                ? "—"
                : displayReviews.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {displayReviews.length === 1
                ? "review available"
                : "reviews available"}
            </p>
          </div>

          <button
            type="button"
            onClick={openReviewForm}
            className="flex min-h-[110px] items-center justify-center gap-2 rounded-xl bg-[#15945c] px-6 text-sm font-semibold text-white transition hover:bg-[#117c4d]"
          >
            <Star size={18} />
            {myReview
              ? "Manage My Review"
              : "Write a Review"}
          </button>
        </div>

        {/* Messages */}
        {(message || error) && (
          <div
            className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error ? (
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />
            )}

            <p>{error || message}</p>
          </div>
        )}

        {/* My review status */}
        {myReview && !showForm && (
          <div className="mt-5 rounded-xl border border-[#15945c]/20 bg-[#15945c]/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    Your Review
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      myReview.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {myReview.isPublished
                      ? "Published"
                      : "Pending moderation"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {myReview.isPublished
                    ? "Your review is visible to other users."
                    : "Your review will appear after moderation."}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-[#15945c] hover:text-[#15945c]"
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={handleDeleteReview}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {deleting ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={15} />
                  )}

                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review form */}
        {showForm && (
          <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editing
                    ? "Edit Your Review"
                    : "Write a Review"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Share your experience with{" "}
                  {college.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelForm}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white hover:text-gray-700"
                aria-label="Close review form"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmitReview}
              className="mt-6 space-y-5"
            >
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-800">
                  Your rating
                </label>

                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setRating(value)
                        }
                        className="rounded-md p-1 transition hover:bg-white"
                        aria-label={`Rate ${value} out of 5`}
                      >
                        <Star
                          size={25}
                          className={
                            value <= rating
                              ? "fill-[#f59e0b] text-[#f59e0b]"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ),
                  )}

                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="review-title"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Review title
                </label>

                <input
                  id="review-title"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Give your review a title"
                  maxLength={120}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="review-content"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Your experience
                </label>

                <textarea
                  id="review-content"
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  placeholder="Tell other students about your experience..."
                  rows={6}
                  maxLength={2000}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                  required
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {content.length}/2000
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15945c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#117c4d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      {editing
                        ? "Updating..."
                        : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      {editing
                        ? "Update Review"
                        : "Submit Review"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TOC */}
        <nav className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="font-semibold text-gray-900">
            Table of Contents
          </h2>

          <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
            <a
              href="#reviews-overview"
              className="text-[#15945c] hover:underline"
            >
              Review Overview
            </a>

            <a
              href="#student-reviews"
              className="text-[#15945c] hover:underline"
            >
              Student Reviews
            </a>
          </div>
        </nav>

        {/* Overview */}
        <section
          id="reviews-overview"
          className="mt-9 scroll-mt-24"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {college.name} Review Overview
          </h2>

          <p className="mt-3 text-[15px] leading-7 text-gray-700">
            Reviews submitted for {college.name} are
            displayed below. The review information shown is
            based on records currently available in the
            College Aadhar database.
          </p>
        </section>

        {/* Reviews */}
        <section
          id="student-reviews"
          className="mt-9 scroll-mt-24"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Student Reviews
            </h2>

            {!loading &&
              displayReviews.length > 0 && (
                <span className="text-sm text-gray-500">
                  {displayReviews.length}{" "}
                  {displayReviews.length === 1
                    ? "review"
                    : "reviews"}
                </span>
              )}
          </div>

          {loading ? (
            <ReviewLoadingState />
          ) : displayReviews.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-[#15945c]">
                <UserRound size={22} />
              </div>

              <p className="mt-4 font-medium text-gray-800">
                No reviews available yet.
              </p>

              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                Be the first to share your experience with{" "}
                {college.name}.
              </p>

              <button
                type="button"
                onClick={openReviewForm}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#15945c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117c4d]"
              >
                <Star size={16} />
                Write a Review
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {displayReviews.map(
                (review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                  />
                ),
              )}
            </div>
          )}
        </section>
      </section>
    </article>
  );
}

function ReviewLoadingState() {
  return (
    <div className="mt-5 space-y-4">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />

            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-5 h-5 w-48 rounded bg-gray-200" />

          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-4/5 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: ApiReview;
}) {
  const author =
    review.user?.name || "Student";

  const initials = author
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = new Date(
    review.createdAt,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-xl border border-gray-200 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {review.user?.avatar ? (
            <img
              src={review.user.avatar}
              alt={author}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 font-semibold text-[#15945c]">
              {initials}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900">
              {author}
            </h3>

            <p className="mt-0.5 text-xs text-gray-400">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2">
          <Star
            size={15}
            className="fill-[#f59e0b] text-[#f59e0b]"
          />

          <span className="text-sm font-semibold text-[#15945c]">
            {review.rating}/5
          </span>
        </div>
      </div>

      {review.title && (
        <h4 className="mt-4 text-lg font-semibold text-gray-900">
          {review.title}
        </h4>
      )}

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {review.content}
      </p>

      {review.isVerifiedStudent && (
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-[#15945c]">
          <CheckCircle2 size={14} />
          Verified Student
        </div>
      )}
    </article>
  );
}