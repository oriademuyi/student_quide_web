import { StudentMaterialsBrowser } from "@/components/StudentMaterialsBrowser";

export default function MaterialsPage() {
  return (
    <StudentMaterialsBrowser
      type="material"
      icon="📖"
      accentColor="green"
      title="Find Your Course Material"
      subtitle="Enter your course code below to search for available course materials."
      emptyLabel="material"
    />
  );
}
