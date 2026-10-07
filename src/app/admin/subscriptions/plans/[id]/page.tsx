"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import { PlanForm, type PlanFormValues } from "@/components/admin/PlanForm";
import { useToast } from "@/components/ui/Toast";
import { getPlans, updatePlan } from "@/lib/api/subscription";
import { ApiError } from "@/lib/api/client";

export default function EditPlanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: plans, isLoading } = useSWR("plans", async () => (await getPlans()).data);
  const plan = plans?.find((p) => p.id === params.id);

  async function handleSubmit(values: PlanFormValues) {
    setIsSubmitting(true);
    try {
      await updatePlan(params.id, values);
      toast.show("Plan updated successfully");
      await mutate("plans");
      router.push("/admin/subscriptions/plans");
    } catch (e) {
      toast.show(e instanceof ApiError ? e.message : "Failed to update plan", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
      </div>
    );
  }

  if (!plan) {
    return <p className="py-10 text-center text-sm text-status-red">Plan not found</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-neutral-900">Edit Plan</h1>
      <PlanForm
        initial={plan}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
