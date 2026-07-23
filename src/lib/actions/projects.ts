"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { projectSchema, type ProjectInput } from "@/lib/schema/content";
import {
  createProject,
  updateProject,
  updateProjectOrder,
  deleteProject,
  listProjects,
  getProjectById,
  isProjectSlugTaken,
  type ProjectDoc,
} from "@/lib/data/projects";

export async function listProjectsForPickerAction(): Promise<Pick<ProjectDoc, "id" | "title" | "published">[]> {
  await requireAdmin();
  const projects = await listProjects();
  return projects.map((p) => ({ id: p.id, title: p.title, published: p.published }));
}

export async function createProjectAction(data: ProjectInput) {
  await requireAdmin();
  const parsed = projectSchema.parse(data);
  if (await isProjectSlugTaken(parsed.slug)) {
    throw new Error(`Đường dẫn "/du-an/${parsed.slug}" đã được dùng cho dự án khác.`);
  }
  const id = await createProject(parsed);
  revalidatePath("/du-an");
  revalidatePath("/");
  return { id };
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  await requireAdmin();
  const parsed = projectSchema.parse(data);
  if (await isProjectSlugTaken(parsed.slug, id)) {
    throw new Error(`Đường dẫn "/du-an/${parsed.slug}" đã được dùng cho dự án khác.`);
  }
  await updateProject(id, parsed);
  revalidatePath("/du-an");
  revalidatePath(`/du-an/${parsed.slug}`);
  revalidatePath("/");
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await deleteProject(id);
  revalidatePath("/du-an");
  revalidatePath("/");
}

export async function duplicateProjectAction(id: string) {
  await requireAdmin();
  const source = await getProjectById(id);
  if (!source) throw new Error("Không tìm thấy dự án.");

  let slug = `${source.slug}-ban-sao`;
  let suffix = 2;
  while (await isProjectSlugTaken(slug)) {
    slug = `${source.slug}-ban-sao-${suffix}`;
    suffix += 1;
  }

  // projectSchema.parse() strips unrecognized keys, so passing the full doc
  // (which also has id/createdAt/updatedAt) is safe.
  const parsed = projectSchema.parse({ ...source, title: `${source.title} (Bản sao)`, slug, published: false, featured: false });
  const newId = await createProject(parsed);
  revalidatePath("/du-an");
  return { id: newId };
}

export async function reorderProjectsAction(orderedIds: string[]) {
  await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => updateProjectOrder(id, index)));
  revalidatePath("/du-an");
  revalidatePath("/");
}
