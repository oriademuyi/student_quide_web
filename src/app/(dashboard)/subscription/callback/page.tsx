"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useAuth } from "@/lib/auth/AuthProvider";
import { verifySubscription } from "@/lib/api/subscription";
import { ApiError } from "@/lib/api/client";

function CallbackContent() {
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");

  const { data: record, error } = useSWR(
    reference ? ["verify-subscription", reference] : null,
    async ([, ref]) => (await verifySubscription(ref)).data,
    {
      onSuccess: (data) => {
        const s = data.status.toLowerCase();
        if (s === "success" || s === "active") {
          refreshProfile();
        }
      },
    }
  );

  const status: "checking" | "success" | "pending" | "failed" = !reference
    ? "failed"
    : error
    ? "failed"
    : !record
    ? "checking"
    : record.status.toLowerCase() === "success" || record.status.toLowerCase() === "active"
    ? "success"
    : record.status.toLowerCase() === "failed"
    ? "failed"
    : "pending";

  const errorMessage = !reference
    ? "No payment reference found."
    : error instanceof ApiError
    ? error.message
    : "Could not verify payment.";

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      {status === "checking" && (
        <>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
          <p className="text-sm text-neutral-600">Verifying your payment...</p>
        </>
      )}
      {status === "success" && (
        <>
          <span className="text-4xl">🎉</span>
          <h1 className="text-xl font-bold text-neutral-900">Subscription Active</h1>
          <p className="text-sm text-neutral-600">
            You now have full access to {record?.planName ?? "your plan"}.
          </p>
          <Link
            href="/dashboard"
            className="rounded-xl bg-status-green px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Dashboard
          </Link>
        </>
      )}
      {status === "pending" && (
        <>
          <span className="text-4xl">⏳</span>
          <h1 className="text-xl font-bold text-neutral-900">Payment Pending</h1>
          <p className="text-sm text-neutral-600">
            We&apos;re still confirming your payment. This can take a few minutes.
          </p>
          <Link
            href="/dashboard"
            className="rounded-xl bg-status-green px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Dashboard
          </Link>
        </>
      )}
      {status === "failed" && (
        <>
          <span className="text-4xl">❌</span>
          <h1 className="text-xl font-bold text-neutral-900">Payment Failed</h1>
          <p className="text-sm text-neutral-600">{errorMessage}</p>
          <Link
            href="/subscription/plans"
            className="rounded-xl bg-status-green px-5 py-3 text-sm font-semibold text-white"
          >
            Try Again
          </Link>
        </>
      )}
    </div>
  );
}

export default function SubscriptionCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackContent />
    </Suspense>
  );
}
