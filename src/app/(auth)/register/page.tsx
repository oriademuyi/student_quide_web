"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput, Select } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { getPrograms, register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const LEVELS = ["100", "200", "300", "400"];

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();

  const { data: programs = [] } = useSWR("programs", async () => (await getPrograms()).data);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [programId, setProgramId] = useState("");
  const [level, setLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        matricNumber: matricNumber.trim(),
        phone: phone.trim(),
        password,
        programId,
        level,
      });

      toast.show("Registration successful. Please verify your email.");
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Registration failed. Please try again.";
      toast.show(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h1 className="text-center text-2xl font-bold text-neutral-900">
        Create Account
      </h1>
      <Input
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Matric Number"
        value={matricNumber}
        onChange={(e) => setMatricNumber(e.target.value)}
        required
      />
      <Input
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Select
        label="Program"
        value={programId}
        onChange={(e) => setProgramId(e.target.value)}
        required
      >
        <option value="" disabled>
          Select your program
        </option>
        {programs.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>
      <Select
        label="Level"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        required
      >
        <option value="" disabled>
          Select your level
        </option>
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            {l} Level
          </option>
        ))}
      </Select>
      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />
      <Button type="submit" isLoading={isLoading} className="mt-2">
        Register
      </Button>
      <p className="text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-status-green">
          Log In
        </Link>
      </p>
    </form>
  );
}
