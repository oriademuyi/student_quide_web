"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { getInteractions } from "@/lib/api/ai";
import type { AiInteractionType } from "@/types/ai";
import { ApiError } from "@/lib/api/client";

const TYPE_FILTERS: { label: string; value: AiInteractionType | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Explain", value: "explain" },
  { label: "Solve", value: "solve" },
  { label: "Summarize", value: "summarize" },
];

const TYPE_ICON: Record<string, string> = {
  explain: "💡",
  solve: "✅",
  summarize: "📑",
};

const STATUS_COLOR: Record<string, string> = {
  succeeded: "text-accent-green bg-accent-green/10",
  failed: "text-status-red bg-status-red/10",
  pending: "text-status-yellow bg-status-yellow/10",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB");
}

export default function AiInteractionsPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<AiInteractionType | undefined>(undefined);

  const { data, error, isLoading } = useSWR(
    ["interactions", page, type],
    async ([, p, t]) => (await getInteractions({ page: p, limit: 20, type: t })).data,
    { keepPreviousData: true }
  );

  const items = data?.items ?? [];
  const meta = data?.meta ?? null;
  const errorMessage = error
    ? error instanceof ApiError
      ? error.message
      : "Failed to load interactions"
    : null;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-neutral-900">Past Interactions</h1>

      <div className="flex gap-2 overflow-x-auto">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => {
              setType(f.value);
              setPage(1);
            }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              type === f.value
                ? "border-status-green bg-status-green text-white"
                : "border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : errorMessage ? (
        <p className="py-10 text-center text-sm text-status-red">{errorMessage}</p>
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-500">
          No past interactions yet
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/examai/interactions/view?id=${encodeURIComponent(item.id)}`}
              className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-green/10 text-lg">
                {TYPE_ICON[item.type] ?? "✨"}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold capitalize text-neutral-900">
                    {item.type}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      STATUS_COLOR[item.status] ?? "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                  {item.inputText || item.fileName || "No preview available"}
                </p>
                {item.createdAt && (
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatDate(item.createdAt)}
                  </p>
                )}
              </div>
              <span className="text-neutral-300">›</span>
            </Link>
          ))}
        </div>
      )}

      {meta && items.length > 0 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <button
            disabled={meta.page <= 1}
            onClick={() => setPage(meta.page - 1)}
            className="text-sm font-semibold text-status-green disabled:text-neutral-300"
          >
            ‹ Previous
          </button>
          <span className="text-xs text-neutral-500">
            Page {meta.page} of {meta.totalPages || 1} • {meta.totalItems} total
          </span>
          <button
            disabled={meta.page >= meta.totalPages}
            onClick={() => setPage(meta.page + 1)}
            className="text-sm font-semibold text-status-green disabled:text-neutral-300"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
