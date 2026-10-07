import { apiGet, apiPost, apiPostForm } from "./client";
import { ApiEndpoints } from "./endpoints";
import type {
  AiInteractionDownloadResponse,
  AiInteractionResponse,
  AiInteractionType,
  AiInteractionsListResponse,
  ExplainResponse,
  SolveResponse,
  SummarizeResponse,
} from "@/types/ai";

export function explain(course: string, statement: string) {
  return apiPost<ExplainResponse>(ApiEndpoints.aiExplain, {
    course,
    statement,
  });
}

export function solve(params: { question?: string; file?: File }) {
  const formData = new FormData();
  if (params.question) formData.set("question", params.question);
  if (params.file) formData.set("file", params.file);
  return apiPostForm<SolveResponse>(ApiEndpoints.aiSolve, formData);
}

export function summarize(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  return apiPostForm<SummarizeResponse>(ApiEndpoints.aiSummarize, formData);
}

export function getInteractions(params: {
  page?: number;
  limit?: number;
  type?: AiInteractionType;
}) {
  return apiGet<AiInteractionsListResponse>(ApiEndpoints.aiInteractions, {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    type: params.type,
  });
}

export function getInteraction(id: string) {
  return apiGet<AiInteractionResponse>(ApiEndpoints.aiInteractionById(id));
}

export function getInteractionDownloadUrl(id: string) {
  return apiGet<AiInteractionDownloadResponse>(
    ApiEndpoints.aiInteractionDownload(id)
  );
}
