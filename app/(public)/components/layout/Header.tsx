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
type CollegeSearchResult = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  logo: string | null;
  coverImage: string | null;
  collegeType: string | null;
  verified: boolean;
  state: {
    name: string;
  };
  city: {
    name: string;
  } | null;
};

type CourseSearchResult = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  degree: string | null;
  level: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    colleges: number;
  };
};
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState<{
  colleges: CollegeSearchResult[];
  courses: CourseSearchResult[];
}>({
  colleges: [],
  courses: [],
});
const [searchLoading, setSearchLoading] = useState(false);

const searchInputRef = useRef<HTMLInputElement>(null);
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
  if (searchOpen) {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }
}, [searchOpen]);

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
  const query = searchQuery.trim();

  if (query.length < 2) {
    setSearchResults({
      colleges: [],
      courses: [],
    });
    setSearchLoading(false);
    return;
  }

  const controller = new AbortController();

  const timeout = window.setTimeout(async () => {
    try {
      setSearchLoading(true);

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
        {
          signal: controller.signal,
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const result = await response.json();

      if (result.success) {
        setSearchResults(result.data);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setSearchResults({
        colleges: [],
        courses: [],
      });
    } finally {
      if (!controller.signal.aborted) {
        setSearchLoading(false);
      }
    }
  }, 300);

  return () => {
    window.clearTimeout(timeout);
    controller.abort();
  };
}, [searchQuery]);

useEffect(() => {
  if (!searchOpen) {
    return;
  }

  const timeout = window.setTimeout(() => {
    searchInputRef.current?.focus();
  }, 100);

  return () => {
    window.clearTimeout(timeout);
  };
}, [searchOpen]);


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

  
function closeSearch() {
  setSearchOpen(false);
  setSearchQuery("");
  setSearchResults({
    colleges: [],
    courses: [],
  });
}

function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const query = searchQuery.trim();

  if (!query) {
    return;
  }

  window.location.href = `/colleges?search=${encodeURIComponent(query)}`;
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
  onClick={() => setSearchOpen((value) => !value)}
  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
    searchOpen
      ? "bg-green-50 text-green-700"
      : "text-gray-600 hover:bg-gray-100 hover:text-green-700"
  }`}
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
  <AnimatePresence>
  {searchOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeSearch}
        className="fixed inset-0 top-[72px] z-40 bg-slate-900/10 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.18 }}
        className="absolute left-0 right-0 top-full z-50 border-b border-gray-200 bg-white shadow-xl"
      >
        <div className="container-width py-5">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative mx-auto max-w-3xl">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                ref={searchInputRef}
                 type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search colleges, courses, universities..."
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-28 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-24 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="absolute right-2 top-2 h-10 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                Search
              </button>
            </div>
          </form>

          {/* Results */}
          {searchQuery.trim().length >= 2 && (
            <div className="mx-auto mt-4 max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              {searchLoading ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex animate-pulse items-center gap-3"
                    >
                      <div className="h-11 w-11 rounded-xl bg-gray-100" />

                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 rounded bg-gray-100" />
                        <div className="h-2.5 w-1/3 rounded bg-gray-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.colleges.length === 0 &&
                searchResults.courses.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Try searching for a college or course.
                  </p>
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto">
                  {/* Colleges */}
                  {searchResults.colleges.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Colleges
                        </p>
                      </div>

                      {searchResults.colleges.map((college) => (
                        <Link
                          key={college.id}
                          href={`/colleges/${college.slug}`}
                          onClick={closeSearch}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-green-50"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-green-50">
                            {college.logo ? (
                              <img
                                src={college.logo}
                                alt=""
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <GraduationCap
                                size={21}
                                className="text-green-600"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {college.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-gray-500">
                              {college.city?.name
                                ? `${college.city.name}, `
                                : ""}
                              {college.state?.name ?? "India"}
                            </p>
                          </div>

                          <ChevronDown
                            size={16}
                            className="-rotate-90 shrink-0 text-gray-300"
                          />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Courses */}
                  {searchResults.courses.length > 0 && (
                    <div className="border-t border-gray-100 p-2">
                      <div className="px-3 py-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Courses
                        </p>
                      </div>

                      {searchResults.courses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/${course.category.slug}/${course.slug}`}
                          onClick={closeSearch}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-green-50"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-green-600">
                            <GraduationCap size={21} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {course.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-gray-500">
                              {course.category.name} ·{" "}
                              {course._count.colleges} colleges
                            </p>
                          </div>

                          <ChevronDown
                            size={16}
                            className="-rotate-90 shrink-0 text-gray-300"
                          />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* View all */}
                  <div className="border-t border-gray-100 p-3">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                    >
                      View all results for &quot;{searchQuery}&quot;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty search state */}
          {!searchQuery.trim() && (
            <div className="mx-auto mt-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-400">
                  Popular:
                </span>

                {[
                  "B.Tech CSE",
                  "BCA",
                  "Delhi University",
                  "GJUST",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSearchQuery(item)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </header>
  );
}