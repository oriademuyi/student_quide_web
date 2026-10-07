import { apiGet } from "./client";
import { ApiEndpoints } from "./endpoints";
import type { ProfileResponse } from "@/types/profile";

export function getCurrentUser() {
  return apiGet<ProfileResponse>(ApiEndpoints.currentUser);
}
