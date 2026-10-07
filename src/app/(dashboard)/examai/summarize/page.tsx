"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { HeaderCard, ResultCard, UploadCard } from "@/components/examai/ExamAiWidgets";
import { summarize } from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";

type View = "summary" | "aoc";

export default function SummarizeMaterialPage() {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [aocTopics, setAocTopics] = useState<string[] | null>(null);
  const [view, setView] = useState<View>("summary");

  async function onSummarize(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.show("Upload your course material first", "error");
      return;
    }

    setIsLoading(true);
    setSummary(null);
    setAocTopics(null);
    setView("summary");
    try {
      const res = await summarize(file);
      setSummary(res.data.summary);
      setAocTopics(res.data.areasOfConcentration);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Failed to summarize. Please try again.";
      toast.show(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function onReset() {
    setSummary(null);
    setAocTopics(null);
    setFile(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <HeaderCard
        icon="📑"
        title="Summarize & Focus"
        description="Upload your course material and get a quick summary, plus the key areas of concentration (AOC) to focus your revision on."
      />

      <form onSubmit={onSummarize} className="flex flex-col gap-4">
        <UploadCard
          fileName={file?.name ?? null}
          onFileSelected={setFile}
          onClear={() => setFile(null)}
          accept=".pdf,.doc,.docx,image/jpeg,image/png"
          placeholder="Tap to upload your course material"
          supportedFormats="Supported formats: PDF, DOC, DOCX, JPG, PNG"
        />
        <Button type="submit" isLoading={isLoading}>
          Summarize
        </Button>
      </form>

      {summary && (
        <>
          <div className="flex gap-2 rounded-xl bg-white p-1 shadow-sm">
            <button
              onClick={() => setView("summary")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                view === "summary" ? "bg-status-green text-white" : "text-neutral-600"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setView("aoc")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                view === "aoc" ? "bg-status-green text-white" : "text-neutral-600"
              }`}
            >
              Areas of Concentration
            </button>
          </div>

          {view === "summary" ? (
            <ResultCard icon="📄" title="Summary">
              <p className="whitespace-pre-wrap">{summary}</p>
            </ResultCard>
          ) : (
            <ResultCard icon="🚩" title="Areas of Concentration">
              <ul className="flex flex-col gap-2">
                {aocTopics?.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span>⚡</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          <button
            onClick={onReset}
            className="text-sm font-semibold text-status-green"
          >
            Summarize Another
          </button>
        </>
      )}
    </div>
  );
}
