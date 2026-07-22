import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, settings] = await Promise.all([getProjectById(id), getSiteSettings()]);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Chỉnh sửa dự án</h1>
        <p className="text-ink-muted mt-1">{project.title}</p>
      </div>
      <ProjectForm project={project} categories={settings.projectCategories} />
    </div>
  );
}
