import { MaterialsList } from "@/components/admin/MaterialsList";

export default function AdminMaterialsPage() {
  return (
    <MaterialsList
      type="material"
      title="Course Materials"
      uploadHref="/admin/materials/upload?type=material"
    />
  );
}
