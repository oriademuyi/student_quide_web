"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { PlanForm, type PlanFormValues } from "@/components/admin/PlanForm";
import { useToast } from "@/components/ui/Toast";
import { createPlan } from "@/lib/api/subscription";
import { ApiError } from "@/lib/api/client";

export default function NewPlanPage() {
  const router = useRouter();
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: PlanFormValues) {
    setIsSubmitting(true);
    try {
      await createPlan(values);
      toast.show("Plan created successfully");
      await mutate("plans");
      router.push("/admin/subscriptions/plans");
    } catch (e) {
      toast.show(e instanceof ApiError ? e.message : "Failed to create plan", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-neutral-900">New Plan</h1>
      <PlanForm isSubmitting={isSubmitting} submitLabel="Create Plan" onSubmit={handleSubmit} />
    </div>
  );
}
