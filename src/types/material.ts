export type MaterialType = "material" | "past_question";

export interface MaterialFaculty {
  id: string;
  name: string;
}

export interface MaterialDepartment {
  id: string;
  name: string;
  faculty: MaterialFaculty | null;
}

export interface MaterialProgram {
  id: string;
  name: string;
  department: MaterialDepartment | null;
}

export interface MaterialItem {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string | null;
  program: MaterialProgram | null;
  level: string;
  semester: string;
  type: MaterialType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string | null;
}

export interface MaterialsMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface GetMaterialsResponse {
  status: string;
  message: string;
  data: {
    items: MaterialItem[];
    meta: MaterialsMeta;
  };
}

export interface DownloadMaterialResponse {
  status: string;
  message: string;
  data: {
    url: string;
  };
}
