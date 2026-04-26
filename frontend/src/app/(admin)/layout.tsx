"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Star, Images, Calendar, Megaphone,
  Clock, DollarSign, Users, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/deities", label: "Deities", icon: Star },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/timings", label: "Timings", icon: Clock },
  { href: "/admin/donations", label: "Donations", icon: DollarSign },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) router.replace("/auth/login?redirect=" + encodeURIComponent(pathname));
  }, [user, pathname, router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    logout();
    toast.success("Logged out successfully");
    router.replace("/auth/login");
  };

  if (!user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-golden/20 rounded-lg flex items-center justify-center">
            <span className="text-golden font-cinzel font-bold text-lg">ॐ</span>
          </div>
          <div>
            <p className="font-cinzel font-bold text-white text-sm leading-tight">SVS Devasthanam</p>
            <p className="text-white/50 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-item ${active ? "sidebar-item-active" : "sidebar-item-inactive"}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto text-golden" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-white font-poppins font-medium text-sm truncate">{user.name}</p>
          <p className="text-white/50 text-xs truncate">{user.email}</p>
          <span className="mt-1 inline-block badge-info text-xs">{user.role.replace(/_/g, " ")}</span>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-item sidebar-item-inactive w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-admin-sidebar shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-admin-sidebar flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-poppins text-gray-500 hover:text-saffron transition-colors"
            >
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
