
"use client";

import { Check, ChevronDown, Search, X, SlidersHorizontal } from "lucide-react";
import {
  createPortal,
} from "react-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type FilterDefinition = {
  key: string;
  label: string;
  options: string[];
  searchable?: boolean;
};

const filters: FilterDefinition[] = [
  {
    key: "stream",
    label: "Stream",
    options: [
      "Engineering",
      "Management",
      "Computer Applications",
      "Science",
      "Commerce",
      "Arts",
      "Medical",
      "Law",
    ],
    searchable: true,
  },
  {
    key: "programType",
    label: "Program Type",
    options: [
      "UG",
      "PG",
      "Diploma",
      "PhD",
      "Certificate",
      "Integrated",
    ],
  },
  {
    key: "collegeType",
    label: "College Type",
    options: [
      "GOVERNMENT",
      "PRIVATE",
      "PUBLIC",
      "DEEMED",
      "AUTONOMOUS",
    ],
  },
  {
    key: "universityType",
    label: "University Type",
    options: ["UNIVERSITY", "COLLEGE", "OTHER"],
  },
  {
    key: "category",
    label: "Category",
    options: [
      "Engineering",
      "Management",
      "Science",
      "Arts",
      "Commerce",
    ],
    searchable: true,
  },
  {
    key: "duration",
    label: "Duration",
    options: ["1", "2", "3", "4", "5", "6"],
  },
  {
    key: "fee",
    label: "Annual Fee",
    options: [
      "Below ₹50,000",
      "₹50,000–₹1 Lakh",
      "₹1–3 Lakh",
      "₹3–5 Lakh",
      "Above ₹5 Lakh",
    ],
  },
  {
    key: "degree",
    label: "Degree",
    options: [
      "B.Tech",
      "M.Tech",
      "MBA",
      "BBA",
      "BCA",
      "MCA",
      "BA",
      "B.Sc",
      "PhD",
    ],
    searchable: true,
  },
  {
    key: "state",
    label: "State",
    options: ["Haryana", "Delhi", "Punjab"],
    searchable: true,
  },
  {
    key: "city",
    label: "City",
    options: [
      "Hisar",
      "Rohtak",
      "Gurugram",
      "New Delhi",
      "Amritsar",
    ],
    searchable: true,
  },
];

const filterKeys = filters.map((filter) => filter.key);

const emptySelection = (): Record<string, string[]> =>
  Object.fromEntries(filterKeys.map((key) => [key, []]));

export default function CollegeFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [selected, setSelected] =
    useState<Record<string, string[]>>(emptySelection);

  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [searches, setSearches] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 16,
    maxHeight: 400,
  });

  const selectedRef = useRef(selected);
  const queryRef = useRef(queryString);
  const hoverCloseTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const filterRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync selections with the current URL.
  useEffect(() => {
    queryRef.current = queryString;

    const params = new URLSearchParams(queryString);
    const next = emptySelection();

    filterKeys.forEach((key) => {
      next[key] = [...new Set(params.getAll(key))];
    });

    selectedRef.current = next;
    setSelected(next);
  }, [queryString]);

  // Clear the delayed-close timer on unmount.
  useEffect(() => {
    return () => {
      if (hoverCloseTimer.current) {
        clearTimeout(hoverCloseTimer.current);
      }
    };
  }, []);

  const selectedCount = useMemo(
    () =>
      Object.values(selected).reduce(
        (total, values) => total + values.length,
        0,
      ),
    [selected],
  );

const cancelHoverClose = useCallback(() => {
  if (hoverCloseTimer.current) {
    clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = null;
  }
}, []);

const scheduleHoverClose = useCallback(() => {
  cancelHoverClose();

  hoverCloseTimer.current = setTimeout(() => {
    setOpenFilter(null);
    hoverCloseTimer.current = null;
  }, 180);
}, [cancelHoverClose]);

  // Keep the portal dropdown aligned with its trigger.
  const updateDropdownPosition = useCallback(() => {
    if (!openFilter) return;

    const element = filterRefs.current[openFilter];

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dropdownWidth = Math.min(288, viewportWidth - 32);
    const edgePadding = 16;
    const gap = 6;

    const left = Math.max(
      edgePadding,
      Math.min(
        rect.left,
        viewportWidth - dropdownWidth - edgePadding,
      ),
    );

    // Prefer below the filter, but open above it near the bottom
    // of the viewport when there is more room above.
    const availableBelow = viewportHeight - rect.bottom - gap - 12;
    const availableAbove = rect.top - gap - 12;

    const openAbove =
      availableBelow < 260 && availableAbove > availableBelow;

    const maxHeight = Math.max(
      140,
      Math.min(400, openAbove ? availableAbove : availableBelow),
    );

    const dropdownHeight = Math.min(
      dropdownRef.current?.offsetHeight || 320,
      maxHeight,
    );

    const top = openAbove
      ? Math.max(8, rect.top - gap - dropdownHeight)
      : rect.bottom + gap;

    setDropdownPosition({
      top,
      left,
      maxHeight,
    });
  }, [openFilter]);

  useEffect(() => {
    if (!openFilter || !mounted) return;

    updateDropdownPosition();

    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener(
        "scroll",
        updateDropdownPosition,
        true,
      );
    };
  }, [openFilter, mounted, updateDropdownPosition]);

  const navigateWithSelection = useCallback(
    (next: Record<string, string[]>) => {
      const params = new URLSearchParams(queryRef.current);

      // Update only college filters and preserve unrelated parameters.
      filterKeys.forEach((key) => {
        params.delete(key);

        [...new Set(next[key] ?? [])].forEach((value) => {
          params.append(key, value);
        });
      });

      // Reset pagination after changing filters.
      params.delete("page");

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      const currentUrl = `${pathname}${
        queryRef.current ? `?${queryRef.current}` : ""
      }`;

      if (url !== currentUrl) {
        queryRef.current = query;
        router.replace(url, { scroll: false });
      }
    },
    [pathname, router],
  );

  const toggleOption = useCallback(
    (key: string, option: string) => {
      const current = selectedRef.current;
      const values = current[key] ?? [];

      const next = {
        ...current,
        [key]: values.includes(option)
          ? values.filter((value) => value !== option)
          : [...values, option],
      };

      selectedRef.current = next;
      setSelected(next);
      navigateWithSelection(next);
    },
    [navigateWithSelection],
  );

  const clearFilter = useCallback(
    (key: string) => {
      const next = {
        ...selectedRef.current,
        [key]: [],
      };

      selectedRef.current = next;
      setSelected(next);
      navigateWithSelection(next);
    },
    [navigateWithSelection],
  );

  const clearAll = useCallback(() => {
    const next = emptySelection();

    selectedRef.current = next;
    setSelected(next);
    setSearches({});
    setOpenFilter(null);
    cancelHoverClose();
    navigateWithSelection(next);
  }, [cancelHoverClose, navigateWithSelection]);

  const activeFilter = filters.find(
    (filter) => filter.key === openFilter,
  );

  const activeValues = activeFilter
    ? selected[activeFilter.key] ?? []
    : [];

  const visibleOptions = activeFilter
    ? activeFilter.options.filter((option) =>
        option.toLowerCase().includes(
          (searches[activeFilter.key] ?? "").toLowerCase(),
        ),
      )
    : [];

  return (
    <>
      <section className="sticky top-10 z-40 isolate border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-row items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#15945c]" />

              <span className="text-sm font-bold text-gray-900">
                Find your institution
              </span>

              {selectedCount > 0 && (
                <span className="rounded-full bg-[#15945c]/10 px-2 py-0.5 text-xs font-semibold text-[#15945c]">
                  {selectedCount} selected
                </span>
              )}
            </div>

            {selectedCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition hover:text-red-600"
              >
                <X className="h-4 w-4" />
                Clear all filters
              </button>
            )}
          </div>

          {/* Scrollable filter controls. The portal dropdown is
              rendered outside this container to prevent clipping. */}
          <div className="overflow-x-auto overflow-y-hidden pb-2">
            <div className="flex w-max min-w-full flex-row items-center gap-2">
              {filters.map((filter) => {
                const values = selected[filter.key] ?? [];
                const isOpen = openFilter === filter.key;

                return (
            <div
  key={filter.key}
  ref={(element) => {
    filterRefs.current[filter.key] = element;
  }}
  className="relative w-fit shrink-0"
>
              <button
    type="button"
    onMouseEnter={() => {
      cancelHoverClose();
      setOpenFilter(filter.key);
    }}
    onMouseLeave={scheduleHoverClose}
    onClick={() => {
      cancelHoverClose();
      setOpenFilter((current) =>
        current === filter.key ? null : filter.key,
      );
    }}
    aria-expanded={isOpen}
    aria-haspopup="true"
    className={`inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
      isOpen || values.length > 0
        ? "border-[#15945c] bg-[#15945c]/10 text-[#117b4c]"
        : "border-gray-200 bg-white text-gray-700 hover:border-[#15945c]/50"
    }`}
  >
                      {filter.label}

                      {values.length > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#15945c] px-1 text-xs text-white">
                          {values.length}
                        </span>
                      )}

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Portal dropdown: outside the sticky filter bar and tables. */}
      {mounted &&
        openFilter &&
        activeFilter &&
        createPortal(
          <>
            {/* Transparent interaction layer. It closes the dropdown
                when clicking elsewhere without covering the page. */}
        

            <div
              ref={dropdownRef}
              className="fixed z-[9999] w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-2xl"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                maxHeight: dropdownPosition.maxHeight,
              }}
              onMouseEnter={cancelHoverClose}
              onMouseLeave={scheduleHoverClose}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="font-semibold text-gray-900">
                  {activeFilter.label}
                </p>

                {activeValues.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearFilter(activeFilter.key)}
                    className="text-xs font-semibold text-[#15945c] hover:text-[#117b4c]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {activeFilter.searchable && (
                <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 px-3">
                  <Search className="h-4 w-4 shrink-0 text-gray-400" />

                  <input
                    autoFocus
                    value={searches[activeFilter.key] ?? ""}
                    onChange={(event) =>
                      setSearches((current) => ({
                        ...current,
                        [activeFilter.key]: event.target.value,
                      }))
                    }
                    placeholder={`Search ${activeFilter.label.toLowerCase()}...`}
                    className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              )}

              <div className="max-h-[min(14rem,50vh)] space-y-0.5 overflow-y-auto overscroll-contain">
                {visibleOptions.map((option) => {
                  const checked = activeValues.includes(option);

                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() =>
                        toggleOption(activeFilter.key, option)
                      }
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        checked
                          ? "bg-[#15945c]/10 text-[#117b4c]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>
                        {activeFilter.key === "duration"
                          ? `${option} ${
                              option === "1" ? "Year" : "Years"
                            }`
                          : option}
                      </span>

                      {checked && (
                        <Check className="h-4 w-4 shrink-0 text-[#15945c]" />
                      )}
                    </button>
                  );
                })}

                {visibleOptions.length === 0 && (
                  <p className="px-3 py-4 text-sm text-gray-500">
                    No options found.
                  </p>
                )}
              </div>

              <p className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-400">
                Changes apply automatically
              </p>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
