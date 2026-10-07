"use client";

import Link from "next/link";
import useSWR from "swr";
import { getPlans } from "@/lib/api/subscription";
import { ApiError } from "@/lib/api/client";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDuration(days: number): string {
  if (days % 365 === 0) return `${days / 365} year${days / 365 > 1 ? "s" : ""}`;
  if (days % 30 === 0) return `${days / 30} month${days / 30 > 1 ? "s" : ""}`;
  return `${days} days`;
}

export default function AdminPlansPage() {
  const { data: plans = [], error, isLoading } = useSWR(
    "plans",
    async () => (await getPlans()).data
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Subscription Plans</h1>
        <Link
          href="/admin/subscriptions/plans/new"
          className="rounded-lg bg-status-green px-4 py-2 text-sm font-semibold text-white"
        >
          + New Plan
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : error ? (
        <p className="py-10 text-center text-sm text-status-red">
          {error instanceof ApiError ? error.message : "Failed to load plans"}
        </p>
      ) : plans.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-500">No plans yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/admin/subscriptions/plans/${plan.id}`}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-neutral-900">{plan.name}</p>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      plan.isActive
                        ? "bg-accent-green/10 text-accent-green"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-neutral-500">
                  {formatDuration(plan.durationInDays)}
                </p>
              </div>
              <span className="font-bold text-status-green">
                {formatCurrency(plan.amount)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
