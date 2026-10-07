import { apiGet, apiPost } from "./client";
import { ApiEndpoints } from "./endpoints";
import type { LoginResponse, SignupRequest } from "@/types/auth";
import type { Program } from "@/types/profile";

export function login(identifier: string, password: string) {
  return apiPost<LoginResponse>(ApiEndpoints.login, { identifier, password });
}

export function register(request: SignupRequest) {
  return apiPost<{ status: string; message: string }>(
    ApiEndpoints.register,
    request
  );
}

export function verifyAccountActivation(email: string, otp: string) {
  return apiPost<{ status: string; message: string }>(ApiEndpoints.verify, {
    email,
    code: otp,
  });
}

export function resendOtp(email: string) {
  return apiPost<{ status: string; message: string }>(
    ApiEndpoints.resendOtp,
    { email }
  );
}

export function forgotPassword(email: string) {
  return apiPost<{ status: string; message: string }>(
    ApiEndpoints.forgotPassword,
    { email }
  );
}

export function resetPassword(email: string, code: string, password: string) {
  return apiPost<{ status: string; message: string }>(
    ApiEndpoints.resetPassword,
    { email, code, password }
  );
}

export function getPrograms() {
  return apiGet<{ status: string; message: string; data: Program[] }>(
    ApiEndpoints.programs
  );
}
