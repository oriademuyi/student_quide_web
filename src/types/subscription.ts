import type { SubscriptionRecord } from "./profile";

export interface SubscriptionPlan {
  id: string;
  name: string;
  amount: number;
  durationInDays: number;
  isActive: boolean;
}

export interface SubscriptionPlanListResponse {
  status: string;
  message: string;
  data: SubscriptionPlan[];
}

export interface SubscriptionInitData {
  reference: string;
  authorizationUrl: string;
}

export interface InitializeSubscriptionResponse {
  status: string;
  message: string;
  data: SubscriptionInitData;
}

export interface VerifySubscriptionResponse {
  status: string;
  message: string;
  data: SubscriptionRecord;
}

export interface MySubscriptionResponse {
  status: string;
  message: string;
  data: SubscriptionRecord | null;
}

export interface SubscriptionStudent {
  id: string;
  name: string;
  email: string;
  matricNumber: string | null;
}

export interface AdminSubscriptionRecord {
  id: string;
  planName: string;
  amount: number;
  provider: string;
  reference: string;
  status: string;
  startDate: string | null;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string | null;
  student: SubscriptionStudent;
}

export interface AdminSubscriptionListResponse {
  status: string;
  message: string;
  data: {
    items: AdminSubscriptionRecord[];
    meta: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  amount: number;
  durationInDays: number;
  isActive: boolean;
}

export interface UpdateSubscriptionPlanRequest {
  name?: string;
  amount?: number;
  durationInDays?: number;
  isActive?: boolean;
}

export function isSubscriptionActive(
  record: SubscriptionRecord | null | undefined
): boolean {
  if (!record) return false;
  const statusOk =
    record.status.toLowerCase() === "success" ||
    record.status.toLowerCase() === "active";
  if (!statusOk) return false;
  if (record.expiryDate && new Date(record.expiryDate) < new Date()) {
    return false;
  }
  return record.isActive;
}
