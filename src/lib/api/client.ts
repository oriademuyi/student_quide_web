import { getToken } from "@/lib/auth/token";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://noun-api-n2om.onrender.com/api/v1"
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

async function parseErrorMessage(res: Response): Promise<ApiError> {
  try {
    const body = await res.json();
    const message =
      typeof body?.message === "string"
        ? body.message
        : `Request failed (${res.status}). Please try again.`;
    const code = typeof body?.code === "string" ? body.code : undefined;
    return new ApiError(message, { code, status: res.status });
  } catch {
    return new ApiError(
      `Request failed (${res.status}). Please try again.`,
      { status: res.status }
    );
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw await parseErrorMessage(res);
  }
  return (await res.json()) as T;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(
  path: string,
  query?: QueryParams
): Promise<T> {
  try {
    const res = await fetch(buildUrl(path, query), {
      method: "GET",
      headers: { ...authHeaders() },
    });
    return await handleResponse<T>(res);
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("No internet connection. Please check your network.");
  }
}

export async function apiPost<T>(
  path: string,
  body?: unknown
): Promise<T> {
  try {
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return await handleResponse<T>(res);
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("No internet connection. Please check your network.");
  }
}

export async function apiPostForm<T>(
  path: string,
  formData: FormData
): Promise<T> {
  try {
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: { ...authHeaders() },
      body: formData,
    });
    return await handleResponse<T>(res);
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("No internet connection. Please check your network.");
  }
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  try {
    const res = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return await handleResponse<T>(res);
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("No internet connection. Please check your network.");
  }
}

export async function apiDelete<T>(path: string): Promise<T> {
  try {
    const res = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    return await handleResponse<T>(res);
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("No internet connection. Please check your network.");
  }
}
