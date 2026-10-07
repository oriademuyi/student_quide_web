"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import { ApiError, SESSION_EXPIRED_EVENT } from "@/lib/api/client";
import { login as loginRequest } from "@/lib/api/auth";
import { getCurrentUser } from "@/lib/api/profile";
import { clearAllTokens, getToken, setRefreshToken, setToken } from "@/lib/auth/token";
import { isSubscriptionActive } from "@/types/subscription";
import type { ProfileUser } from "@/types/profile";

interface LoginResult {
  ok: boolean;
  role?: string;
  errorCode?: string;
  errorMessage?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoadingProfile: boolean;
  profileHasError: boolean;
  profile: ProfileUser | null;
  isSubscribed: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const PROFILE_KEY = "profile";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Lazy initializer (not an effect) so reading localStorage happens once,
  // during the first client render, without tripping the "no setState in
  // effects" rule.
  const [hasToken, setHasToken] = useState(() => !!getToken());

  const { mutate: globalMutate } = useSWRConfig();

  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR<ProfileUser | null>(
    hasToken ? PROFILE_KEY : null,
    async () => (await getCurrentUser()).data,
    { revalidateOnFocus: false }
  );

  const login = useCallback(
    async (identifier: string, password: string): Promise<LoginResult> => {
      try {
        const res = await loginRequest(identifier, password);
        setToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setHasToken(true);
        // The hook's own `mutate` is still bound to the pre-login key
        // (null) in this closure, since `setHasToken` hasn't re-rendered
        // yet — target the cache entry directly so the hook picks it up
        // as soon as its key flips to non-null on the next render.
        await globalMutate(PROFILE_KEY);
        return { ok: true, role: res.data.user.role };
      } catch (e) {
        if (e instanceof ApiError) {
          return { ok: false, errorCode: e.code, errorMessage: e.message };
        }
        return { ok: false, errorMessage: "Login failed. Please try again." };
      }
    },
    [globalMutate]
  );

  const logout = useCallback(() => {
    clearAllTokens();
    setHasToken(false);
    globalMutate(PROFILE_KEY, null, false);
  }, [globalMutate]);

  const refreshProfile = useCallback(async () => {
    await mutate();
  }, [mutate]);

  // The API client fires this when a refresh-token attempt fails (the
  // refresh token itself is gone/expired) — subscribing here, rather than
  // having the client navigate directly, keeps client.ts framework-agnostic
  // and lets us use the Next.js router instead of a full page reload.
  useEffect(() => {
    function onSessionExpired() {
      setHasToken(false);
      globalMutate(PROFILE_KEY, null, false);
      router.push("/login");
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    };
  }, [globalMutate, router]);

  const isSubscribed = profile ? isSubscriptionActive(profile.subscription) : false;
  const isAdmin = !!profile && profile.role !== "student";

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: hasToken,
      isLoadingProfile: hasToken && isLoading,
      profileHasError: !!error,
      profile: profile ?? null,
      isSubscribed,
      isAdmin,
      login,
      logout,
      refreshProfile,
    }),
    [hasToken, isLoading, error, profile, isSubscribed, isAdmin, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
