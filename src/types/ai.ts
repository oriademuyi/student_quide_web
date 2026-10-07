export type AiInteractionType = "explain" | "solve" | "summarize";
export type AiInteractionStatus = "succeeded" | "failed" | "pending";

export interface ExplainData {
  id: string;
  explanation: string;
}

export interface ExplainResponse {
  status: string;
  message: string;
  data: ExplainData;
}

export interface SolveData {
  id: string;
  steps: string[];
  finalAnswer: string;
}

export interface SolveResponse {
  status: string;
  message: string;
  data: SolveData;
}

export interface SummarizeData {
  id: string;
  summary: string;
  areasOfConcentration: string[];
}

export interface SummarizeResponse {
  status: string;
  message: string;
  data: SummarizeData;
}

export interface AiInteraction {
  id: string;
  type: AiInteractionType;
  status: AiInteractionStatus;
  course: string | null;
  inputText: string | null;
  fileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  responseText: string | null;
  responseSteps: string[];
  responseFinalAnswer: string | null;
  responseSummary: string | null;
  responseAreasOfConcentration: string[];
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  errorMessage: string | null;
  createdAt: string | null;
}

export interface AiInteractionMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface AiInteractionsListResponse {
  status: string;
  message: string;
  data: {
    items: AiInteraction[];
    meta: AiInteractionMeta;
  };
}

export interface AiInteractionResponse {
  status: string;
  message: string;
  data: AiInteraction;
}

export interface AiInteractionDownloadResponse {
  status: string;
  message: string;
  data: {
    url: string;
  };
}
