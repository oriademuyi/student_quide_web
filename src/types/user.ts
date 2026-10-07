import type { Program } from "./profile";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  matricNumber: string | null;
  role: string;
  phone: string | null;
  program: Program | null;
  level: string;
  isVerified: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UsersMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface UsersResponse {
  status: string;
  message: string;
  data: {
    items: UserItem[];
    meta: UsersMeta;
  };
}
