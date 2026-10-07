import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import { ApiEndpoints } from "./endpoints";
import type {
  CreateNotificationResponse,
  GetNotificationsResponse,
  NotificationTargetRole,
} from "@/types/notification";

export function getNotifications(params: { page?: number; limit?: number }) {
  return apiGet<GetNotificationsResponse>(ApiEndpoints.getNotifications, {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export function createNotification(
  title: string,
  message: string,
  targetRole: NotificationTargetRole
) {
  return apiPost<CreateNotificationResponse>(ApiEndpoints.notifications, {
    title,
    message,
    targetRole,
  });
}

export function readNotification(id: string) {
  return apiPatch<{ status: string; message: string }>(
    ApiEndpoints.readNotification(id)
  );
}

export function deleteNotification(id: string) {
  return apiDelete<{ status: string; message: string }>(
    ApiEndpoints.deleteNotification(id)
  );
}
