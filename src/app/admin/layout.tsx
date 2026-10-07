"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/materials", label: "Materials" },
  { href: "/admin/past-questions", label: "Past Questions" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/notifications", label: "Notifications" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoadingProfile, isAdmin, profile, logout } = useAuth();

  useEffect(() => {
    if (isLoadingProfile) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoadingProfile, isAdmin, router]);

  if (isLoadingProfile || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
      </div>
    );
  }

  function onLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen flex-1 bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
        <div className="border-b border-neutral-200 px-5 py-4">
          <p className="font-bold text-neutral-900">Student Guide</p>
          <p className="text-xs text-neutral-500">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-status-green text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-neutral-200 p-3">
          <p className="truncate px-2 text-xs text-neutral-500">{profile?.email}</p>
          <button
            onClick={onLogout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-status-red hover:bg-status-red/5"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-3 md:hidden">
          <span className="font-bold text-neutral-900">Admin</span>
          <button onClick={onLogout} className="text-sm font-medium text-status-red">
            Logout
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 bg-white px-3 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
