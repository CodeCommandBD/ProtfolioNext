"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiAward,
  FiBriefcase,
  FiBook,
  FiFolder,
  FiMenu,
  FiX,
} from "react-icons/fi";

const menuItems = [
  { href: "/admin", icon: FiHome, label: "Dashboard" },
  { href: "/admin/bio", icon: FiUser, label: "Bio" },
  { href: "/admin/skills", icon: FiAward, label: "Skills" },
  { href: "/admin/experience", icon: FiBriefcase, label: "Experience" },
  { href: "/admin/education", icon: FiBook, label: "Education" },
  { href: "/admin/projects", icon: FiFolder, label: "Projects" },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[1001] bg-purple-600 border-none rounded-lg p-3 text-white cursor-pointer md:hidden"
      >
        {isOpen ? (
          <FiX className="text-2xl" />
        ) : (
          <FiMenu className="text-2xl" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-[999] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-[260px] bg-[#0f0f14] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
          md:fixed md:top-0 md:left-0 md:h-screen md:z-[1000]
          ${isOpen ? "md:translate-x-0" : "md:-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="p-6 text-2xl font-bold text-purple-600 border-b border-white/10">
          Admin Panel
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 border-l-[3px]
                  ${
                    isActive
                      ? "text-purple-600 bg-purple-600/10 border-l-purple-600"
                      : "text-gray-400 bg-transparent border-l-transparent hover:bg-purple-600/5 hover:text-purple-600"
                  }
                `}
              >
                <Icon className="text-xl" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
