"use client";

import { useRouter } from "next/navigation";

export type CourseNavigationItem = {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  isActive?: boolean;
};

type CourseNavigationProps = {
  categorySlug: string;
  courseSlug: string;
  navigationItems: CourseNavigationItem[];
  activeSection: string;
};

export default function CourseNavigation({
  categorySlug,
  courseSlug,
  navigationItems,
  activeSection,
}: CourseNavigationProps) {
  const router = useRouter();

  const activeItems = navigationItems
    .filter((item) => item.isActive !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function handleNavigation(item: CourseNavigationItem) {
    if (item.slug === "overview") {
      router.push(`/courses/${categorySlug}/${courseSlug}`, {
        scroll: false,
      });

      return;
    }

    router.push(
      `/courses/${categorySlug}/${courseSlug}/${item.slug}`,
      {
        scroll: false,
      },
    );
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
              {item.title}

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