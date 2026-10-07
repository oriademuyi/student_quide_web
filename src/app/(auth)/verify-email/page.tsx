"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { resendOtp, verifyAccountActivation } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const RESEND_COOLDOWN_SECONDS = 5 * 60;

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function VerifyEmailForm() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startInterval() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function startTimer() {
    setSeconds(RESEND_COOLDOWN_SECONDS);
    startInterval();
  }

  useEffect(() => {
    // `seconds` already starts at RESEND_COOLDOWN_SECONDS via useState, so
    // only the interval itself needs to start here — no setState call in
    // the effect body.
    startInterval();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length < 6) {
      toast.show("Please enter the complete 6-digit code", "error");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyAccountActivation(email, otp);
      toast.show("Verification successful");
      router.push("/login");
    } catch (e) {
      const message = e instanceof ApiError ? e.message : "OTP verification failed";
      toast.show(message, "error");
    } finally {
      setIsVerifying(false);
    }
  }

  async function onResend() {
    if (seconds !== 0 || isResending) return;
    setIsResending(true);
    try {
      await resendOtp(email);
      toast.show("A new verification code has been sent to your email");
      startTimer();
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Failed to resend code. Please try again.";
      toast.show(message, "error");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form onSubmit={onVerify} className="flex flex-col items-center gap-5 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">Verify Your Email</h1>
      <p className="text-sm text-neutral-600">
        We&apos;ve sent a 6-digit verification code to
        <br />
        <span className="font-semibold text-neutral-900">{email}</span>
      </p>
      <Input
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        maxLength={6}
        className="text-center text-xl tracking-[0.5em]"
        placeholder="------"
      />
      <Button type="submit" isLoading={isVerifying} className="w-full">
        Verify Email
      </Button>
      <p className="text-sm text-neutral-600">Didn&apos;t receive the code?</p>
      <button
        type="button"
        onClick={onResend}
        disabled={seconds !== 0 || isResending}
        className="text-sm font-semibold text-status-green disabled:text-neutral-400"
      >
        {isResending
          ? "Sending..."
          : seconds === 0
          ? "Resend Code"
          : `Resend in ${formatCountdown(seconds)}`}
      </button>
    </form>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
