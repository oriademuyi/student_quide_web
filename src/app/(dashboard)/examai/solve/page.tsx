"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  HeaderCard,
  ResultCard,
  StepRow,
  UploadCard,
} from "@/components/examai/ExamAiWidgets";
import { solve } from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";

type Mode = "type" | "upload";

export default function SolveQuestionPage() {
  const toast = useToast();
  const [mode, setMode] = useState<Mode>("type");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<string[] | null>(null);
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);

  async function onSolve(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "type" && !question.trim()) {
      toast.show("Type your question first", "error");
      return;
    }
    if (mode === "upload" && !file) {
      toast.show("Upload the question first", "error");
      return;
    }

    setIsLoading(true);
    setSteps(null);
    setFinalAnswer(null);
    try {
      const res = await solve({
        question: mode === "type" ? question.trim() : undefined,
        file: mode === "upload" ? file ?? undefined : undefined,
      });
      setSteps(res.data.steps);
      setFinalAnswer(res.data.finalAnswer);
    } catch (e) {
      const message = e instanceof ApiError ? e.message : "Failed to solve. Please try again.";
      toast.show(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function onReset() {
    setSteps(null);
    setFinalAnswer(null);
    setQuestion("");
    setFile(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <HeaderCard
        icon="✅"
        title="Get It Solved"
        description="Type your question or upload a picture/PDF of it, and we'll walk you through the answer step by step."
      />

      <div className="flex gap-2 rounded-xl bg-white p-1 shadow-sm">
        <button
          onClick={() => setMode("type")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            mode === "type" ? "bg-status-green text-white" : "text-neutral-600"
          }`}
        >
          Type Question
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            mode === "upload" ? "bg-status-green text-white" : "text-neutral-600"
          }`}
        >
          Upload Question
        </button>
      </div>

      <form onSubmit={onSolve} className="flex flex-col gap-4">
        {mode === "type" ? (
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            placeholder="Type your question here..."
          />
        ) : file ? (
          <UploadCard
            fileName={file.name}
            onFileSelected={setFile}
            onClear={() => setFile(null)}
            accept="application/pdf,image/jpeg,image/png"
            placeholder="Tap to upload your question"
            supportedFormats="Supported formats: PDF, JPG, JPEG, PNG"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <UploadCard
              fileName={null}
              onFileSelected={setFile}
              onClear={() => setFile(null)}
              accept="image/*"
              capture
              placeholder="Take a Photo"
              supportedFormats="Use your camera"
            />
            <UploadCard
              fileName={null}
              onFileSelected={setFile}
              onClear={() => setFile(null)}
              accept="application/pdf,image/jpeg,image/png"
              placeholder="Choose File"
              supportedFormats="PDF, JPG, JPEG, PNG"
            />
          </div>
        )}

        <Button type="submit" isLoading={isLoading}>
          Solve
        </Button>
      </form>

      {steps && (
        <>
          <ResultCard icon="✅" title="Step-by-Step Solution">
            {steps.map((step, i) => (
              <StepRow key={i} index={i + 1} text={step} />
            ))}
          </ResultCard>
          <ResultCard icon="🏁" title="Final Answer">
            <p className="font-semibold">{finalAnswer}</p>
          </ResultCard>
          <button
            onClick={onReset}
            className="text-sm font-semibold text-status-green"
          >
            Solve Another
          </button>
        </>
      )}
    </div>
  );
}
