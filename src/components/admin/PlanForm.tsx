"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { SubscriptionPlan } from "@/types/subscription";

export interface PlanFormValues {
  name: string;
  amount: number;
  durationInDays: number;
  isActive: boolean;
}

export function PlanForm({
  initial,
  isSubmitting,
  submitLabel,
  onSubmit,
}: {
  initial?: SubscriptionPlan;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: PlanFormValues) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [durationInDays, setDurationInDays] = useState(
    initial ? String(initial.durationInDays) : ""
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      amount: Number(amount),
      durationInDays: Number(durationInDays),
      isActive,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      <Input
        label="Plan Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Amount (NGN)"
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        label="Duration (days)"
        type="number"
        inputMode="numeric"
        min="1"
        value={durationInDays}
        onChange={(e) => setDurationInDays(e.target.value)}
        required
      />
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-5 w-5 accent-status-green"
        />
        <span className="text-sm font-medium text-neutral-700">Active</span>
      </label>
      <Button type="submit" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
