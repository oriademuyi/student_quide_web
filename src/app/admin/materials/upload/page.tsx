"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { uploadMaterial } from "@/lib/api/materials";
import { ApiError } from "@/lib/api/client";
import type { MaterialType } from "@/types/material";

function UploadForm() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const { mutate } = useSWRConfig();

  const presetType = searchParams.get("type") === "past_question" ? "past_question" : "material";

  const [type, setType] = useState<MaterialType>(presetType);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [semester, setSemester] = useState<"first" | "second">("first");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.show("Please select a file", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      // The API requires a `title` field; there's no separate title input
      // here (matching the mobile admin app), so we reuse the course title.
      await uploadMaterial({
        file,
        title: courseTitle.trim(),
        courseCode: courseCode.trim(),
        courseTitle: courseTitle.trim(),
        semester,
        type,
      });
      toast.show("Uploaded successfully");
      await mutate("materials");
      router.push(type === "past_question" ? "/admin/past-questions" : "/admin/materials");
    } catch (e) {
      toast.show(e instanceof ApiError ? e.message : "Failed to upload", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-neutral-900">Upload Material / Past Question</h1>

      <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-4">
        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value as MaterialType)}
          required
        >
          <option value="material">Material</option>
          <option value="past_question">Past Question</option>
        </Select>
        <Input
          label="Course Title"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          required
        />
        <Input
          label="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
        />
        <Select
          label="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value as "first" | "second")}
          required
        >
          <option value="first">First</option>
          <option value="second">Second</option>
        </Select>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">File</label>
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm"
          />
          <span className="text-xs text-neutral-500">
            Supported formats: PDF, JPG, JPEG, PNG
          </span>
        </div>

        <Button type="submit" isLoading={isSubmitting}>
          Upload
        </Button>
      </form>
    </div>
  );
}

export default function UploadMaterialPage() {
  return (
    <Suspense fallback={null}>
      <UploadForm />
    </Suspense>
  );
}
