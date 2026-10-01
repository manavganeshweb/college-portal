"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Building2,
  ChevronRight,
  ClipboardList,
  Database,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Newspaper,
  Settings,
  ShieldCheck,
  Trophy,
  Upload,
    Users,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Education Data",
    items: [
      {
        label: "Colleges",
        href: "/admin/colleges",
        icon: Building2,
      },
      {
        label: "Courses",
        href: "/admin/courses",
        icon: BookOpen,
      },
      {
        label: "Exams",
        href: "/admin/exams",
        icon: GraduationCap,
      },
      {
        label: "Cutoffs",
        href: "/admin/cutoffs",
        icon: BarChart3,
      },
      {
        label: "Rankings",
        href: "/admin/rankings",
        icon: Trophy,
      },
      {
        label: "Placements",
        href: "/admin/placements",
        icon: Database,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "News",
        href: "/admin/news",
        icon: Newspaper,
      },
      {
        label: "Articles",
        href: "/admin/articles",
        icon: FileText,
      },
      {
        label: "Scholarships",
        href: "/admin/scholarships",
        icon: GraduationCap,
      },
      {
        label: "Study Abroad",
        href: "/admin/study-abroad",
        icon: BookOpen,
      },
      {
        label: "Questions",
        href: "/admin/questions",
        icon: HelpCircle,
      },
    ],
  },
{
  title: "Management",
  items: [
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Applications",
      href: "/admin/applications",
      icon: ClipboardList,
    },
    {
      label: "Data Import",
      href: "/admin/imports",
      icon: Upload,
    },
    {
      label: "Audit Logs",
      href: "/admin/audit-logs",
      icon: ShieldCheck,
    },
  ],
},
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-[72px] items-center justify-between border-b border-gray-100 px-5">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15945c] text-white">
            <GraduationCap size={22} />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">
              College Aadhar
            </p>

            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Admin Panel
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-[#eaf8f1] text-[#13804f]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          active
                            ? "text-[#15945c]"
                            : "text-gray-400 group-hover:text-gray-600"
                        }
                      />

                      <span className="flex-1">{item.label}</span>

                      {active && (
                        <ChevronRight
                          size={15}
                          className="text-[#15945c]"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-100 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings size={18} />
          <span>Back to Website</span>
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-50 hidden lg:block">
        {sidebar}
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#15945c] text-white shadow-lg lg:hidden"
        aria-label="Open admin navigation"
      >
        <LayoutDashboard size={20} />
      </button>
    </>
  );
}