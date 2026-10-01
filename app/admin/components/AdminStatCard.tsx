import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
};

export default function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#15945c]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}