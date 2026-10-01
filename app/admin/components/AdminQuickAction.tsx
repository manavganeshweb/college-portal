import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type AdminQuickActionProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export default function AdminQuickAction({
  title,
  description,
  href,
  icon: Icon,
}: AdminQuickActionProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b9e5ce] hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#15945c]">
          <Icon size={21} />
        </div>

        <ArrowUpRight
          size={18}
          className="text-gray-300 transition group-hover:text-[#15945c]"
        />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </Link>
  );
}