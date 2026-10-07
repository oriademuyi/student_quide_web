"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(identifier.trim(), password);

    setIsLoading(false);

    if (result.ok) {
      toast.show("Login successful");
      router.push(result.role === "student" ? "/dashboard" : "/admin");
      return;
    }

    const isEmailNotVerified =
      result.errorCode === "EMAIL_NOT_VERIFIED" ||
      (result.errorMessage ?? "").toLowerCase().includes("not verified");

    if (isEmailNotVerified) {
      toast.show(result.errorMessage ?? "Account not verified", "error");
      if (identifier.includes("@")) {
        router.push(`/verify-email?email=${encodeURIComponent(identifier.trim())}`);
      }
      return;
    }

    toast.show(result.errorMessage ?? "Login failed. Please try again.", "error");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <h1 className="text-center text-2xl font-bold text-neutral-900">
        Welcome Back
      </h1>
      <Input
        label="Matric Number or Email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-status-green"
        >
          Forgotten password?
        </Link>
      </div>
      <Button type="submit" isLoading={isLoading}>
        Log In
      </Button>
      <p className="text-center text-sm text-neutral-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-status-green">
          Register
        </Link>
      </p>
    </form>
  );
}
