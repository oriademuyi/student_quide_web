"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Dialog } from "@/components/ui/Dialog";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  readNotification,
} from "@/lib/api/notifications";
import { ApiError } from "@/lib/api/client";
import type { NotificationItem, NotificationTargetRole } from "@/types/notification";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB");
}

export default function AdminNotificationsPage() {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState<NotificationTargetRole>("all");
  const [isSending, setIsSending] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<NotificationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, isLoading } = useSWR(
    "admin-notifications",
    async () => (await getNotifications({ page: 1, limit: 20 })).data
  );

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    setIsSending(true);
    try {
      await createNotification(title.trim(), message.trim(), targetRole);
      toast.show("Notification sent successfully");
      setTitle("");
      setMessage("");
      setTargetRole("all");
      await mutate("admin-notifications");
    } catch (e) {
      toast.show(
        e instanceof ApiError ? e.message : "Failed to send notification",
        "error"
      );
    } finally {
      setIsSending(false);
    }
  }

  async function onMarkRead(notification: NotificationItem) {
    if (notification.isRead) return;
    try {
      await readNotification(notification.id);
      await mutate("admin-notifications");
    } catch {
      // non-critical, ignore
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteNotification(pendingDelete.id);
      toast.show("Notification deleted");
      await mutate("admin-notifications");
      setPendingDelete(null);
    } catch (e) {
      toast.show(e instanceof ApiError ? e.message : "Failed to delete", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">Notifications</h1>

      <form onSubmit={onSend} className="flex max-w-lg flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase text-neutral-500">
          Create Notification
        </h2>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
        <Select
          label="Send To"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value as NotificationTargetRole)}
        >
          <option value="all">All Users</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </Select>
        <p className="text-xs text-neutral-500">
          Notifications can currently be sent to all users, students, or admins.
        </p>
        <Button type="submit" isLoading={isSending}>
          Send Notification
        </Button>
      </form>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase text-neutral-500">
          Sent Notifications
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-status-red">
            {error instanceof ApiError ? error.message : "Failed to load notifications"}
          </p>
        ) : (data?.items.length ?? 0) === 0 ? (
          <p className="py-6 text-center text-sm text-neutral-500">No notifications yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data!.items.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkRead(n)}
                className={`cursor-pointer rounded-2xl p-4 shadow-sm ${
                  n.isRead ? "bg-white" : "bg-status-green/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-neutral-900">{n.title}</p>
                    {!n.isRead && (
                      <span className="rounded bg-status-red px-1.5 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDelete(n);
                    }}
                    className="shrink-0 text-xs font-semibold text-status-red"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-1 text-sm text-neutral-600">{n.message}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                  <span>Target: {n.targetRole}</span>
                  {n.createdAt && <span>{formatDate(n.createdAt)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete Notification"
        actions={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button isLoading={isDeleting} onClick={confirmDelete} className="!bg-status-red">
              Delete
            </Button>
          </>
        }
      >
        Are you sure you want to delete this notification?
      </Dialog>
    </div>
  );
}
