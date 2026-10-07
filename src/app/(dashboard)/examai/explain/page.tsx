"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { HeaderCard, ResultCard } from "@/components/examai/ExamAiWidgets";
import { explain } from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";

export default function ExplainTopicPage() {
  const toast = useToast();
  const [course, setCourse] = useState("");
  const [statement, setStatement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  async function onExplain(e: React.FormEvent) {
    e.preventDefault();
    if (!statement.trim()) {
      toast.show("Type a statement or concept first", "error");
      return;
    }

    setIsLoading(true);
    setExplanation(null);
    try {
      const res = await explain(course.trim(), statement.trim());
      setExplanation(res.data.explanation);
    } catch (e) {
      const message = e instanceof ApiError ? e.message : "Failed to explain. Please try again.";
      toast.show(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function onReset() {
    setExplanation(null);
    setStatement("");
  }

  return (
    <div className="flex flex-col gap-5">
      <HeaderCard
        icon="💡"
        title="Explain It Simply"
        description="Write out a statement, definition or concept from your course and we'll break it down in easy terms."
      />

      <form onSubmit={onExplain} className="flex flex-col gap-4">
        <Input
          label="Course (optional)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="e.g. Introduction to Economics"
        />
        <Textarea
          label="Statement or concept"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          rows={5}
          placeholder="Paste or type the statement you want explained..."
        />
        <Button type="submit" isLoading={isLoading}>
          Explain
        </Button>
      </form>

      {explanation && (
        <>
          <ResultCard
            icon="💡"
            title="Explanation"
            onCopy={() => {
              navigator.clipboard.writeText(explanation);
              toast.show("Copied to clipboard");
            }}
          >
            <p className="whitespace-pre-wrap">{explanation}</p>
          </ResultCard>
          <button
            onClick={onReset}
            className="text-sm font-semibold text-status-green"
          >
            Explain Another
          </button>
        </>
      )}
    </div>
  );
}
