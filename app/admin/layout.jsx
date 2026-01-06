"use client";

import { SessionProvider } from "next-auth/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <AdminSidebar />
        <main className="flex flex-1 flex-col">
          <AdminHeader />
          <div className="flex-1 p-6 overflow-y-auto md:p-4">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
