"use client";

import { useState } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
}

function FieldWrapper({
  label,
  error,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-xs text-status-red">{error}</span>}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-status-green focus:ring-2 focus:ring-status-green/20";

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.28 2.86A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 4.22-5.94" />
      <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Input({
  label,
  error,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & FieldWrapperProps) {
  return (
    <FieldWrapper label={label} error={error}>
      <input className={`${inputClasses} ${className}`} {...rest} />
    </FieldWrapper>
  );
}

export function PasswordInput({
  label,
  error,
  className = "",
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & FieldWrapperProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FieldWrapper label={label} error={error}>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className={`${inputClasses} pr-12 ${className}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-status-green"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  error,
  className = "",
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapperProps) {
  return (
    <FieldWrapper label={label} error={error}>
      <textarea className={`${inputClasses} ${className}`} {...rest} />
    </FieldWrapper>
  );
}

export function Select({
  label,
  error,
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & FieldWrapperProps) {
  return (
    <FieldWrapper label={label} error={error}>
      <div className="relative">
        <select
          className={`${inputClasses} appearance-none pr-10 ${className}`}
          {...rest}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
          <ChevronDownIcon />
        </span>
      </div>
    </FieldWrapper>
  );
}
