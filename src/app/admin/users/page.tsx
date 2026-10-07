"use client";

import { useState } from "react";
import useSWR from "swr";
import { getUsers } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const { data, error, isLoading } = useSWR(
    "admin-users",
    async () => (await getUsers({ page: 1, limit: 20 })).data
  );

  const items = data?.items ?? [];
  const meta = data?.meta;

  const filtered = items.filter((user) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      (user.matricNumber ?? "").toLowerCase().includes(q)
    );
  });

  const verifiedOnPage = items.filter((u) => u.isVerified).length;
  const pendingOnPage = items.filter((u) => !u.isVerified).length;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-neutral-900">Manage Users</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-500">Total</p>
          <p className="text-xl font-bold text-neutral-900">{meta?.totalItems ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-500">Verified (this page)</p>
          <p className="text-xl font-bold text-accent-green">{verifiedOnPage}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-500">Pending (this page)</p>
          <p className="text-xl font-bold text-status-yellow">{pendingOnPage}</p>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, email or matric number..."
        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-status-green focus:ring-2 focus:ring-status-green/20"
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
        </div>
      ) : error ? (
        <p className="py-10 text-center text-sm text-status-red">
          {error instanceof ApiError ? error.message : "Failed to load users"}
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-500">No users found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((user) => (
            <div key={user.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-green/10 font-bold text-status-green">
                {user.name[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1">
                <p className="font-bold text-neutral-900">{user.name}</p>
                <p className="text-sm text-neutral-500">{user.email}</p>
                <p className="text-xs text-neutral-500">
                  Matric: {user.matricNumber ?? "-"} • Level: {user.level} • Program:{" "}
                  {user.program?.name ?? "-"}
                </p>
              </div>
              <span
                className={`shrink-0 rounded px-2 py-1 text-xs font-semibold ${
                  user.isVerified
                    ? "bg-accent-green/10 text-accent-green"
                    : "bg-status-yellow/10 text-status-yellow"
                }`}
              >
                {user.isVerified ? "Verified" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
