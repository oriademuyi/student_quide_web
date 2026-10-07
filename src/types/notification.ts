export type NotificationTargetRole = "all" | "student" | "admin";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  targetRole: string;
  isRead: boolean;
  createdAt: string | null;
}

export interface NotificationsMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface GetNotificationsResponse {
  status: string;
  message: string;
  data: {
    items: NotificationItem[];
    meta: NotificationsMeta;
  };
}

export interface CreateNotificationResponse {
  status: string;
  message: string;
  data: NotificationItem | null;
}
