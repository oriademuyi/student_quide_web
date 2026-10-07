"use client";

import { useState } from "react";
import useSWR from "swr";
import { downloadMaterial, getMaterials } from "@/lib/api/materials";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api/client";
import type { MaterialItem, MaterialType } from "@/types/material";

export function StudentMaterialsBrowser({
  type,
  icon,
  accentColor,
  title,
  subtitle,
  emptyLabel,
}: {
  type: MaterialType;
  icon: string;
  accentColor: "orange" | "green";
  title: string;
  subtitle: string;
  emptyLabel: string;
}) {
  const toast = useToast();
  const [courseCode, setCourseCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(
    "materials",
    async () => (await getMaterials({ page: 1, limit: 20 })).data
  );

  const items = (data?.items ?? []).filter((item) => item.type === type);

  const searchText = courseCode.trim().toLowerCase();
  const filtered =
    !searched || !searchText
      ? items
      : items.filter((item) => item.courseCode.toLowerCase().includes(searchText));

  async function onOpen(item: MaterialItem) {
    setOpeningId(item.id);
    try {
      const res = await downloadMaterial(item.id);
      if (!res.data.url) {
        toast.show("Unable to get document URL", "error");
        return;
      }
      window.open(res.data.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.show(e instanceof ApiError ? e.message : "Unable to open document", "error");
    } finally {
      setOpeningId(null);
    }
  }

  const accent =
    accentColor === "orange"
      ? { text: "text-orange-600", bg: "bg-orange-50" }
      : { text: "text-status-green", bg: "bg-status-green/10" };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-5xl">{icon}</span>
        <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
        <p className="max-w-sm text-sm text-neutral-600">{subtitle}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!courseCode.trim()) {
            toast.show("Please enter a course code", "error");
            return;
          }
          setSearched(true);
        }}
        className="flex gap-2"
      >
        <input
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
          placeholder="e.g. GST101"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-status-green focus:ring-2 focus:ring-status-green/20"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-status-green px-5 py-3 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : error ? (
        <p className="py-10 text-center text-sm text-status-red">
          {error instanceof ApiError ? error.message : "Failed to load"}
        </p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center">
          <p className="font-semibold text-neutral-700">
            {searched ? `No ${emptyLabel} found for ${courseCode}` : `No ${emptyLabel} available`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => {
            const isPdf = item.mimeType.toLowerCase().includes("pdf");
            return (
              <div key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${accent.bg}`}
                  >
                    {isPdf ? "📕" : "📄"}
                  </span>
                  <div>
                    <p className="font-bold text-neutral-900">{item.courseCode}</p>
                    <p className="text-sm text-neutral-700">{item.title}</p>
                    {item.courseTitle && (
                      <p className="text-sm text-neutral-500">{item.courseTitle}</p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      {item.level} Level • {item.semester}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={openingId === item.id}
                    onClick={() => onOpen(item)}
                    className={`flex-1 rounded-xl border border-neutral-300 py-2 text-sm font-semibold ${accent.text} disabled:opacity-50`}
                  >
                    {openingId === item.id ? "Opening..." : "Read"}
                  </button>
                  <button
                    disabled={openingId === item.id}
                    onClick={() => onOpen(item)}
                    className="flex-1 rounded-xl bg-status-green py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
