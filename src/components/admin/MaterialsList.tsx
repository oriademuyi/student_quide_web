"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { deleteMaterial, getMaterials } from "@/lib/api/materials";
import { ApiError } from "@/lib/api/client";
import type { MaterialItem, MaterialType } from "@/types/material";

function fileIcon(mimeType: string): string {
  if (mimeType.includes("pdf")) return "📕";
  if (mimeType.includes("image")) return "🖼️";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📄";
  return "📁";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB");
}

export function MaterialsList({
  type,
  title,
  uploadHref,
}: {
  type: MaterialType;
  title: string;
  uploadHref: string;
}) {
  const toast = useToast();
  const { mutate } = useSWRConfig();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<MaterialItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // The backend doesn't support filtering by type or searching server-side,
  // so (matching the mobile admin app's own behaviour) we fetch the latest
  // page and filter/search client-side.
  const { data, error, isLoading } = useSWR(
    "materials",
    async () => (await getMaterials({ page: 1, limit: 100 })).data
  );

  const items = (data?.items ?? []).filter((item) => {
    if (item.type !== type) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.courseCode.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q)
    );
  });

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteMaterial(pendingDelete.id);
      toast.show("Deleted successfully");
      await mutate("materials");
      setPendingDelete(null);
    } catch (e) {
      toast.show(e instanceof ApiError ? e.message : "Failed to delete", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
        <Link
          href={uploadHref}
          className="rounded-lg bg-status-green px-4 py-2 text-sm font-semibold text-white"
        >
          + Upload
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by course code or title..."
        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-status-green focus:ring-2 focus:ring-status-green/20"
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : error ? (
        <p className="py-10 text-center text-sm text-status-red">
          {error instanceof ApiError ? error.message : "Failed to load"}
        </p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-500">No items found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{fileIcon(item.mimeType)}</span>
                <div>
                  <p className="font-bold text-neutral-900">{item.courseCode}</p>
                  <p className="text-sm text-neutral-700">{item.title}</p>
                  {item.courseTitle && (
                    <p className="text-sm text-neutral-500">{item.courseTitle}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500">
                    Level: {item.level} • Semester: {item.semester}
                  </p>
                  <p className="text-xs text-neutral-400">File: {item.fileName}</p>
                  {item.createdAt && (
                    <p className="text-xs text-neutral-400">
                      Uploaded: {formatDate(item.createdAt)}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPendingDelete(item)}
                className="shrink-0 text-xs font-semibold text-status-red"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete Item"
        actions={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              isLoading={isDeleting}
              onClick={confirmDelete}
              className="!bg-status-red"
            >
              Delete
            </Button>
          </>
        }
      >
        Are you sure you want to delete &quot;{pendingDelete?.title}&quot;? This cannot be
        undone.
      </Dialog>
    </div>
  );
}
