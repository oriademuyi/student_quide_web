"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-3 last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-medium text-neutral-900">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isSubscribed, logout } = useAuth();

  if (!profile) return null;

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  function onLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-status-green to-accent-green p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
            {initials || "?"}
          </div>
          <div>
            <p className="text-lg font-bold">{profile.name}</p>
            <p className="text-sm text-white/80">{profile.email}</p>
          </div>
        </div>
        <div className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase">
          {profile.role || "Student"}
        </div>

        {!isSubscribed && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/15 p-3 text-sm">
            <span>Subscribe to unlock full features</span>
            <Link
              href="/subscription/plans"
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-status-green"
            >
              Subscribe
            </Link>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-xs font-bold uppercase text-neutral-500">
          Account Details
        </h2>
        <DetailRow label="Matric Number" value={profile.matricNumber ?? "N/A"} />
        <DetailRow label="Phone" value={profile.phone ?? "N/A"} />
        <DetailRow label="Level" value={profile.level || "N/A"} />
        <DetailRow label="Program" value={profile.program?.name ?? "N/A"} />
        <DetailRow
          label="Department"
          value={profile.program?.department?.name ?? "N/A"}
        />
        <DetailRow
          label="Faculty"
          value={profile.program?.department?.faculty?.name ?? "N/A"}
        />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-xs font-bold uppercase text-neutral-500">
          Legal
        </h2>
        <Link
          href="/privacy-policy"
          className="block py-2 text-sm font-medium text-neutral-700 hover:text-status-green"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms-of-service"
          className="block py-2 text-sm font-medium text-neutral-700 hover:text-status-green"
        >
          Terms of Service
        </Link>
      </div>

      <Button variant="outline" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}
