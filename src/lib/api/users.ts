import { apiGet } from "./client";
import { ApiEndpoints } from "./endpoints";
import type { UsersResponse } from "@/types/user";

export function getUsers(params: { page?: number; limit?: number }) {
  return apiGet<UsersResponse>(ApiEndpoints.users, {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}
