"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
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

export default function JourneyPopup({
  isAuthenticated,
}: JourneyPopupProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const [college, setCollege] = useState<CollegeData | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesExpanded, setCoursesExpanded] = useState(false);

  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  // Fetch college
  // --------------------------------------------------

 useEffect(() => {
  if (!collegeSlug) {
    setCollege(null);
    return;
  }

  let cancelled = false;

  async function fetchCollege() {
    try {
      const response = await fetch(
        `/api/colleges/${collegeSlug}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (!cancelled) {
          setCollege(null);
        }
        return;
      }

      const data = await response.json();

      // Support both:
      // { id, name, logo, shortName }
      // and:
      // { college: { id, name, logo, shortName } }
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

  fetchCollege();

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
        console.error(
          "Popular courses API failed:",
          response.status
        );

        if (!cancelled) {
          setCourses([]);
        }

        return;
      }

      const data = await response.json();

     

      /*
       * Support different API response structures:
       *
       * 1. [ ...courses ]
       * 2. { courses: [ ...courses ] }
       * 3. { data: [ ...courses ] }
       * 4. { data: { courses: [ ...courses ] } }
       */
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
      console.error(
        "Failed to fetch popular courses:",
        error
      );

      if (!cancelled) {
        setCourses([]);
      }
    } finally {
      if (!cancelled) {
        setCoursesLoading(false);
      }
    }
  }

  fetchCourses();

  return () => {
    cancelled = true;
  };
}, []);
  // --------------------------------------------------
  // Show popup every 60 seconds for logged-out users
  // --------------------------------------------------

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
      return;
    }

    const timer = window.setInterval(() => {
      setIsOpen(true);
    }, 10000);

    return () => {
      window.clearInterval(timer);
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
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
  const openJourneyPopup = () => {
    if (!isAuthenticated) {
      setIsOpen(true);
    }
  };

  window.addEventListener("open-journey-popup", openJourneyPopup);

  return () => {
    window.removeEventListener("open-journey-popup", openJourneyPopup);
  };
}, [isAuthenticated]);

  // --------------------------------------------------
  // Close
  // --------------------------------------------------

  function closePopup() {
    setIsOpen(false);
    setCoursesExpanded(false);
  }

  // --------------------------------------------------
  // Auth mode
  // --------------------------------------------------

  function switchAuthMode(mode: AuthMode) {
    setAuthMode(mode);
    setAuthError("");
  }

  // --------------------------------------------------
  // Login / Register
  // --------------------------------------------------

  async function handleAuthSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
        setAuthError(
          "Password must be at least 8 characters long."
        );
        return;
      }

      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
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
        authMode === "login"
          ? "/api/auth/login"
          : "/api/auth/register";

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
      setAuthError(
        "Something went wrong. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  // --------------------------------------------------
  // Content
  // --------------------------------------------------

const title = college?.name
  ? `Continue your journey with ${college.name}`
  : "Start your education journey with College Aadhar";

 const subtitle = college?.name
  ? `Explore courses, fees, admission, placements and more at ${college.name}.`
  : "Discover colleges, courses and opportunities that match your future goals.";
  if (isAuthenticated) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-slate-950/65 px-3 py-3 backdrop-blur-md sm:px-5 sm:py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
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

          {/* 
            IMPORTANT:
            The popup is fixed inside a 100dvh flex container.
            This keeps it centered relative to the viewport,
            even when the page behind it was scrolled.
          */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="journey-popup-title"
            className="relative flex max-h-[94dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:max-h-[92dvh] sm:rounded-[28px]"
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Progress bar */}
            <motion.div
              className="absolute left-0 right-0 top-0 z-30 h-1 origin-left bg-[#15945c]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 60,
                ease: "linear",
              }}
            />

            {/* Scrollable popup content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-2 pt-5 sm:px-7 sm:pt-6">
                {/* College Aadhar logo */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#15945c] text-white shadow-sm">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold tracking-tight text-slate-900">
                      College Aadhar
                    </p>
                    <p className="text-[10px] font-medium text-slate-500">
                      Your education journey
                    </p>
                  </div>
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={closePopup}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Hero */}
              <div className="relative overflow-hidden px-4 pb-5 pt-3 sm:px-7 sm:pb-6">
                <div className="absolute -right-20 -top-24 h-48 w-48 rounded-full border-[24px] border-[#15945c]/5" />

                <div className="absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-[#15945c]/5 blur-2xl" />

                {/* College identity */}
                {college && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                      {college.logo ? (
                        <img
                          src={college.logo}
                          alt={college.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <GraduationCap className="h-4 w-4 text-[#15945c]" />
                      )}
                    </div>

                    <span className="max-w-[260px] truncate text-xs font-semibold text-[#15945c]">
                      {college.shortName || college.name}
                    </span>
                  </motion.div>
                )}

                {/* Sparkles */}
                <div className="mb-3 flex items-center gap-2 text-[#15945c]">
                  <Sparkles className="h-4 w-4" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                    Your next step starts here
                  </span>
                </div>

                <h2
                  id="journey-popup-title"
                  className="relative max-w-[470px] text-[25px] font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-[30px]"
                >
                  {title}
                </h2>

                <p className="relative mt-3 max-w-[460px] text-sm leading-6 text-slate-600 sm:text-[14px]">
                  {subtitle}
                </p>
              </div>

              {/* Auth */}
              <div className="px-4 pb-4 sm:px-7">
                {/* Auth tabs */}
                <div className="rounded-xl bg-slate-100 p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => switchAuthMode("login")}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        authMode === "login"
                          ? "bg-white text-[#15945c] shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      onClick={() => switchAuthMode("register")}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        authMode === "register"
                          ? "bg-white text-[#15945c] shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Register
                    </button>
                  </div>
                </div>

                {/* Animated forms */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.form
                    key={authMode}
                    onSubmit={handleAuthSubmit}
                    initial={{
                      opacity: 0,
                      x: authMode === "login" ? -12 : 12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: authMode === "login" ? 12 : -12,
                    }}
                    transition={{ duration: 0.18 }}
                    className="mt-3 space-y-2.5"
                  >
                    {/* Register name */}
                    {authMode === "register" && (
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="text"
                          value={name}
                          onChange={(event) =>
                            setName(event.target.value)
                          }
                          placeholder="Full name"
                          autoComplete="name"
                          disabled={authLoading}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15945c] focus:bg-white focus:ring-2 focus:ring-[#15945c]/10 disabled:opacity-60"
                        />
                      </div>
                    )}

                    {/* Register phone */}
                    {authMode === "register" && (
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="tel"
                          value={phone}
                          onChange={(event) =>
                            setPhone(event.target.value)
                          }
                          placeholder="Phone number"
                          autoComplete="tel"
                          inputMode="tel"
                          disabled={authLoading}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15945c] focus:bg-white focus:ring-2 focus:ring-[#15945c]/10 disabled:opacity-60"
                        />
                      </div>
                    )}

                    {/* Email */}
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="Email address"
                        autoComplete="email"
                        disabled={authLoading}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15945c] focus:bg-white focus:ring-2 focus:ring-[#15945c]/10 disabled:opacity-60"
                      />
                    </div>

                    {/* Password */}
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type={
                          showPassword ? "text" : "password"
                        }
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Password"
                        autoComplete={
                          authMode === "login"
                            ? "current-password"
                            : "new-password"
                        }
                        disabled={authLoading}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15945c] focus:bg-white focus:ring-2 focus:ring-[#15945c]/10 disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Confirm password */}
                    {authMode === "register" && (
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(
                              event.target.value
                            )
                          }
                          placeholder="Confirm password"
                          autoComplete="new-password"
                          disabled={authLoading}
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#15945c] focus:bg-white focus:ring-2 focus:ring-[#15945c]/10 disabled:opacity-60"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (value) => !value
                            )
                          }
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
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
                    )}

                    {/* Error */}
                    <AnimatePresence initial={false}>
                      {authError && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="overflow-hidden"
                        >
                          <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium leading-5 text-red-600">
                            {authError}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#15945c] px-4 text-sm font-bold text-white shadow-sm shadow-[#15945c]/20 transition hover:bg-[#117c4d] disabled:cursor-not-allowed disabled:opacity-60"
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
                            ? "Login to continue"
                            : "Create account"}

                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>

                    {/* Mode switch */}
                    <p className="text-center text-[11px] text-slate-500">
                      {authMode === "login" ? (
                        <>
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={() =>
                              switchAuthMode("register")
                            }
                            className="font-bold text-[#15945c] hover:underline"
                          >
                            Create one
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() =>
                              switchAuthMode("login")
                            }
                            className="font-bold text-[#15945c] hover:underline"
                          >
                            Login
                          </button>
                        </>
                      )}
                    </p>
                  </motion.form>
                </AnimatePresence>
              </div>

              {/* Popular Courses */}
              <div
                className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-7 sm:py-4"
                onMouseEnter={() =>
                  setCoursesExpanded(true)
                }
                onMouseLeave={() =>
                  setCoursesExpanded(false)
                }
              >
                {/* Single compact row */}
                <button
                  type="button"
                  onClick={() =>
                    setCoursesExpanded(
                      (value) => !value
                    )
                  }
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-emerald-200 hover:shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#15945c]">
                      <BookOpen className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        Popular Courses
                      </p>

                      <p className="truncate text-[10px] text-slate-500">
                        {coursesLoading
                          ? "Loading courses..."
                          : courses.length
                            ? `${courses.length} courses · Hover or tap to explore`
                            : "Explore popular courses"}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      coursesExpanded
                        ? "rotate-180 text-[#15945c]"
                        : ""
                    }`}
                  />
                </button>

                {/* Course list */}
                <AnimatePresence initial={false}>
                  {coursesExpanded && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        y: -5,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2.5">
                        {coursesLoading ? (
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {[1, 2, 3, 4].map(
                              (item) => (
                                <div
                                  key={item}
                                  className="h-12 animate-pulse rounded-lg bg-slate-100"
                                />
                              )
                            )}
                          </div>
                        ) : courses.length > 0 ? (
                          <>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {courses.map((course) => (
                                <Link
                                  key={course.id}
                                  href={`/courses/${course.category.slug}/${course.slug}`}
                                  onClick={closePopup}
                                  className="group flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 transition hover:border-emerald-100 hover:bg-emerald-50/50"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-[11px] font-bold text-slate-800 transition group-hover:text-[#15945c]">
                                      {course.shortName ||
                                        course.name}
                                    </p>

                                    <p className="mt-0.5 text-[9px] text-slate-400">
                                      {course.level}
                                    </p>
                                  </div>

                                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#15945c]" />
                                </Link>
                              ))}
                            </div>

                            <Link
                              href="/courses"
                              onClick={closePopup}
                              className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-emerald-50 py-2 text-[11px] font-bold text-[#15945c] transition hover:bg-emerald-100"
                            >
                              View all courses
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </>
                        ) : (
                          <p className="py-3 text-center text-xs text-slate-500">
                            No popular courses available right now.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}