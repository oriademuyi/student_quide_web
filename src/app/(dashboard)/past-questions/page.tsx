import { StudentMaterialsBrowser } from "@/components/StudentMaterialsBrowser";

export default function PastQuestionsPage() {
  return (
    <StudentMaterialsBrowser
      type="past_question"
      icon="📋"
      accentColor="orange"
      title="Find Past Questions"
      subtitle="Enter your course code below to search for available past questions."
      emptyLabel="past question"
    />
  );
}
