"use client";

import { useState } from "react";

export interface GuideStep {
  number: string;
  icon: string;
  title: string;
  description: string;
  details: string[];
}

function StepCard({ step }: { step: GuideStep }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 rounded-2xl bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-status-green font-bold text-white">
          {step.number}
        </span>
        <span className="flex-1 font-bold text-neutral-900">{step.title}</span>
        <span className="text-neutral-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-5">
          {step.description && (
            <div className="mb-4 flex items-start gap-3">
              <span className="text-xl">{step.icon}</span>
              <p className="text-sm leading-relaxed text-neutral-600">
                {step.description}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            {step.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5 text-status-green">✓</span>
                <p className="text-sm leading-snug text-neutral-700">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type Tab = "guide" | "video";

export function GuidePage({
  headerIcon,
  headerTitle,
  headerSubtitle,
  steps,
  checklistTitle,
  checklistItems,
}: {
  headerIcon: string;
  headerTitle: string;
  headerSubtitle: string;
  steps: GuideStep[];
  checklistTitle: string;
  checklistItems: string[];
}) {
  const [tab, setTab] = useState<Tab>("guide");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 rounded-xl bg-white p-1 shadow-sm">
        <button
          onClick={() => setTab("guide")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            tab === "guide" ? "bg-status-green text-white" : "text-neutral-600"
          }`}
        >
          Guide
        </button>
        <button
          onClick={() => setTab("video")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            tab === "video" ? "bg-status-green text-white" : "text-neutral-600"
          }`}
        >
          Video
        </button>
      </div>

      {tab === "video" ? (
        <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-200">
          <span className="text-5xl text-status-green">▶️</span>
          <p className="font-bold text-neutral-700">Video Tutorial Coming Soon</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl bg-status-green p-6 text-white">
            <span className="text-4xl">{headerIcon}</span>
            <h1 className="mt-3 text-2xl font-bold">{headerTitle}</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              {headerSubtitle}
            </p>
          </div>

          {steps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-neutral-900">
              {checklistTitle}
            </h2>
            <div className="flex flex-col gap-3">
              {checklistItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 text-status-green">✓</span>
                  <p className="text-sm text-neutral-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
