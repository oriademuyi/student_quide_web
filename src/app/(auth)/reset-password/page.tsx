"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

function ResetPasswordForm() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email, code.trim(), password);
      toast.show("Password reset successful. Please log in.");
      router.push("/login");
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Failed to reset password";
      toast.show(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <h1 className="text-center text-2xl font-bold text-neutral-900">
        Reset Password
      </h1>
      <p className="text-center text-sm text-neutral-600">
        Enter the code sent to <span className="font-semibold">{email}</span>{" "}
        and choose a new password.
      </p>
      <Input
        label="Reset Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <PasswordInput
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />
      <Button type="submit" isLoading={isLoading}>
        Reset Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
