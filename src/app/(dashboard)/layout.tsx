"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SubscribeRequiredDialog } from "@/components/SubscribeRequiredDialog";
import { ContactSupportDialog } from "@/components/ContactSupportDialog";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", gated: false },
  { href: "/examai", label: "ExamAI", gated: true },
  { href: "/profile", label: "Profile", gated: false },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoadingProfile, isSubscribed, profileHasError } =
    useAuth();
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  useEffect(() => {
    if (!isLoadingProfile && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoadingProfile, router]);

  if (isLoadingProfile || !isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
      </div>
    );
  }

  function handleNavClick(e: React.MouseEvent, item: (typeof NAV_ITEMS)[number]) {
    if (item.gated && !isSubscribed) {
      e.preventDefault();
      setShowSubscribeDialog(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="sticky top-0 z-30 bg-status-green shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <span className="text-lg font-bold text-white">Student Guide</span>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-white text-status-green"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-6">
        {children}
      </main>

      <button
        onClick={() => setShowContactDialog(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-whatsapp-green px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
      >
        Chat with Us
      </button>

      <SubscribeRequiredDialog
        open={showSubscribeDialog}
        profileHasError={profileHasError}
        onClose={() => setShowSubscribeDialog(false)}
      />

      <ContactSupportDialog
        open={showContactDialog}
        onClose={() => setShowContactDialog(false)}
      />
    </div>
  );
}
