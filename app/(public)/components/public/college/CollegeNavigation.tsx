"use client";

import { useRouter } from "next/navigation";

type NavigationItem = {
  id: string;
  label: string;
  slug: string;
  sectionId: string | null;
  sortOrder: number;
  isActive: boolean;
};

type CollegeNavigationProps = {
  collegeSlug: string;
  navigationItems: NavigationItem[];
  activeSection: string;
};

export default function CollegeNavigation({
  collegeSlug,
  navigationItems,
  activeSection,
}: CollegeNavigationProps) {
  const router = useRouter();

  const activeItems = navigationItems
    .filter((item) => item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function handleNavigation(item: NavigationItem) {
    if (item.slug === "overview") {
      router.push(`/colleges/${collegeSlug}`, {
        scroll: false,
      });
      return;
    }

    router.push(`/colleges/${collegeSlug}/${item.slug}`, {
      scroll: false,
    });
  }

  return (
    <nav className="sticky top-16 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-[1320px] overflow-x-auto px-4 lg:px-6">
        <div className="flex min-w-max">
          {activeItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item)}
              className={[
                "relative px-4 py-4 text-sm font-medium transition",
                item.slug === activeSection
                  ? "text-[#15945c]"
                  : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
            >
              {item.label}

              {item.slug === activeSection && (
                <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-[#15945c]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}