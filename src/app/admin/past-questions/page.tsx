import { MaterialsList } from "@/components/admin/MaterialsList";

export default function AdminPastQuestionsPage() {
  return (
    <MaterialsList
      type="past_question"
      title="Past Questions"
      uploadHref="/admin/materials/upload?type=past_question"
    />
  );
}
