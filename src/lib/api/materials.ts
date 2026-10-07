import { apiDelete, apiGet, apiPostForm } from "./client";
import { ApiEndpoints } from "./endpoints";
import type {
  DownloadMaterialResponse,
  GetMaterialsResponse,
  MaterialType,
} from "@/types/material";

export function getMaterials(params: { page?: number; limit?: number }) {
  return apiGet<GetMaterialsResponse>(ApiEndpoints.getMaterials, {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export interface UploadMaterialParams {
  file: File;
  title: string;
  courseCode: string;
  courseTitle: string;
  semester: "first" | "second";
  type: MaterialType;
  programId?: string;
  level?: string;
}

export function uploadMaterial(params: UploadMaterialParams) {
  const formData = new FormData();
  formData.set("file", params.file);
  formData.set("title", params.title);
  formData.set("courseCode", params.courseCode);
  formData.set("courseTitle", params.courseTitle);
  formData.set("semester", params.semester);
  formData.set("type", params.type);
  if (params.programId) formData.set("programId", params.programId);
  if (params.level) formData.set("level", params.level);

  return apiPostForm<{ status: string; message: string }>(
    ApiEndpoints.uploadMaterial,
    formData
  );
}

export function deleteMaterial(id: string) {
  return apiDelete<{ status: string; message: string }>(
    ApiEndpoints.deleteMaterial(id)
  );
}

export function downloadMaterial(id: string) {
  return apiGet<DownloadMaterialResponse>(ApiEndpoints.downloadMaterial(id));
}
