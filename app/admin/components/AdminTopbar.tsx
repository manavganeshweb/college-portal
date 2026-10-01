"use client";

import {
  Bell,
  ChevronDown,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function AdminTopbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-medium text-gray-400">
          Administration
        </p>

        <h1 className="text-lg font-bold text-gray-900">
          College Aadhar
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#15945c]" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1.5 transition hover:bg-gray-50 sm:px-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf8f1] text-[#15945c]">
              <ShieldCheck size={17} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-gray-900">
                Administrator
              </p>

              <p className="text-[10px] text-gray-400">
                Admin
              </p>
            </div>

            <ChevronDown
              size={15}
              className="hidden text-gray-400 sm:block"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
              >
                Profile
              </button>

              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}