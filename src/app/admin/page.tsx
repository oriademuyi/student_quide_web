"use client";

import Link from "next/link";
import useSWR from "swr";
import {
  Archive,
  Bell,
  LayoutDashboard,
  Library,
  ShieldCheck,
  Users,
  UserPlus,
  Upload,
  CreditCard,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { getDashboard } from "@/lib/api/dashboard";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ApiError } from "@/lib/api/client";

function StatCard({
  label,
  value,
  href,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number | string;
  href?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </span>
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

const QUICK_ACTIONS = [
  {
    href: "/admin/users",
    label: "Manage Users",
    subtitle: "View registered students",
    icon: UserPlus,
  },
  {
    href: "/admin/materials/upload",
    label: "Upload Materials / Past Questions",
    subtitle: "Upload lecture notes and PDFs",
    icon: Upload,
  },
  {
    href: "/admin/subscriptions",
    label: "Subscriptions",
    subtitle: "View payments & plans",
    icon: CreditCard,
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    subtitle: "Broadcast to students",
    icon: Megaphone,
  },
];

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const { data, error, isLoading } = useSWR("dashboard", async () => (await getDashboard()).data);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-status-green to-accent-green p-8 text-white">
        <LayoutDashboard
          size={150}
          strokeWidth={1}
          className="pointer-events-none absolute -right-6 -top-6 opacity-15"
        />
        <div className="relative">
          <p className="text-sm font-medium text-white/80">Admin</p>
          <h1 className="mt-1 text-3xl font-bold">
            {profile?.name?.split(" ")[0] ?? "Welcome back"}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
            Manage students, subscriptions, materials and notifications from
            one place.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : error ? (
        <p className="text-sm text-status-red">
          {error instanceof ApiError ? error.message : "Failed to load dashboard stats"}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="Students"
            value={data?.totalStudents ?? 0}
            href="/admin/users"
            icon={Users}
            iconBg="bg-card-green"
            iconColor="text-accent-green"
          />
          <StatCard
            label="Admins"
            value={data?.totalAdmins ?? 0}
            icon={ShieldCheck}
            iconBg="bg-card-purple"
            iconColor="text-purple"
          />
          <StatCard
            label="Materials"
            value={data?.totalMaterials ?? 0}
            href="/admin/materials"
            icon={Library}
            iconBg="bg-card-purple"
            iconColor="text-purple"
          />
          <StatCard
            label="Past Questions"
            value={data?.totalPastQuestions ?? 0}
            href="/admin/past-questions"
            icon={Archive}
            iconBg="bg-card-red"
            iconColor="text-status-red"
          />
          <StatCard
            label="Notifications"
            value={data?.totalNotifications ?? 0}
            href="/admin/notifications"
            icon={Bell}
            iconBg="bg-card-yellow"
            iconColor="text-status-yellow"
          />
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase text-neutral-500">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-status-green/10">
                  <Icon size={20} className="text-status-green" />
                </span>
                <div>
                  <p className="font-bold text-neutral-900">{action.label}</p>
                  <p className="text-sm text-neutral-500">{action.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
