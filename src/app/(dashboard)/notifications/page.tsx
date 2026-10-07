"use client";

import useSWR, { useSWRConfig } from "swr";
import { getNotifications, readNotification } from "@/lib/api/notifications";
import { ApiError } from "@/lib/api/client";
import type { NotificationItem } from "@/types/notification";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB");
}

export default function NotificationsPage() {
  const { mutate } = useSWRConfig();

  const { data, error, isLoading } = useSWR(
    "student-notifications",
    async () => (await getNotifications({ page: 1, limit: 20 })).data
  );

  async function onTap(notification: NotificationItem) {
    if (notification.isRead) return;
    try {
      await readNotification(notification.id);
      await mutate("student-notifications");
    } catch {
      // non-critical, ignore
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-neutral-900">Notifications</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : error ? (
        <p className="py-10 text-center text-sm text-status-red">
          {error instanceof ApiError ? error.message : "Failed to load notifications"}
        </p>
      ) : (data?.items.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="text-4xl">🔕</span>
          <p className="text-sm text-neutral-500">You have no notifications</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data!.items.map((n) => (
            <button
              key={n.id}
              onClick={() => onTap(n)}
              className={`rounded-2xl p-4 text-left shadow-sm transition-colors ${
                n.isRead ? "bg-white" : "bg-status-green/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <p className="font-bold text-neutral-900">{n.title}</p>
                {!n.isRead && (
                  <span className="h-2 w-2 rounded-full bg-status-red" />
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-600">{n.message}</p>
              {n.createdAt && (
                <p className="mt-2 text-xs text-neutral-400">{formatDate(n.createdAt)}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
