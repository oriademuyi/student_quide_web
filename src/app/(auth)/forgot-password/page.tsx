"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      toast.show("Reset instructions sent to your email");
      router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Failed to send reset instructions";
      toast.show(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <h1 className="text-center text-2xl font-bold text-neutral-900">
        Forgot Password
      </h1>
      <p className="text-center text-sm text-neutral-600">
        Enter your email and we&apos;ll send you a reset code.
      </p>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" isLoading={isLoading}>
        Send Reset Code
      </Button>
      <p className="text-center text-sm text-neutral-600">
        <Link href="/login" className="font-semibold text-status-green">
          Back to Login
        </Link>
      </p>
    </form>
  );
}
