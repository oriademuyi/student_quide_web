import { apiGet, apiPatch, apiPost } from "./client";
import { ApiEndpoints } from "./endpoints";
import type {
  AdminSubscriptionListResponse,
  CreateSubscriptionPlanRequest,
  InitializeSubscriptionResponse,
  MySubscriptionResponse,
  SubscriptionPlanListResponse,
  UpdateSubscriptionPlanRequest,
  VerifySubscriptionResponse,
} from "@/types/subscription";

export function getPlans() {
  return apiGet<SubscriptionPlanListResponse>(ApiEndpoints.subscriptionPlans);
}

export function createPlan(request: CreateSubscriptionPlanRequest) {
  return apiPost<{ status: string; message: string }>(
    ApiEndpoints.subscriptionPlans,
    request
  );
}

export function updatePlan(id: string, request: UpdateSubscriptionPlanRequest) {
  return apiPatch<{ status: string; message: string }>(
    ApiEndpoints.subscriptionPlanById(id),
    request
  );
}

export function getAllSubscriptions(params: {
  status?: string;
  userId?: string;
  page?: number;
  limit?: number;
}) {
  return apiGet<AdminSubscriptionListResponse>(ApiEndpoints.subscriptions, {
    status: params.status,
    userId: params.userId,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export function initializeSubscription(planId: string) {
  return apiPost<InitializeSubscriptionResponse>(
    ApiEndpoints.initializeSubscription,
    { planId }
  );
}

export function verifySubscription(reference: string) {
  return apiPost<VerifySubscriptionResponse>(ApiEndpoints.verifySubscription, {
    reference,
  });
}

export function getMySubscription() {
  return apiGet<MySubscriptionResponse>(ApiEndpoints.mySubscription);
}
