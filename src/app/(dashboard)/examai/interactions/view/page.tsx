"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { HeaderCard, ResultCard, StepRow } from "@/components/examai/ExamAiWidgets";
import { getInteraction, getInteractionDownloadUrl } from "@/lib/api/ai";
import { ApiError } from "@/lib/api/client";

const TYPE_ICON: Record<string, string> = {
  explain: "💡",
  solve: "✅",
  summarize: "📑",
};

const TYPE_TITLE: Record<string, string> = {
  explain: "Explanation",
  solve: "Solved Question",
  summarize: "Material Summary",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB");
}

function AiInteractionDetailPageContent() {
  const id = useSearchParams().get("id") ?? "";
  const toast = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: interaction,
    error,
    isLoading,
    mutate: reload,
  } = useSWR(id ? ["interaction", id] : null, async ([, id]) => (await getInteraction(id)).data);

  const errorMessage = error
    ? error instanceof ApiError
      ? error.message
      : "Failed to load this interaction."
    : null;

  async function onViewFile() {
    setIsDownloading(true);
    try {
      const res = await getInteractionDownloadUrl(id);
      window.open(res.data.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Could not get the file's download link.";
      toast.show(message, "error");
    } finally {
      setIsDownloading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-status-green/30 border-t-status-green" />
      </div>
    );
  }

  if (error || !interaction) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-status-red">{errorMessage}</p>
        <Button onClick={() => reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <HeaderCard
        icon={TYPE_ICON[interaction.type] ?? "✨"}
        title={TYPE_TITLE[interaction.type] ?? interaction.type}
        description={interaction.createdAt ? formatDate(interaction.createdAt) : ""}
      />

      {interaction.status === "failed" ? (
        <ResultCard icon="⚠️" title="This interaction failed">
          <p>
            {interaction.errorMessage ||
              "Something went wrong while processing this request."}
          </p>
        </ResultCard>
      ) : (
        <>
          {interaction.course && (
            <div>
              <p className="text-xs font-semibold text-neutral-500">Course</p>
              <p className="text-sm">{interaction.course}</p>
            </div>
          )}
          {interaction.inputText && (
            <div>
              <p className="text-xs font-semibold text-neutral-500">
                {interaction.type === "solve" ? "Question" : "Statement"}
              </p>
              <p className="text-sm">{interaction.inputText}</p>
            </div>
          )}

          {interaction.type === "explain" && interaction.responseText && (
            <ResultCard icon="💡" title="Explanation">
              <p className="whitespace-pre-wrap">{interaction.responseText}</p>
            </ResultCard>
          )}

          {interaction.type === "solve" && (
            <>
              {interaction.responseSteps.length > 0 && (
                <ResultCard icon="✅" title="Step-by-Step Solution">
                  {interaction.responseSteps.map((step, i) => (
                    <StepRow key={i} index={i + 1} text={step} />
                  ))}
                </ResultCard>
              )}
              {interaction.responseFinalAnswer && (
                <ResultCard icon="🏁" title="Final Answer">
                  <p className="font-semibold">{interaction.responseFinalAnswer}</p>
                </ResultCard>
              )}
            </>
          )}

          {interaction.type === "summarize" && (
            <>
              {interaction.responseSummary && (
                <ResultCard icon="📄" title="Summary">
                  <p className="whitespace-pre-wrap">{interaction.responseSummary}</p>
                </ResultCard>
              )}
              {interaction.responseAreasOfConcentration.length > 0 && (
                <ResultCard icon="🚩" title="Areas of Concentration">
                  <ul className="flex flex-col gap-2">
                    {interaction.responseAreasOfConcentration.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>⚡</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>
              )}
            </>
          )}
        </>
      )}

      {interaction.fileName && (
        <Button isLoading={isDownloading} onClick={onViewFile}>
          View Uploaded File
        </Button>
      )}
    </div>
  );
}

export default function AiInteractionDetailPage() {
  return (
    <Suspense fallback={null}>
      <AiInteractionDetailPageContent />
    </Suspense>
  );
}
