import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  variant?: "default" | "hero";
};

export default function Breadcrumbs({
  items,
  variant = "default",
}: BreadcrumbsProps) {
  const isHero = variant === "hero";

  return (
    <nav
      className={`flex flex-wrap items-center gap-2 text-sm ${
        isHero ? "text-white/70" : "text-slate-500"
      }`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={
                  isHero
                    ? "transition-colors hover:text-white"
                    : "transition-colors hover:text-emerald-600"
                }
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isHero
                    ? "font-medium text-white"
                    : "font-medium text-slate-700"
                }
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight
                size={14}
                className={isHero ? "text-white/40" : "text-slate-400"}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}