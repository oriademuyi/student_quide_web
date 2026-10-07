import type { Program } from "./profile";

export interface LoginUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  program: Program | null;
  level: string;
  isVerified: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: LoginUser;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: LoginData;
}

export interface SignupRequest {
  name: string;
  email: string;
  matricNumber: string;
  phone: string;
  password: string;
  programId: string;
  level: string;
}

export interface ApiErrorBody {
  status: string;
  message: string;
  code?: string;
  data?: unknown;
}
