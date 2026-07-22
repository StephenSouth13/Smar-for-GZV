import { ProjectForm } from "@/components/admin/ProjectForm";
import { getSiteSettings } from "@/lib/data/settings";

export default async function NewProjectPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Thêm dự án</h1>
        <p className="text-ink-muted mt-1">Tạo trang chi tiết dự án mới.</p>
      </div>
      <ProjectForm categories={settings.projectCategories} />
    </div>
  );
}
