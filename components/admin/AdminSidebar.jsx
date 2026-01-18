// Force sidebar update
// Force sidebar update
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiUser,
  FiAward,
  FiBriefcase,
  FiBook,
  FiFolder,
  FiMenu,
  FiX,
  FiMail,
} from "react-icons/fi";

const menuItems = [
  { href: "/admin", icon: FiHome, label: "Dashboard" },
  { href: "/admin/bio", icon: FiUser, label: "Bio" },
  { href: "/admin/skills", icon: FiAward, label: "Skills" },
  { href: "/admin/experience", icon: FiBriefcase, label: "Experience" },
  { href: "/admin/education", icon: FiBook, label: "Education" },
  { href: "/admin/messages", icon: FiMail, label: "Messages" },
  { href: "/admin/projects", icon: FiFolder, label: "Projects" },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/admin/messages/unread");
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error("Failed to fetch unread count");
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar - Desktop: always visible, Mobile: slide in */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0f0f14] border-r border-white/10 
          flex flex-col shadow-2xl transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isMessageLink = item.label === "Messages";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 border-l-[3px] group relative
                  ${
                    isActive
                      ? "text-purple-600 bg-purple-600/10 border-l-purple-600"
                      : "text-gray-400 bg-transparent border-l-transparent hover:bg-purple-600/5 hover:text-purple-600"
                  }
                `}
              >
                <div className="relative">
                  <Icon className="text-xl transition-transform group-hover:scale-110" />
                  {isMessageLink && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-lg shadow-red-500/50">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="font-medium">{item.label}</span>
                {isMessageLink && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500/10 text-red-500 text-xs py-0.5 px-2 rounded-full border border-red-500/20">
                    {unreadCount} new
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-gray-500 text-center">
            Portfolio Admin v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
