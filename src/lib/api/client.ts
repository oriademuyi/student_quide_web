import {
  clearAllTokens,
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from "@/lib/auth/token";
import { ApiEndpoints } from "./endpoints";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.studentpadi.com/api/v1"
).replace(/\/$/, "");

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, opts?: { code?: string; status?: number }) {
    super(message);
    this.name = "ApiError";
    this.code = opts?.code;
    this.status = opts?.status;
  }
}

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(`${BASE_URL}/${path.replace(/^\//, "")}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function extractMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const raw = (body as Record<string, unknown>).message;

  if (typeof raw === "string" && raw.trim()) return raw;

  // NestJS validation errors return `message` as a list of per-field
  // problems rather than a single string — join them into one readable
  // sentence instead of silently falling back to a generic message.
  if (Array.isArray(raw)) {
    const strings = raw.filter((m): m is string => typeof m === "string");
    if (strings.length === 1) return strings[0];
    if (strings.length > 1) return strings.join(". ");
  }

  return undefined;
}

function friendlyStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return "There was a problem with your request. Please check the information you entered and try again.";
    case 401:
      return "Your session has ended. Please log in again.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 409:
      return "That already exists. Please use a different value.";
    case 422:
      return "Please check the information you entered and try again.";
    case 429:
      return "You're doing that too much. Please wait a moment and try again.";
    default:
      if (status >= 500) {
        return "Something went wrong on our end. Please try again in a moment.";
      }
      return "Something went wrong. Please try again.";
  }
}

async function parseErrorMessage(res: Response): Promise<ApiError> {
  let body: unknown;

  try {
    body = await res.json();
  } catch {
    return new ApiError(friendlyStatusMessage(res.status), {
      status: res.status,
    });
  }

  const code =
    typeof (body as Record<string, unknown>)?.code === "string"
      ? ((body as Record<string, unknown>).code as string)
      : undefined;

  const message = extractMessage(body) ?? friendlyStatusMessage(res.status);

  return new ApiError(message, { code, status: res.status });
}

// Endpoints that must never trigger a refresh-and-retry when they 401 —
// a bad login/refresh attempt is a credentials failure, not an expired
// session.
const AUTH_ENDPOINTS = [ApiEndpoints.login, ApiEndpoints.refreshToken];

function isAuthEndpoint(path: string): boolean {
  return AUTH_ENDPOINTS.some((p) => path.includes(p));
}

// Ensures concurrent 401s only trigger a single refresh call — every
// caller that hits a 401 while one is already in flight awaits the same
// promise instead of starting its own.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(buildUrl(ApiEndpoints.refreshToken), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const body = await res.json();
    const newAccessToken = body?.data?.accessToken as string | undefined;
    const newRefreshToken = body?.data?.refreshToken as string | undefined;

    if (!newAccessToken) return null;

    setToken(newAccessToken);
    if (newRefreshToken) setRefreshToken(newRefreshToken);

    return newAccessToken;
  } catch {
    return null;
  }
}

function getOrStartRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export const SESSION_EXPIRED_EVENT = "auth:session-expired";

function forceLogout() {
  clearAllTokens();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface RequestOptions {
  method: string;
  path: string;
  query?: QueryParams;
  jsonBody?: unknown;
  formBody?: FormData;
}

async function request<T>(opts: RequestOptions): Promise<T> {
  const doFetch = (token: string | null) => {
    const headers: HeadersInit = {
      ...authHeaders(token),
      ...(opts.jsonBody !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    };

    return fetch(buildUrl(opts.path, opts.query), {
      method: opts.method,
      headers,
      body: opts.formBody ?? (opts.jsonBody !== undefined ? JSON.stringify(opts.jsonBody) : undefined),
    });
  };

  let res: Response;

  try {
    res = await doFetch(getToken());
  } catch {
    throw new ApiError("No internet connection. Please check your network.");
  }

  if (res.status === 401 && !isAuthEndpoint(opts.path)) {
    const newToken = await getOrStartRefresh();

    if (!newToken) {
      forceLogout();
      throw await parseErrorMessage(res);
    }

    try {
      res = await doFetch(newToken);
    } catch {
      throw new ApiError("No internet connection. Please check your network.");
    }

    if (res.status === 401) {
      forceLogout();
      throw await parseErrorMessage(res);
    }
  }

  if (!res.ok) {
    throw await parseErrorMessage(res);
  }

  return (await res.json()) as T;
}

export function apiGet<T>(path: string, query?: QueryParams): Promise<T> {
  return request<T>({ method: "GET", path, query });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>({ method: "POST", path, jsonBody: body });
}

export function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  return request<T>({ method: "POST", path, formBody: formData });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>({ method: "PATCH", path, jsonBody: body });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>({ method: "DELETE", path });
}
