"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

type CollegeData = {
  id: string;
  name: string;
  logo: string | null;
  shortName: string | null;
};

type CourseData = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  level: string;
  category: {
    name: string;
    slug: string;
  };
};

type AuthMode = "login" | "register";

type JourneyPopupProps = {
  isAuthenticated: boolean;
};

const FIELD_CLASS =
  "h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10 disabled:cursor-not-allowed disabled:opacity-60";

const ICON_CLASS =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500";

const LABEL_CLASS = "mb-1 block text-xs font-medium text-slate-700";

export default function JourneyPopup({
  isAuthenticated,
}: JourneyPopupProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const [college, setCollege] = useState<CollegeData | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesExpanded, setCoursesExpanded] = useState(false);

  const [authMode, setAuthMode] = useState<AuthMode>("register");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // --------------------------------------------------
  // Detect college page
  // --------------------------------------------------

  const pathSegments = pathname.split("/").filter(Boolean);

  const collegeSlug =
    pathSegments[0] === "colleges" && pathSegments[1]
      ? pathSegments[1]
      : null;

  // --------------------------------------------------
  // Fetch college information
  // --------------------------------------------------

  useEffect(() => {
    if (!collegeSlug) {
      setCollege(null);
      return;
    }

    let cancelled = false;

    async function fetchCollege() {
      try {
        const response = await fetch(`/api/colleges/${collegeSlug}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setCollege(null);
          }
          return;
        }

        const data = await response.json();
        const collegeData = data?.college ?? data?.data ?? data;

        if (!collegeData?.name) {
          if (!cancelled) {
            setCollege(null);
          }
          return;
        }

        if (!cancelled) {
          setCollege({
            id: collegeData.id,
            name: collegeData.name,
            logo: collegeData.logo ?? null,
            shortName: collegeData.shortName ?? null,
          });
        }
      } catch (error) {
        console.error("Failed to fetch college:", error);

        if (!cancelled) {
          setCollege(null);
        }
      }
    }

    void fetchCollege();

    return () => {
      cancelled = true;
    };
  }, [collegeSlug]);

  // --------------------------------------------------
  // Fetch popular courses
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function fetchCourses() {
      setCoursesLoading(true);

      try {
        const response = await fetch("/api/courses/popular", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          console.error("Popular courses API failed:", response.status);

          if (!cancelled) {
            setCourses([]);
          }

          return;
        }

        const data = await response.json();

        let courseList: CourseData[] = [];

        if (Array.isArray(data)) {
          courseList = data;
        } else if (Array.isArray(data?.courses)) {
          courseList = data.courses;
        } else if (Array.isArray(data?.data)) {
          courseList = data.data;
        } else if (Array.isArray(data?.data?.courses)) {
          courseList = data.data.courses;
        }

        if (!cancelled) {
          setCourses(courseList);
        }
      } catch (error) {
        console.error("Failed to fetch popular courses:", error);

        if (!cancelled) {
          setCourses([]);
        }
      } finally {
        if (!cancelled) {
          setCoursesLoading(false);
        }
      }
    }

    void fetchCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------
  // Automatically show popup for logged-out users
  // --------------------------------------------------

// Automatically show popup for logged-out users
useEffect(() => {
  if (isAuthenticated) {
    setIsOpen(false);
    return;
  }

  const timer = window.setTimeout(() => {
    setIsOpen(true);
  }, 10_000); // Initial popup delay: 10 seconds

  return () => {
    window.clearTimeout(timer);
  };
}, [isAuthenticated]);
  // --------------------------------------------------
  // Close popup when authentication changes
  // --------------------------------------------------

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
    }
  }, [isAuthenticated]);

  // --------------------------------------------------
  // Lock background scrolling
  // --------------------------------------------------

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // --------------------------------------------------
  // Listen for custom open event
  // --------------------------------------------------

  useEffect(() => {
    function openJourneyPopup() {
      if (!isAuthenticated) {
        setIsOpen(true);
      }
    }

    window.addEventListener("open-journey-popup", openJourneyPopup);

    return () => {
      window.removeEventListener("open-journey-popup", openJourneyPopup);
    };
  }, [isAuthenticated]);

  // --------------------------------------------------
  // Close popup
  // --------------------------------------------------

function closePopup() {
  setIsOpen(false);
  setCoursesExpanded(false);

  if (isAuthenticated) return;

  // Reopen the popup after one minute if the user is still logged out.
  window.setTimeout(() => {
    if (!isAuthenticated) {
      setIsOpen(true);
    }
  }, 60_000);
}
  // --------------------------------------------------
  // Switch authentication mode
  // --------------------------------------------------

  function switchAuthMode(mode: AuthMode) {
    setAuthMode(mode);
    setAuthError("");
  }

  // --------------------------------------------------
  // Login / Register
  // --------------------------------------------------

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (authMode === "register") {
      if (trimmedName.length < 2) {
        setAuthError("Please enter your full name.");
        return;
      }

      if (!trimmedPhone) {
        setAuthError("Please enter your phone number.");
        return;
      }

      if (!/^[0-9+\-\s()]{7,20}$/.test(trimmedPhone)) {
        setAuthError("Please enter a valid phone number.");
        return;
      }

      if (password.length < 8) {
        setAuthError("Password must be at least 8 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }

      if (!acceptedTerms) {
        setAuthError("Please accept the Terms of Use to continue.");
        return;
      }
    }

    if (!trimmedEmail) {
      setAuthError("Please enter your email address.");
      return;
    }

    if (!password) {
      setAuthError("Please enter your password.");
      return;
    }

    setAuthLoading(true);

    try {
      const endpoint =
        authMode === "login" ? "/api/auth/login" : "/api/auth/register";

      const body =
        authMode === "login"
          ? {
              email: trimmedEmail,
              password,
            }
          : {
              name: trimmedName,
              phone: trimmedPhone,
              email: trimmedEmail,
              password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data &&
          typeof data === "object" &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : authMode === "login"
              ? "Unable to login. Please check your details."
              : "Unable to create your account.";

        setAuthError(message);
        return;
      }

      window.location.href = "/";
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  // --------------------------------------------------
  // Dynamic content
  // --------------------------------------------------

  const title = college?.name
    ? `Continue your journey with ${college.name}`
    : "Start Your Education Journey Today!";

  const subtitle = college?.name
    ? `Explore courses, fees, admission, placements and more at ${college.name}.`
    : "Discover colleges, courses and opportunities that match your future goals.";

  if (isAuthenticated) {
    return null;
  }

  // --------------------------------------------------
  // Popup
  // --------------------------------------------------

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-slate-950/60 p-2 backdrop-blur-sm sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePopup();
            }
          }}
        >
          {/* Ambient background */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#15945c]/20 blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl"
              animate={{
                x: [0, -30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Main modal */}

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="journey-popup-title"
            className="relative flex max-h-[76dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:rounded-2xl"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 10,
            }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Top progress line */}

            <motion.div
              className="absolute left-0 right-0 top-0 z-30 h-0.5 origin-left bg-[#15945c]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 60,
                ease: "linear",
              }}
            />

            {/* Scrollable content */}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {/* Header */}

              <header className="flex items-center justify-between gap-2 px-3 pb-2 pt-4 sm:px-4">
                <Link
                  href="/"
                  onClick={closePopup}
                  className="group flex min-w-0 items-center gap-2"
                  aria-label="College Aadhar home"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#15945c] text-white shadow-sm">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-base font-extrabold tracking-tight text-slate-900">
                      College Aadhar
                    </p>

                    <p className="text-[10px] font-medium text-slate-500">
                      Your education journey
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={closePopup}
                  aria-label="Close popup"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15945c]"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              {/* College information and hero */}

              <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-white px-3 pb-3 pt-1 sm:px-4">
                <div className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full border-[18px] border-[#15945c]/5" />

                {college && (
                  <div className="relative mb-3 flex items-center gap-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white p-1.5 shadow-sm">
                      {college.logo ? (
                        <img
                          src={college.logo}
                          alt={`${college.name} logo`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <GraduationCap className="h-6 w-6 text-[#15945c]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold leading-snug text-slate-800">
                        {college.shortName || college.name}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-slate-600">
                        Explore admissions and courses
                      </p>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <h2
                    id="journey-popup-title"
                    className="max-w-full text-xl font-extrabold leading-tight tracking-tight text-slate-950"
                  >
                    {title}
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-slate-600">
                    {subtitle}
                  </p>

                  <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-sm font-bold text-[#15945c]">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>Guidance at Every Step</span>
                  </div>
                </div>
              </section>

              {/* Authentication panel */}

              <section className="rounded-t-xl border-t border-slate-100 bg-white px-3 pb-4 sm:rounded-t-2xl sm:px-4">
                {/* Register / Login tabs */}

                <div className="grid grid-cols-2 border-b border-slate-200">
                  {(["register", "login"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => switchAuthMode(mode)}
                      aria-pressed={authMode === mode}
                      className={`relative flex min-h-10 items-center justify-center px-2 py-2 text-sm font-medium transition ${
                        authMode === mode
                          ? "text-[#15945c]"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {mode === "register" ? "Register" : "Login"}

                      {authMode === mode && (
                        <motion.span
                          layoutId="journey-auth-tab"
                          className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-[#15945c]"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Animated authentication forms */}

                <AnimatePresence mode="wait" initial={false}>
                  <motion.form
                    key={authMode}
                    onSubmit={handleAuthSubmit}
                    initial={{
                      opacity: 0,
                      x: authMode === "login" ? -10 : 10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: authMode === "login" ? 10 : -10,
                    }}
                    transition={{ duration: 0.18 }}
                    className="mt-3 space-y-2.5"
                  >
                    {/* Full name */}

                    {authMode === "register" && (
                      <div>
                        <label
                          htmlFor="journey-name"
                          className={LABEL_CLASS}
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <User className={ICON_CLASS} />

                          <input
                            id="journey-name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                            disabled={authLoading}
                            className={FIELD_CLASS}
                          />
                        </div>
                      </div>
                    )}
{/* Email Address + Mobile Number */}
{/* Email + Mobile Number */}
{authMode === "register" ? (
  <div className="grid grid-cols-2 gap-2">
    {/* Email — half width in Register */}
    <div className="min-w-0">
      <label htmlFor="journey-email" className={LABEL_CLASS}>
        Email <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Mail className={ICON_CLASS} />

        <input
          id="journey-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          autoComplete="email"
          required
          disabled={authLoading}
          className={FIELD_CLASS}
        />
      </div>
    </div>

    {/* Mobile — half width in Register */}
    <div className="min-w-0">
      <label htmlFor="journey-phone" className={LABEL_CLASS}>
        Mobile Number <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Phone className={ICON_CLASS} />

        <input
          id="journey-phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Mobile number"
          autoComplete="tel"
          inputMode="tel"
          required
          disabled={authLoading}
          className={FIELD_CLASS}
        />
      </div>
    </div>
  </div>
) : (
  /* Email — full width in Login */
  <div className="w-full min-w-0">
    <label htmlFor="journey-email" className={LABEL_CLASS}>
      Email Address <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <Mail className={ICON_CLASS} />

      <input
        id="journey-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        autoComplete="email"
        required
        disabled={authLoading}
        className={FIELD_CLASS}
      />
    </div>
  </div>
)}
                    {/* Password */}

                    <div>
                      <label
                        htmlFor="journey-password"
                        className={LABEL_CLASS}
                      >
                        Password <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Lock className={ICON_CLASS} />

                        <input
                          id="journey-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(event) =>
                            setPassword(event.target.value)
                          }
                          placeholder="Enter your password"
                          autoComplete={
                            authMode === "login"
                              ? "current-password"
                              : "new-password"
                          }
                          minLength={authMode === "register" ? 8 : undefined}
                          required
                          disabled={authLoading}
                          className={`${FIELD_CLASS} pr-10`}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm password */}

                    {authMode === "register" && (
                      <div>
                        <label
                          htmlFor="journey-confirm-password"
                          className={LABEL_CLASS}
                        >
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                          <Lock className={ICON_CLASS} />

                          <input
                            id="journey-confirm-password"
                            type={
                              showConfirmPassword ? "text" : "password"
                            }
                            value={confirmPassword}
                            onChange={(event) =>
                              setConfirmPassword(event.target.value)
                            }
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            disabled={authLoading}
                            className={`${FIELD_CLASS} pr-10`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((value) => !value)
                            }
                            className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Terms and conditions */}

                    {authMode === "register" && (
                      <label className="flex cursor-pointer items-start gap-2 pt-1 text-xs leading-5 text-slate-600">
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(event) =>
                            setAcceptedTerms(event.target.checked)
                          }
                          className="peer sr-only"
                        />

                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-transparent transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#15945c] peer-checked:border-[#15945c] peer-checked:bg-[#15945c] peer-checked:text-white">
                          <Check className="h-3 w-3" />
                        </span>

                        <span>
                          By submitting this form, you accept and agree to our{" "}
                          <Link
                            href="/terms"
                            onClick={closePopup}
                            className="font-medium text-[#15945c] underline-offset-2 hover:underline"
                          >
                            Terms of Use
                          </Link>
                          .
                        </span>
                      </label>
                    )}

                    {/* Authentication errors */}

                    <AnimatePresence initial={false}>
                      {authError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                          role="alert"
                          aria-live="polite"
                        >
                          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium leading-5 text-red-600">
                            {authError}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit button */}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="group flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#15945c] px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#117c4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15945c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {authLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          {authMode === "login"
                            ? "Logging in..."
                            : "Creating account..."}
                        </>
                      ) : (
                        <>
                          {authMode === "login"
                            ? "LOGIN"
                            : "CREATE ACCOUNT"}

                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    {/* Alternative authentication mode */}

                  </motion.form>
                </AnimatePresence>
              </section>

              {/* Popular courses */}

  
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}