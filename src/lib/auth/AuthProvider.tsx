"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import useSWR, { useSWRConfig } from "swr";
import { ApiError } from "@/lib/api/client";
import { login as loginRequest } from "@/lib/api/auth";
import { getCurrentUser } from "@/lib/api/profile";
import { clearToken, getToken, setToken } from "@/lib/auth/token";
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
    clearToken();
    setHasToken(false);
    globalMutate(PROFILE_KEY, null, false);
  }, [globalMutate]);

  const refreshProfile = useCallback(async () => {
    await mutate();
  }, [mutate]);

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
