"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Sparkles,
  User,
  LogOut,
  Heart,
  FileText,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JourneyPopup from "../public/JourneyPopup";

const navigation = [
  {
    label: "Colleges",
    href: "/colleges",
  },
  {
    label: "Courses",
    href: "/courses",
  },
  {
    label: "Exams",
    href: "/exams",
  },
  {
    label: "Study Abroad",
    href: "/study-abroad",
  },
];

type UserData = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!cancelled && data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setUserMenuOpen(false);
      setMobileOpen(false);
    }
  }

  const userInitial =
    user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-white"
      }`}
    >
      <div className="container-width">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              whileHover={{ rotate: -5, scale: 1.05 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20"
            >
              <GraduationCap size={23} />
            </motion.div>

            <div>
              <div className="text-lg font-extrabold tracking-tight text-gray-900">
                College <span className="text-green-600">Aadhar</span>
              </div>

              <div className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400 sm:block">
                Build • Decide • Grow
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-700"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/college-predictor"
              className="ml-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              <Sparkles size={15} />
              Predictor
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-green-700"
            >
              <Search size={19} />
            </button>

            {authLoading ? (
              <div className="h-10 w-24 animate-pulse rounded-xl bg-gray-100" />
            ) : user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 transition hover:border-green-200 hover:bg-green-50"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                      {userInitial}
                    </span>
                  )}

                  <span className="max-w-28 truncate text-sm font-semibold text-gray-800">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={15}
                    className={`text-gray-500 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl"
                    >
                      <div className="border-b border-gray-100 px-3 py-3">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                        >
                          <User size={17} />
                          Profile
                        </Link>

                        <Link
                          href="/shortlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                        >
                          <Heart size={17} />
                          My Shortlist
                        </Link>

                        <Link
                          href="/applications"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                        >
                          <FileText size={17} />
                          My Applications
                        </Link>

                       
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={17} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  href="/college-predictor"
                  className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition hover:bg-green-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <div className="container-width space-y-1 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                >
                  {item.label}
                  <ChevronDown
                    className="-rotate-90"
                    size={16}
                  />
                </Link>
              ))}

              <Link
                href="/college-predictor"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
              >
                <Sparkles size={16} />
                College Predictor
              </Link>

              {authLoading ? (
                <div className="mx-4 h-11 animate-pulse rounded-xl bg-gray-100" />
              ) : user ? (
                <>
                  <div className="mt-2 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                          {userInitial}
                        </span>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <User size={17} />
                    Profile
                  </Link>

                  <Link
                    href="/shortlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <Heart size={17} />
                    My Shortlist
                  </Link>

                  <Link
                    href="/applications"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <FileText size={17} />
                    My Applications
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <JourneyPopup isAuthenticated={Boolean(user)} />
    </header>
  );
}