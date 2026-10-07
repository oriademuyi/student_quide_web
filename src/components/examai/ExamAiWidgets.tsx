"use client";

import type { ReactNode } from "react";

export function HeaderCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-status-green p-6 text-white">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">
        {icon}
      </div>
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-white/90">{description}</p>
    </div>
  );
}

export function ResultCard({
  icon,
  title,
  children,
  onCopy,
}: {
  icon: string;
  title: string;
  children: ReactNode;
  onCopy?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-status-green/10 text-base">
          {icon}
        </span>
        <h3 className="flex-1 text-sm font-bold text-neutral-900">{title}</h3>
        {onCopy && (
          <button
            onClick={onCopy}
            className="text-xs font-semibold text-neutral-400 hover:text-status-green"
          >
            Copy
          </button>
        )}
      </div>
      <div className="text-sm leading-relaxed text-neutral-800">
        {children}
      </div>
    </div>
  );
}

export function StepRow({ index, text }: { index: number; text: string }) {
  return (
    <div className="mb-3 flex items-start gap-3 last:mb-0">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-status-green text-xs font-bold text-white">
        {index}
      </span>
      <p className="text-sm leading-relaxed text-neutral-800">{text}</p>
    </div>
  );
}

export function UploadCard({
  fileName,
  onFileSelected,
  onClear,
  accept,
  capture,
  placeholder,
  supportedFormats,
}: {
  fileName: string | null;
  onFileSelected: (file: File) => void;
  onClear: () => void;
  accept: string;
  capture?: boolean;
  placeholder: string;
  supportedFormats: string;
}) {
  const inputId = `upload-${placeholder.replace(/\s+/g, "-")}${capture ? "-camera" : ""}`;

  return (
    <label
      htmlFor={inputId}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
        fileName
          ? "border-status-green bg-status-green/5"
          : "border-neutral-300 bg-white hover:border-status-green/50"
      }`}
    >
      <span className="text-3xl">{fileName ? "📄" : "⬆️"}</span>
      <span className="text-sm font-semibold text-neutral-900">
        {fileName ?? placeholder}
      </span>
      <span className="text-xs text-neutral-500">
        {fileName ? "Tap to change file" : supportedFormats}
      </span>
      {fileName && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onClear();
          }}
          className="mt-1 text-xs font-semibold text-status-red"
        >
          Remove file
        </button>
      )}
      <input
        id={inputId}
        type="file"
        accept={accept}
        capture={capture ? "environment" : undefined}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}
