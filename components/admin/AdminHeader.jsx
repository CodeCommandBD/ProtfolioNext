"use client";

import { signOut, useSession } from "next-auth/react";
import { FiLogOut, FiUser, FiMenu } from "react-icons/fi";

export default function AdminHeader({ toggleSidebar }) {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <header className="bg-[#0f0f14] border-b border-white/10 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-40 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <FiMenu size={24} />
        </button>

        <div className="flex items-center gap-3 text-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <FiUser className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {session?.user?.name || "Admin"}
            </span>
            <span className="text-xs text-gray-400">
              {session?.user?.email || "admin@example.com"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all duration-200 text-sm font-medium group"
      >
        <FiLogOut className="group-hover:rotate-180 transition-transform duration-300" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}
