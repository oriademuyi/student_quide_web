"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoadingProfile, isAdmin } = useAuth();

  useEffect(() => {
    if (isLoadingProfile) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      router.replace(isAdmin ? "/admin" : "/dashboard");
    }
  }, [isAuthenticated, isLoadingProfile, isAdmin, router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
    </div>
  );
}
