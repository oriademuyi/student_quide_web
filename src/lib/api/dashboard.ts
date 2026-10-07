import { apiGet } from "./client";
import { ApiEndpoints } from "./endpoints";
import type { DashboardResponse } from "@/types/dashboard";

export function getDashboard() {
  return apiGet<DashboardResponse>(ApiEndpoints.dashboard);
}
