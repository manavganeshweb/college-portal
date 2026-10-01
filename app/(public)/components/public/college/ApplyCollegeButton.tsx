"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type ApplyCollegeButtonProps = {
  collegeId: string;
};

type ProfileResponse = {
  user?: {
    phone?: string | null;
  };
};

type ApplicationStatusResponse = {
  applied?: boolean;
};

export default function ApplyCollegeButton({
  collegeId,
}: ApplyCollegeButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadApplicationStatus() {
      try {
        const response = await fetch(
          `/api/user/applications?collegeId=${encodeURIComponent(
            collegeId
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          return;
        }

        const data =
          (await response.json()) as ApplicationStatusResponse;

        if (!cancelled && response.ok) {
          setApplied(Boolean(data.applied));
        }
      } catch {
        // Ignore status-check errors.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadApplicationStatus();

    return () => {
      cancelled = true;
    };
  }, [collegeId]);

  async function loadProfilePhone() {
    try {
      const response = await fetch(
        "/api/user/profile",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data =
        (await response.json()) as ProfileResponse;

      const profilePhone = data.user?.phone ?? "";

      if (profilePhone) {
        setPhoneNumber(
          profilePhone.replace(/\D/g, "").slice(0, 10)
        );
      }
    } catch {
      // Keep the field empty if profile loading fails.
    }
  }

  async function handleApplyClick() {
    if (isLoading || isApplying || applied) {
      return;
    }

    await loadProfilePhone();

    setShowModal(true);
  }

  async function handleSubmitApplication(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanedPhone = phoneNumber.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      window.alert(
        "Enter a valid 10-digit mobile number."
      );
      return;
    }

    try {
      setIsApplying(true);

      const response = await fetch(
        "/api/user/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            collegeId,
            phoneNumber: cleanedPhone,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        setShowModal(false);

        router.push(
          `/login?redirect=${encodeURIComponent(
            pathname
          )}`
        );

        return;
      }

      if (response.status === 409) {
        setApplied(true);
        setShowModal(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to submit application."
        );
      }

      setApplied(true);
      setShowModal(false);
      setPhoneNumber("");
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to submit application."
      );
    } finally {
      setIsApplying(false);
    }
  }

  if (applied) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
      >
        <CheckCircle2 className="h-5 w-5" />
        Application Added
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleApplyClick}
        disabled={isLoading || isApplying}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Checking...
          </>
        ) : (
          "Apply Now"
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="apply-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Apply to this college
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Confirm your mobile number to submit your
                  college application.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitApplication}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="application-phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>

                <input
                  id="application-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  placeholder="Enter 10-digit mobile number"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                  required
                />

                <p className="mt-2 text-xs text-gray-400">
                  You can change this number before submitting.
                </p>
              </div>

              <button
                type="submit"
                disabled={isApplying}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15945c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#117b4c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}