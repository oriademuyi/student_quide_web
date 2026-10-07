"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getPlans, initializeSubscription } from "@/lib/api/subscription";
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

export default function PlanSelectionPage() {
  const toast = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);

  const {
    data: plans = [],
    error,
    isLoading,
    mutate: reload,
  } = useSWR("plans", async () => (await getPlans()).data.filter((p) => p.isActive));

  const errorMessage = error
    ? error instanceof ApiError
      ? error.message
      : "Failed to load plans"
    : null;

  async function onContinue() {
    if (!selectedId) return;
    setIsStartingCheckout(true);
    try {
      const res = await initializeSubscription(selectedId);
      window.location.href = res.data.authorizationUrl;
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Could not start payment. Please try again.";
      toast.show(message, "error");
      setIsStartingCheckout(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-neutral-900">Choose a Plan</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : errorMessage ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-status-red">{errorMessage}</p>
          <Button onClick={() => reload()}>Retry</Button>
        </div>
      ) : plans.length === 0 ? (
        <p className="py-12 text-center text-sm text-neutral-500">
          No plans available. Please check back later.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {plans.map((plan) => {
              const isSelected = plan.id === selectedId;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedId(plan.id)}
                  className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-colors ${
                    isSelected
                      ? "border-status-green bg-status-green/5"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? "border-status-green bg-status-green text-white"
                          : "border-neutral-300"
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>
                    <div>
                      <p className="font-bold text-neutral-900">{plan.name}</p>
                      <p className="text-xs text-neutral-500">
                        {formatDuration(plan.durationInDays)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-status-green">
                    {formatCurrency(plan.amount)}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            disabled={!selectedId}
            isLoading={isStartingCheckout}
            onClick={onContinue}
          >
            Continue to Payment
          </Button>
        </>
      )}
    </div>
  );
}
