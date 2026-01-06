"use client";

import { signOut, useSession } from "next-auth/react";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function AdminHeader() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <header className="bg-[#0f0f14] border-b border-white/10 px-6 py-4 flex justify-between items-center md:px-4 md:ml-14">
      <div className="flex items-center gap-3 text-gray-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <FiUser className="text-xl" />
        </div>
        <div className="flex flex-col sm:hidden">
          <span className="font-semibold text-sm">
            {session?.user?.name || "Admin"}
          </span>
          <span className="text-xs text-gray-400">
            {session?.user?.email || "admin@example.com"}
          </span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-500 text-sm font-medium cursor-pointer transition-all hover:bg-red-500/20 sm:px-2.5"
      >
        <FiLogOut className="text-lg" />
        <span className="sm:hidden">Logout</span>
      </button>
    </header>
  );
}
