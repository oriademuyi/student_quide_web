"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { AdminPaginationBar } from "@/components/admin/AdminPaginationBar";
import { getAllSubscriptions } from "@/lib/api/subscription";
import { ApiError } from "@/lib/api/client";

const STATUS_FILTERS: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Failed", value: "failed" },
];

const STATUS_COLOR: Record<string, string> = {
  active: "text-accent-green bg-accent-green/10",
  success: "text-accent-green bg-accent-green/10",
  pending: "text-status-yellow bg-status-yellow/10",
  failed: "text-status-red bg-status-red/10",
  expired: "text-neutral-500 bg-neutral-100",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB");
}

export default function AdminSubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { data, error, isLoading } = useSWR(
    ["admin-subscriptions", page, status],
    async ([, p, s]) => (await getAllSubscriptions({ status: s, page: p, limit: 20 })).data,
    { keepPreviousData: true }
  );

  const items = data?.items ?? [];
  const meta = data?.meta ?? null;
  const errorMessage = error
    ? error instanceof ApiError
      ? error.message
      : "Failed to load subscriptions"
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">All Subscriptions</h1>
        <Link
          href="/admin/subscriptions/plans"
          className="rounded-lg bg-status-green px-4 py-2 text-sm font-semibold text-white"
        >
          Manage Plans
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              status === f.value
                ? "border-status-green bg-status-green text-white"
                : "border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : errorMessage ? (
        <p className="py-10 text-center text-sm text-status-red">{errorMessage}</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-500">
          No subscriptions found
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((record) => (
            <div key={record.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-neutral-900">{record.student.name}</p>
                  <p className="text-sm text-neutral-500">{record.student.email}</p>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-1 text-xs font-semibold ${
                    STATUS_COLOR[record.status.toLowerCase()] ??
                    "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {record.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
                <span className="font-semibold text-neutral-900">{record.planName}</span>
                <span>{formatCurrency(record.amount)}</span>
                {record.createdAt && <span>{formatDate(record.createdAt)}</span>}
                <span className="text-xs text-neutral-400">Ref: {record.reference}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && items.length > 0 && (
        <AdminPaginationBar
          meta={meta}
          isLoading={isLoading}
          onPrevious={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </div>
  );
}
